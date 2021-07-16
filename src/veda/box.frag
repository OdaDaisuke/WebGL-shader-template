precision highp float;
uniform float time;
uniform vec2 resolution;

float unsigned_grid = 4.;
#define CB 1. / 255.
vec3 bg = vec3(CB * 89., CB * 135., CB * 151.);
vec3 bg2 = vec3(CB * 119., CB*159., CB*176.);
vec3 circlec = vec3(CB * 25., CB * 20., CB * 22.);

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 grid(vec2 uv)
{
  vec2 cres = resolution / (unsigned_grid * 2.);
  vec2 ipos = vec2(floor(uv));
  vec2 fpos = vec2(fract(uv));
  vec2 ori_fpos = fpos;
  // random per grid
  fpos -= (0.5 + rand(ipos) * 0.1);
  vec2 ori_uv = uv;
  uv.y -= .3 + sin(time) * .75;
  uv.x -= .3 + cos(time) * .75;
  vec3 base_bg = mix(bg, bg2, 1. - length(uv));
  vec3 with_noise = mix(base_bg, vec3(.0, .1, .1), rand(fpos) * .1);
  vec3 circle = vec3(.0);
  if (length(fpos) < .053 && length(fpos) > .038) {
    vec2 uv_gap = uv - ori_uv;
    // uv polar
    float r = atan(uv_gap.x, uv_gap.y);
    return mix(with_noise, circlec, (fpos.y + fpos.x) * abs(r) + .1);
    // return mix(with_noise, circlec, r);
    // return mix(with_noise, circlec, sin(((fpos.y - fpos.x)) * 10.));
  }
  if (ipos.x == -1.) {
    if (ori_fpos.x > .98) {
      return mix(with_noise, vec3(.18), rand(fpos) * .6);
    }
  }
  return with_noise;
}

void main() {
	vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	p *= unsigned_grid;
	vec3 col = vec3(.0);
	vec3 c = grid(p);
	gl_FragColor = vec4(c, 1.);
}
