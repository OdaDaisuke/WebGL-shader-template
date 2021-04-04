precision highp float;
uniform vec2 resolution;
uniform float time;
#define OCTAVES 10
float random (in vec2 point) {
    // http://www.matteo-basei.it/noise
    return fract(100.0 * sin(point.x + fract(100.0 * sin(point.y))));
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1., 0.));
    float c = random(i + vec2(0., 1.));
    float d = random(i + vec2(1., 1.));
    vec2 u = f * f * (3. - 2. * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// fractal brownian motion
// 非整数ブラウン運動
// https://thebookofshaders.com/13/?lan=jp
float fbm (in vec2 p) {
    float value = 0.;
    float amplitude = .5;
    float frequency = 1.;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * (noise((p - vec2(1.)) * frequency));
        frequency *= 1.9;
        amplitude *= .6;
    }
    return value;
}

// 3回fbmする
float pattern(in vec2 p) {
    vec2 aPos = vec2(sin(time * .005), sin(time * .01)) * 6.;
    vec2 aScale = vec2(3.);
    float a = fbm(p * aScale + aPos);

    vec2 bPos = vec2(sin(time * .01), sin(time * .01)) * 1.;
    // 0.4 ~ 1.4
    float bE = abs(sin(time * 0.005)) + 0.4;
    vec2 bScale = vec2(bE, bE);
    float b = fbm((p + a) * bScale + bPos);

    vec2 cPos = vec2(-.6, -.5) + vec2(sin(-time * .001), sin(time * .01)) * 2.;
    // 1.3 ~ 2.3
    float cE = abs(sin(time * 0.01)) + 1.3;
    vec2 cScale = vec2(cE, cE);
    float c = fbm((p + b) * cScale + cPos);
    return c;
}

vec3 palette(in float t) {
    // 輝度
    vec3 a = vec3(.94, .94, .94);
    // RGB exp
    vec3 b = vec3(.45, .25, .19);
    vec3 d = vec3(0.04, .02, 0.0);
    float TAU = 6.28318;
    return a + b * cos(TAU * (t + d));
}
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    float e = sin(time * 0.1) * .2;
    p.x = p.x + (e);
    p.y = p.y + (e);
    p.x *= resolution.x / resolution.y;
    float value = pow(pattern(p), 2.);
    vec3 color  = palette(value);

    gl_FragColor = vec4(color, 1.);
}
