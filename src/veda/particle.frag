#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

vec2 getPos(float j, float seedX, float seedY, float cr) {
  if (mod(j, 2.) == .0) {
    return vec2(cos(seedX) * cr, sin(seedY) * cr);
  }
  return vec2(sin(seedX) * cr, cos(seedY) * cr);
}

void main( void ) {
  vec2 r=resolution;
  vec2 p=(gl_FragCoord.xy * 2.0 - resolution ) /min(r.x,r.y);
  vec4 c = vec4(0);
  float pi = 3.1415 / 5.;
  for(float i = 1.0; i < 10.; i++) {
    for (float j = 1.0; j < 3.; j++) {
      float timeE = 2.5 - (0.35 * j * j);
      float radiusAmplitude = 0.05;
      float minClusterRadiusE = .72 * (j);
      float clusterRadius = 0.19 + ( (sin(time) + minClusterRadiusE) * (radiusAmplitude * j));
      float circleRadius = 0.0025;
      for (float rgb = .0; rgb < 3.; rgb++) {
        vec2 offset;
        float glitch = (mod(time, 1.5) < abs(tan(time) * 0.2)) ? 1. : 0.;
        float sinGlitch = sin(time);
        float glitchAmplitude = 0.095 - ( 0.0079 * j);
        float rgbE = (glitch * glitchAmplitude) * rgb;
        float seedX = time * timeE * pi * 0.52 * i + rgbE;
        float seedY = time * timeE * pi * 0.52 * i;
        vec2 pos = getPos(j, seedX, seedY, clusterRadius);
        float sc = circleRadius / abs(length(p + vec2(pos.x, pos.y)) );
        if (rgb == 1.) {
          c += vec4(sc * 2., .0, .0, 1.0);
        } else if (rgb == 2.) {
          c += vec4(.0, sc * 2., .0, 1.0);
        } else {
          c += vec4(.0, .0, sc * 2., 1.0);
        }
      }
    }
  }
  gl_FragColor=c;
}
