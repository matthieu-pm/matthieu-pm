// Studio lighting and dielectric response adapted from vercel-labs/vgpu (MIT).
// See SOURCE.md and VGPU-LICENSE. Geometry is rasterized with the original
// rounded normals; the interior is traced against the five optical planes.
export const vertexSource = `
attribute vec3 position;
attribute vec3 normal;
uniform vec4 orientation;
varying vec3 localPosition;
varying vec3 localNormal;
vec3 rotate(vec3 v, vec4 q) {
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}
void main() {
  localPosition = position;
  localNormal = normal;
  vec3 p = rotate(position, orientation);
  float depth = 3.6 - p.z;
  gl_Position = vec4(p.xy * (3.6 / 1.24),
    (10.0 + 0.1) / (10.0 - 0.1) * depth - 2.0 * 10.0 * 0.1 / (10.0 - 0.1), depth);
}
`

export const fragmentSource = `
precision highp float;
uniform vec4 orientation;
uniform vec4 planes[5];
uniform vec3 background;
varying vec3 localPosition;
varying vec3 localNormal;
vec3 rotate(vec3 v, vec4 q) {
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

float panel(vec3 direction, vec3 forward, vec2 size, float feather) {
  forward = normalize(forward);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
  vec3 up = cross(forward, right);
  float facing = dot(direction, forward);
  if (facing <= 0.01) return 0.0;
  vec2 local = abs(vec2(dot(direction, right), dot(direction, up)) / facing);
  vec2 mask = 1.0 - smoothstep(size, size + feather, local);
  return mask.x * mask.y;
}

vec3 studio(vec3 direction) {
  direction = normalize(direction);
  float floorBlend = 1.0 - smoothstep(-0.22, -0.02, direction.y);
  vec3 room = mix(vec3(0.00025, 0.0003, 0.0004), vec3(0.006, 0.007, 0.009), floorBlend);
  float backWall = (1.0 - smoothstep(-0.08, 0.08, direction.z)) * smoothstep(-0.28, -0.08, direction.y);
  room = mix(room, vec3(0.00002), backWall);
  float horizon = exp(-abs(direction.y + 0.1) * 22.0) * 0.0012;
  vec3 color = room + vec3(horizon, horizon * 0.96, horizon * 0.9);
  color += vec3(0.82, 0.84, 0.88) * panel(direction, vec3(-0.82, 0.08, 0.57), vec2(1.35, 1.1), 0.22) * 0.011;
  color += vec3(1.0, 0.97, 0.91) * panel(direction, vec3(0.0, -0.707, 0.707), vec2(0.38, 0.62), 0.18) * 0.22;
  color += vec3(0.76, 0.88, 1.0) * panel(direction, vec3(0.612, 0.354, 0.707), vec2(0.5, 0.16), 0.035) * 20.0;
  return color / (1.0 + color) + mix(vec3(0.045, 0.05, 0.06), vec3(0.075), background);
}

float fresnel(float facing) {
  return 0.059 + 0.941 * pow(1.0 - clamp(facing, 0.0, 1.0), 5.0);
}

float exitSurface(vec3 ro, vec3 rd, out vec3 n) {
  float nearest = 10000.0;
  n = vec3(0.0, 0.0, -1.0);
  for (int i = 0; i < 5; i++) {
    float denominator = dot(planes[i].xyz, rd);
    if (denominator > 0.00001) {
      float distance = (planes[i].w - dot(planes[i].xyz, ro)) / denominator;
      if (distance > 0.00001 && distance < nearest) {
        nearest = distance;
        n = planes[i].xyz;
      }
    }
  }
  return nearest;
}

void main() {
  vec3 normal = normalize(localNormal);
  vec4 inverseRotation = vec4(-orientation.xyz, orientation.w);
  vec3 eye = rotate(vec3(0.0, 0.0, 3.6), inverseRotation);
  vec3 incident = normalize(localPosition - eye);
  float facing = max(dot(-incident, normal), 0.0);
  float frontF = fresnel(facing);
  vec3 reflected = studio(rotate(reflect(incident, normal), orientation)) * 3.0;
  vec3 inside = refract(incident, normal, 1.0 / 1.645);
  vec3 backNormal;
  float distance = exitSurface(localPosition + inside * 0.0003, inside, backNormal);
  distance = min(distance, 4.0);
  vec3 backPoint = localPosition + inside * distance;
  // Follow internal reflections until the light can leave another face.
  // A single-exit approximation turns side views into opaque black faces.
  vec3 transmission = vec3(0.0);
  // Smoked glass provides contrast against the white page without a backdrop.
  vec3 transmittedBackground = background * vec3(0.035, 0.04, 0.05);
  vec3 rayPosition = localPosition + inside * 0.0003;
  vec3 rayDirection = inside;
  float energy = 1.0;
  for (int bounce = 0; bounce < 5; bounce++) {
    vec3 exitNormal;
    float travel = min(exitSurface(rayPosition, rayDirection, exitNormal), 4.0);
    vec3 exitPoint = rayPosition + rayDirection * travel;
    vec3 outgoing = refract(rayDirection, -exitNormal, 1.645);
    float reflection = fresnel(dot(rayDirection, exitNormal));
    if (dot(outgoing, outgoing) < 0.01) reflection = 1.0;
    transmission += energy * (1.0 - reflection) * transmittedBackground;
    transmission += energy * reflection * studio(rotate(reflect(rayDirection, exitNormal), orientation)) * (0.4 - background.r * 0.3);
    energy *= reflection;
    rayDirection = reflect(rayDirection, exitNormal);
    rayPosition = exitPoint + rayDirection * 0.0003;
  }
  transmission += energy * studio(rotate(rayDirection, orientation));
  transmission *= exp(-vec3(0.018, 0.014, 0.008) * distance) * mix(vec3(1.0), vec3(0.85), background);

  // The back edges are visible through the front, giving clear glass its depth.
  float backEdge = 10.0;
  for (int i = 0; i < 5; i++) {
    if (dot(planes[i].xyz, backNormal) < 0.999) {
      backEdge = min(backEdge, abs(planes[i].w - dot(planes[i].xyz, backPoint)));
    }
  }
  float backSeam = 1.0 - smoothstep(0.006, 0.025, backEdge);
  transmission = mix(transmission, mix(vec3(0.6), vec3(0.15), background), backSeam * 0.5);
  vec3 color = transmission * (1.0 - frontF) + reflected * frontF;
  float key = smoothstep(0.5, 0.82, dot(reflected / 3.0, vec3(0.2126, 0.7152, 0.0722)));
  color += reflected * key * 0.35;
  // Preserve the bevel's silver glint at icon scale, including in dark mode.
  float bevel = 1.0 - smoothstep(0.88, 0.999, abs(normal.z));
  vec3 worldNormal = rotate(normal, orientation);
  float edgeKey = pow(max(dot(worldNormal, normalize(vec3(0.65, 0.45, 0.8))), 0.0), 4.0);
  vec3 silver = (0.09 + edgeKey * 0.6) * vec3(0.86, 0.93, 1.0);
  color = mix(color + bevel * silver, mix(color, silver, bevel * 0.5), background);
  gl_FragColor = vec4(pow(clamp(color, 0.0, 1.0), vec3(1.0 / 2.2)), 1.0);
}
`
