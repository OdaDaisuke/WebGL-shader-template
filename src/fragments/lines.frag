#version 300 es
precision highp float;

in vec2 UV;
out vec4 out_color;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float ratio, time;

float random (in float x) {
    return fract(sin(x)*2000.);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st+v);
    return step(t, random(100.+p*.00005)+random(p.x)*0.5 );
}

void main() {
    vec2 resolution = vec2(540.0, 540.0);
    vec2 st = vec2(0.0);
    st.x = UV.x * ratio;
    st.y = UV.y * ratio;

    vec2 grid = vec2(100.,480.);
    st *= grid;

    vec2 ipos = floor(st);
    vec2 fpos = fract(st);

    vec2 vel = vec2(0.0);
    vel.x = time * 0.5 * max(grid.x,grid.y);
    vel.x *= -1.0 * random(1.0 + ipos.y) - .2; // direction
    vel.y = 0.0;

    vec2 offset = vec2(random(sin(time)) * 2.0, 0.);

    vec3 color = vec3(0.);
    color.r = pattern(st+offset,vel,0.5+0.8/resolution.x);
    color.g = pattern(st,vel,0.5 + 0.8/resolution.x);
    color.b = pattern(st-offset,vel,0.5+0.8/resolution.x);
    color *= step(0.889, fpos.y);
    out_color = vec4(1.0-color,1.0);
}
