"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { registerWebMcpTools } from "@/lib/webmcp"

export function WebMcp({ paths }: { paths: string[] }) {
  const router = useRouter()

  useEffect(() => {
    let controller: AbortController
    const start = () => {
      controller = new AbortController()
      void registerWebMcpTools(
        {
          document: document as Parameters<
            typeof registerWebMcpTools
          >[0]["document"],
          navigator: navigator as Parameters<
            typeof registerWebMcpTools
          >[0]["navigator"],
          fetch: window.fetch.bind(window),
          navigate: (path) => router.push(path),
          paths,
        },
        controller.signal
      )
    }
    const stop = () => controller.abort()
    const restore = () => {
      if (controller.signal.aborted) start()
    }
    start()
    window.addEventListener("pagehide", stop)
    window.addEventListener("pageshow", restore)
    return () => {
      stop()
      window.removeEventListener("pagehide", stop)
      window.removeEventListener("pageshow", restore)
    }
  }, [router, paths])

  return null
}
