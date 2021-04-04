#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float ra = max(resolution.x, resolution.y);
	vec2 p = (( gl_FragCoord.xy / ra ) - vec2(.5, .25));

	float r = 1.;
	float g = 0.;
	float b = 0.;

	float z = -time;

	float size = 0.2;

	float d = sqrt((p.x*p.x)+(p.y*p.y));

	if (d < size) {
		r = 1.;
		g = 1.;
		b = 1.;
		float bs = size / 7.4;
		if (abs(p.x) < bs && abs(p.y) < bs*5.) {
			r = 0.;
			b = 0.;
			g = 0.;
		}
		if (abs(p.y) < bs && abs(p.x) < bs*5.) {
			r = 0.;
			b = 0.;
			g = 0.;
		}
		if (abs(p.x+bs*4.) < bs && abs(p.y-bs*3.) < bs*2.) {
			r = 0.;
			b = 0.;
			g = 0.;
		}
		if (abs(p.x-bs*4.) < bs && abs(p.y+bs*3.) < bs*2.) {
			r = 0.;
			b = 0.;
			g = 0.;
		}
		if (abs(p.y-bs*4.) < bs && abs(p.x-bs*3.) < bs*2.) {
			r = 0.;
			b = 0.;
			g = 0.;
		}
		if (abs(p.y+bs*4.) < bs && abs(p.x+bs*3.) < bs*2.) {
			r = 0.;
			b = 0.;
			g = 0.;
		}

	}

	gl_FragColor = vec4( vec3( r, g, b ), 1.0 );

}
