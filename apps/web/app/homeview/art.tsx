import geometry from "./geometry.json"
import { HomeViewLive } from "./live"

// Precomputed, audited paths stay on the server. The client receives SVG elements.
export function HomeView() {
  const hardware = (
    <g
      key="homeview-hardware"
      aria-hidden="true"
      transform={`translate(${geometry.offset[0]} ${geometry.offset[1]})`}
    >
      <ellipse
        cx={geometry.shadow[0]}
        cy={geometry.shadow[1]! + 3}
        rx="84"
        ry="11"
        fill="#000"
        opacity=".12"
        filter="url(#hv-shadow)"
      />
      {geometry.solids.map(({ name, paths, material, details }) => (
        <g
          key={name}
          className={`iso-solid ${material}`}
          data-seamless={paths.seamless ? "" : undefined}
        >
          <path className="iso-fill" d={paths.fill} />
          {paths.shades.map((d, shade) =>
            d ? (
              <path
                key={shade}
                className="iso-shade"
                data-shade={shade}
                d={d}
              />
            ) : null
          )}
          <path className="iso-top" d={paths.top} />
          {details ? <g dangerouslySetInnerHTML={{ __html: details }} /> : null}
          <path className="iso-line iso-edge" d={paths.outline} />
        </g>
      ))}
      <circle
        cx={geometry.camera[0]}
        cy={geometry.camera[1]}
        r="2.3"
        fill="#25272a"
      />
      <circle
        cx={geometry.camera[0]! - 0.4}
        cy={geometry.camera[1]! - 0.5}
        r=".8"
        fill="#414c59"
      />
      <circle
        cx={geometry.camera[0]! - 12}
        cy={geometry.camera[1]! - 1}
        r=".7"
        fill="#303033"
      />
      <circle
        cx={geometry.camera[0]! + 12}
        cy={geometry.camera[1]! + 1}
        r=".7"
        fill="#303033"
      />
    </g>
  )
  return (
    <HomeViewLive hardware={hardware} screenMatrix={geometry.screenMatrix} />
  )
}
