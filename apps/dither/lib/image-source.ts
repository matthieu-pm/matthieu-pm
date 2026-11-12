import { lookup } from "node:dns/promises"
import { get } from "node:https"
import { isIP } from "node:net"
import ipaddr from "ipaddr.js"
import { MAX_BASE64_BYTES, MAX_REMOTE_BYTES } from "./schema"

export function isPublicAddress(address: string) {
  try {
    return ipaddr.process(address).range() === "unicast"
  } catch {
    return false
  }
}

export function validateImageUrl(value: string) {
  const url = new URL(value)
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    (url.port && url.port !== "443")
  ) {
    throw new Error(
      "Use a public HTTPS image URL on port 443 without credentials"
    )
  }
  if (
    url.hostname === "localhost" ||
    url.hostname.endsWith(".localhost") ||
    url.hostname.endsWith(".local")
  ) {
    throw new Error("Private image URLs are not allowed")
  }
  return url
}

export function decodeBase64(value: string) {
  const raw = value.replace(/^data:image\/(?:png|jpeg|webp|avif);base64,/i, "")
  if (!raw || raw.length % 4 === 1 || !/^[A-Za-z0-9+/]+={0,2}$/.test(raw))
    throw new Error("Invalid image base64")
  const data = Buffer.from(raw, "base64")
  if (data.length > MAX_BASE64_BYTES)
    throw new Error(
      "Base64 input exceeds 2.75 MB; use an image URL or a smaller image"
    )
  return data
}

export async function fetchImage(
  value: string,
  redirects = 0,
  deadline = Date.now() + 12_000
): Promise<Buffer> {
  if (redirects > 3) throw new Error("Too many image redirects")
  if (Date.now() >= deadline) throw new Error("Image download timed out")
  const url = validateImageUrl(value)
  const hostname = url.hostname.replace(/^\[|\]$/g, "")
  // Pin the connection to a validated address; a second DNS lookup could rebind it.
  const addresses = isIP(hostname)
    ? [{ address: hostname, family: isIP(hostname) }]
    : await Promise.race([
        lookup(hostname, { all: true }),
        new Promise<never>((_, reject) => {
          const t = setTimeout(
            () => reject(new Error("DNS lookup timed out")),
            Math.max(1, deadline - Date.now())
          )
          t.unref()
        }),
      ])
  if (
    !addresses.length ||
    addresses.some(({ address }) => !isPublicAddress(address))
  )
    throw new Error("Private or reserved image addresses are not allowed")
  const address = addresses[0]!
  const response = await new Promise<{ data?: Buffer; redirect?: string }>(
    (resolve, reject) => {
      const request = get(
        {
          hostname: address.address,
          family: address.family,
          servername: isIP(hostname) ? undefined : hostname,
          port: 443,
          path: url.pathname + url.search,
          headers: {
            Host: url.host,
            Accept: "image/png,image/jpeg,image/webp,image/avif",
            "User-Agent": "Dither/1.0 (+https://dither.matthieu.pm)",
          },
          agent: false,
          signal: AbortSignal.timeout(Math.max(1, deadline - Date.now())),
        },
        (res) => {
          if (
            [301, 302, 303, 307, 308].includes(res.statusCode ?? 0) &&
            res.headers.location
          ) {
            res.destroy()
            resolve({ redirect: new URL(res.headers.location, url).href })
            return
          }
          if (res.statusCode !== 200) {
            res.destroy()
            reject(new Error("The image URL did not return HTTP 200"))
            return
          }
          if (Number(res.headers["content-length"]) > MAX_REMOTE_BYTES) {
            res.destroy()
            reject(new Error("Remote image exceeds 8 MB"))
            return
          }
          const chunks: Buffer[] = []
          let length = 0
          res.on("data", (chunk: Buffer) => {
            length += chunk.length
            if (length > MAX_REMOTE_BYTES) {
              res.destroy()
              reject(new Error("Remote image exceeds 8 MB"))
              return
            }
            chunks.push(chunk)
          })
          res.on("error", reject)
          res.on("end", () => resolve({ data: Buffer.concat(chunks) }))
        }
      )
      request.on("error", () =>
        reject(new Error("Could not download the image over HTTPS"))
      )
    }
  )
  if (response.redirect)
    return fetchImage(response.redirect, redirects + 1, deadline)
  return response.data!
}
