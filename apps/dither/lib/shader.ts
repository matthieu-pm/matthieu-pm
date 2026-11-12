/** WebGL 2 fragment shader equivalent of ditherPixels. Sample texture uses sRGB bytes. */
export const fragmentShader = `#version 300 es
precision highp float;
precision highp int;
uniform sampler2D u_image;
uniform ivec2 u_resolution;
uniform int u_pixel_size;
uniform int u_color_levels;
uniform float u_strength;
uniform float u_grain;
out vec4 fragColor;
float bayer2(ivec2 p) { return float((2 * (p.x & 1) + 3 * (p.y & 1)) % 4); }
float bayer8(ivec2 p) { return (16.0*bayer2(p) + 4.0*bayer2(p>>1) + bayer2(p>>2) + 0.5)/64.0; }
float noise(ivec2 p, uint channel) {
  uint h = uint(p.x)*374761393u ^ uint(p.y)*668265263u ^ (channel+1u)*1274126177u;
  h = (h ^ (h>>13u))*1274126177u;
  h ^= h>>16u;
  return float(h & 65535u)/65535.0-0.5;
}
void main() {
  // Texture row 0 is the image top; upload without UNPACK_FLIP_Y_WEBGL.
  ivec2 p=ivec2(int(gl_FragCoord.x),u_resolution.y-1-int(gl_FragCoord.y));
  vec4 original=texelFetch(u_image,p,0);
  if(u_strength==0.0){fragColor=original;return;}
  ivec2 cell=p/u_pixel_size;
  ivec2 samplePoint=min(u_resolution-1,ivec2((vec2(cell)+0.5)*float(u_pixel_size)));
  vec3 color=texelFetch(u_image,samplePoint,0).rgb;
  vec3 grain=vec3(noise(cell,0u),noise(cell,1u),noise(cell,2u))*u_grain;
  float levels=float(u_color_levels-1);
  vec3 quantized=floor(clamp(color+grain,0.0,1.0)*levels+bayer8(cell))/levels;
  fragColor=vec4(mix(color,quantized,u_strength),original.a);
}`
