import { prismMeshData, prismPlanes } from "./vgpu-prism-mesh"
import { vertexSource, fragmentSource } from "./vgpu-glass-shaders"

type Vec3 = [number, number, number]
type Quaternion = [number, number, number, number]

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}
function normalize(v: Vec3): Vec3 {
  const length = Math.hypot(...v) || 1
  return v.map((n) => n / length) as Vec3
}
function multiply(a: Quaternion, b: Quaternion): Quaternion {
  const c = cross([a[0], a[1], a[2]], [b[0], b[1], b[2]])
  const q: Quaternion = [
    a[3] * b[0] + b[3] * a[0] + c[0],
    a[3] * b[1] + b[3] * a[1] + c[1],
    a[3] * b[2] + b[3] * a[2] + c[2],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ]
  const length = Math.hypot(...q)
  return q.map((n) => n / length) as Quaternion
}
function axisRotation(axis: Vec3, angle: number): Quaternion {
  const s = Math.sin(angle / 2)
  return [axis[0] * s, axis[1] * s, axis[2] * s, Math.cos(angle / 2)]
}

const modelScale = Math.sqrt(3) / 0.57
const mesh = prismMeshData()
for (let i = 0; i < mesh.vertices.length; i += 6) {
  mesh.vertices[i]! *= modelScale
  mesh.vertices[i + 1]! *= modelScale
  mesh.vertices[i + 2]! *= modelScale
}
const planes = new Float32Array(
  prismPlanes().flatMap((p) => [p[0], p[1], p[2], p[3] * modelScale])
)

export function createGlassTriangle(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
  })
  if (!gl) return null
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader)
      gl.deleteShader(shader)
      throw new Error(message ?? "Glass shader compilation failed")
    }
    return shader
  }
  const vertex = compile(gl.VERTEX_SHADER, vertexSource)
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource)
  const program = gl.createProgram()!
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }
  gl.useProgram(program)
  const buffer = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, "position")
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 24, 0)
  const normal = gl.getAttribLocation(program, "normal")
  gl.enableVertexAttribArray(normal)
  gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 24, 12)
  const indices = gl.createBuffer()!
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  gl.cullFace(gl.BACK)
  gl.clearColor(0, 0, 0, 0)
  gl.uniform4fv(gl.getUniformLocation(program, "planes[0]"), planes)
  const orientationLocation = gl.getUniformLocation(program, "orientation")
  const backgroundLocation = gl.getUniformLocation(program, "background")
  const initial = multiply(
    axisRotation([0, 0, 1], 0),
    multiply(axisRotation([0, 1, 0], -0.13), axisRotation([1, 0, 0], 0.08))
  )
  let orientation = initial
  let frame = 0
  let disposed = false
  let pointer: number | null = null
  let previous: Vec3 = [0, 0, 1]
  const draw = () => {
    frame = 0
    if (disposed || gl.isContextLost()) return
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const dpr = Math.min(window.devicePixelRatio || 1, 3)
    const width = Math.round(rect.width * dpr)
    const height = Math.round(rect.height * dpr)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
    gl.viewport(0, 0, width, height)
    const paper = getComputedStyle(canvas).getPropertyValue("--paper").trim()
    const isDark = paper === "#000" || paper === "#000000"
    gl.uniform3f(
      backgroundLocation,
      isDark ? 0 : 1,
      isDark ? 0 : 1,
      isDark ? 0 : 1
    )
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.uniform4fv(orientationLocation, orientation)
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0)
  }
  const schedule = () => {
    if (!frame && !disposed) frame = requestAnimationFrame(draw)
  }
  const project = (event: PointerEvent): Vec3 => {
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (rect.top + rect.height / 2 - event.clientY) / (rect.height / 2)
    return normalize([x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y))])
  }
  const down = (event: PointerEvent) => {
    if (event.button !== 0 || pointer !== null) return
    pointer = event.pointerId
    previous = project(event)
    canvas.setPointerCapture(pointer)
    canvas.dataset.dragging = "true"
    canvas.focus({ preventScroll: true })
  }
  const move = (event: PointerEvent) => {
    if (event.pointerId !== pointer) return
    const current = project(event)
    const axis = cross(previous, current)
    const dot = previous.reduce((sum, v, i) => sum + v * current[i]!, 0)
    if (Math.hypot(...axis) > 0.00001) {
      orientation = multiply(
        axisRotation(
          normalize(axis),
          Math.acos(Math.max(-1, Math.min(1, dot))) * 1.5
        ),
        orientation
      )
      schedule()
    }
    previous = current
  }
  const up = (event: PointerEvent) => {
    if (event.pointerId !== pointer) return
    pointer = null
    delete canvas.dataset.dragging
    if (canvas.hasPointerCapture(event.pointerId))
      canvas.releasePointerCapture(event.pointerId)
  }
  const keydown = (event: KeyboardEvent) => {
    const directions: Record<string, [Vec3, number]> = {
      ArrowLeft: [[0, 1, 0], -0.18],
      ArrowRight: [[0, 1, 0], 0.18],
      ArrowUp: [[1, 0, 0], -0.18],
      ArrowDown: [[1, 0, 0], 0.18],
    }
    const direction = directions[event.key]
    if (!direction && event.key !== "Home") return
    event.preventDefault()
    orientation = direction
      ? multiply(
          axisRotation(event.shiftKey ? [0, 0, 1] : direction[0], direction[1]),
          orientation
        )
      : initial
    schedule()
  }
  canvas.addEventListener("pointerdown", down)
  canvas.addEventListener("pointermove", move)
  canvas.addEventListener("pointerup", up)
  canvas.addEventListener("pointercancel", up)
  canvas.addEventListener("lostpointercapture", up)
  canvas.addEventListener("keydown", keydown)
  const resize = new ResizeObserver(schedule)
  resize.observe(canvas)
  const themeObserver = new MutationObserver(schedule)
  const themeRoot = canvas.closest("[data-theme]")
  if (themeRoot)
    themeObserver.observe(themeRoot, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })
  const systemTheme = matchMedia("(prefers-color-scheme: dark)")
  systemTheme.addEventListener("change", schedule)
  schedule()
  return () => {
    disposed = true
    cancelAnimationFrame(frame)
    resize.disconnect()
    themeObserver.disconnect()
    systemTheme.removeEventListener("change", schedule)
    canvas.removeEventListener("pointerdown", down)
    canvas.removeEventListener("pointermove", move)
    canvas.removeEventListener("pointerup", up)
    canvas.removeEventListener("pointercancel", up)
    canvas.removeEventListener("lostpointercapture", up)
    canvas.removeEventListener("keydown", keydown)
    gl.deleteBuffer(buffer)
    gl.deleteBuffer(indices)
    gl.deleteProgram(program)
  }
}
