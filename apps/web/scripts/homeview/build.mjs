import { writeFileSync } from "node:fs"
import * as k from "./kit/iso-kit.mjs"
import * as G from "./kit/lathe.mjs"
import * as A from "./kit/audit.mjs"

const P = k.fitProjection(
  [
    [-83, -43, 0],
    [83, 48, 216],
  ],
  640,
  400,
  { pad: 32, azimuth: 68, elevation: 16 }
)
const R = A.recorder(P)
const FLOOR = { o: [0, 0, 0], a: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] }
// Keep the display low, just above the grille, and ahead of the domed shell.
const PANEL = { o: [0, 41, 110], a: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] }
const solids = []
function put(name, paths, shape, material = "metal", details = "") {
  shape.name = name
  R.solid(shape)
  const svg = k.solidSvg(paths, {
    crease: "none",
    tone: "faint",
    className: material,
    inner: details,
  })
  R.put({ name, svg, shapes: [shape] })
  solids.push({ name, paths, material, details })
}
function disc(name, z0, z1, r, material = "metal", ground = false) {
  put(
    name,
    G.disc(z0, z1, r, FLOOR, P),
    A.disc(FLOOR, z0, z1, r, { ground }),
    material
  )
}
disc("rubber-foot", 0, 2, 38, "rubber", true)
disc("bottom-rim", 2, 3, 40)
disc("speaker-core", 3, 30, 40, "base")
// Curved grille panels meet the speaker surface flush; their perforations follow it.
for (let i = 0; i < 36; i++) {
  const a0 = (i * Math.PI) / 18,
    a1 = ((i + 1) * Math.PI) / 18
  const ring = []
  for (let j = 0; j <= 4; j++) {
    const a = a0 + ((a1 - a0) * j) / 4
    ring.push([40.18 * Math.cos(a), 40.18 * Math.sin(a)])
  }
  for (let j = 4; j >= 0; j--) {
    const a = a0 + ((a1 - a0) * j) / 4
    ring.push([40 * Math.cos(a), 40 * Math.sin(a)])
  }
  let holes = ""
  for (let row = 0; row < 11; row++)
    for (let col = 0; col < 3; col++) {
      const a = a0 + ((col + 0.5 + (row % 2) * 0.16) * (a1 - a0)) / 3
      const normal = [Math.cos(a), Math.sin(a), 0]
      if (G.dot3(normal, G.viewOf(P)) <= 0.03) continue
      const [x, y] = k.iso(
        [40.19 * Math.cos(a), 40.19 * Math.sin(a), 4.6 + row * 2.3],
        P
      )
      const facing = G.dot3(normal, G.viewOf(P))
      holes += `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${(0.62 * facing * k.cameraOf(P).k).toFixed(2)}" ry="${(0.62 * k.cameraOf(P).k).toFixed(2)}" fill="var(--hv-hole)" opacity="${(0.35 + 0.45 * facing).toFixed(2)}"/>`
    }
  put(
    `grille-${i}`,
    G.prismOf(FLOOR, ring, 3, 30, P),
    A.prism(FLOOR, ring, 3, 30),
    "grille",
    holes
  )
}
const profile = Array.from({ length: 25 }, (_, i) => {
  const z = 30 + (i * 35) / 24
  return [z, Math.sqrt(40 * 40 - (z - 30) ** 2), 1]
})
put(
  "speaker-dome",
  G.solidOf(profile, FLOOR, P, {
    smooth: { slope: (z) => -(z - 30) / Math.sqrt(1600 - (z - 30) ** 2) },
  }),
  A.solid(FLOOR, profile),
  "dome"
)
disc("neck-collar", 65, 75, Math.sqrt(375))
const HINGE = G.frameAlong([0, 0, 83], [0, 1, 0])
put("hinge-barrel", G.disc(0, 38, 8, HINGE, P), A.disc(HINGE, 0, 38, 8))
put("hinge-cap", G.disc(38, 41, 10, HINGE, P), A.disc(HINGE, 38, 41, 10))
function panel(name, plan, from, to, material) {
  const ring = k.roundedPlan(plan, 12)
  put(
    name,
    G.prismOf(PANEL, ring, from, to, P),
    A.prism(PANEL, ring, from, to),
    material
  )
}
panel("display-rear", { x: -76, y: -76, w: 152, d: 152, r: 23 }, 0, 5, "metal")
panel("display-rim", { x: -76, y: -76, w: 152, d: 152, r: 23 }, 5, 6.2, "rim")
panel(
  "display-bezel",
  { x: -74.5, y: -74.5, w: 149, d: 149, r: 22 },
  6.2,
  7.2,
  "bezel"
)
panel(
  "display-glass",
  { x: -65, y: -65, w: 130, d: 130, r: 17 },
  7.2,
  7.4,
  "glass"
)
A.settle(R, P)
const ordered = R.settled.items
  .slice()
  .sort((a, b) => a.key - b.key)
  .map((item) => solids.find((s) => s.name === item.name))
// Center the complete silhouette without changing its scale or physical geometry.
const bounds = R.items.map((item) => A.markupBox(item.svg))
const offset = [
  320 -
    (Math.min(...bounds.map((b) => b[0])) +
      Math.max(...bounds.map((b) => b[2]))) /
      2,
  200 -
    (Math.min(...bounds.map((b) => b[1])) +
      Math.max(...bounds.map((b) => b[3]))) /
      2,
]
const glassY = PANEL.o[1] + 7.4
const glassTop = PANEL.o[2] + 65
const at = k.iso([-65, glassY, glassTop], P),
  x = k.iso([-64, glassY, glassTop], P),
  y = k.iso([-65, glassY, glassTop - 1], P)
const matrix = `matrix(${x[0] - at[0]} ${x[1] - at[1]} ${y[0] - at[0]} ${y[1] - at[1]} ${at[0] + offset[0]} ${at[1] + offset[1]})`
const projected = (p) => k.iso(p, P)
const camera = projected([0, glassY + 0.1, PANEL.o[2] + 71])
const output = {
  width: 640,
  height: 400,
  solids: ordered,
  offset,
  screenMatrix: matrix,
  camera,
  scale: k.cameraOf(P).k,
  shadow: projected([0, 0, 0]),
}
writeFileSync(
  new URL("../../app/homeview/geometry.json", import.meta.url),
  JSON.stringify(output)
)
console.log(
  `HomeView: ${solids.length} physical solids, ${Math.round(JSON.stringify(output).length / 1024)} KB geometry`
)
A.auditOrExit(R, P)
