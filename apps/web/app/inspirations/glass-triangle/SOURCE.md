# VGPU glass prism

Adapted from [vercel-labs/vgpu](https://github.com/vercel-labs/vgpu), the
implementation behind [vgpu.sh](https://vgpu.sh/). The upstream MIT license
is included in `VGPU-LICENSE`.

Source directory: `apps/docs/app/[lang]/(home)/components/prism-background/`.

- `vgpu-prism-mesh.ts` adapts `scene/prism-mesh.ts`: the original triangular
  prism proportions, rounded corners, beveled edges, and surface normals.
  Its position is centered and scaled to fit the existing 96px icon.
- `vgpu-glass-shaders.ts` ports the studio panels from
  `environment/environment.wgsl` and adapts the dielectric response in
  `pipelines/shared/glass/` to WebGL. The local shader traces the interior
  against the five prism planes.
- The surrounding canvas stays transparent. Glass uses a dark smoked tint in light mode; the source site's background and full-width beams are omitted.
- `renderer.ts` retains unrestricted quaternion trackball rotation, pointer
  capture, keyboard controls, on-demand rendering, and resource cleanup.
