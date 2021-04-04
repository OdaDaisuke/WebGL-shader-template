#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;

#define iTime time
#define iResolution resolution

#define rot(a) mat2( cos(a),-sin(a),sin(a),cos(a) )
#define pi 3.141592653
float smoothtrig(float b, float wv){
  return sqrt((1.0+b*b)/(1.0+b*b*wv*wv))*wv;
}

float squares(vec2 uv, float t)
{
    float wdth = .5*iResolution.x/iResolution.y-0.1;

    vec2 cent = vec2(wdth,0.38)
                *clamp(vec2(smoothtrig(4.0,sin(t*2.0)),smoothtrig(4.0,cos(t*2.0))),-.95,.95);
    vec2 d = abs(uv+cent);

    float o = step(max(d.x,d.y),0.15);
    return o;
}
float rects(vec2 uv, float t)
{
    uv*=rot(t);
    vec2 cent = vec2(sin(t*3.5)+1.5,cos(t*3.5)+1.5);
    vec2 d = abs(uv*cent);

    float o = step(max(d.x,d.y),0.3);
          o -= step(max(d.x,d.y),0.15);
          return o;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float t = iTime;
    vec2 R = iResolution.xy;
    vec2 uv = (fragCoord-.5*R.xy)/R.y;
    vec2 uv2 = uv;
    const float c = 10.0;
    vec3 col= 0.5*vec3(30.,14.,256.)/256.*length(uv*0.6);

    for(int i = 0; i<int(c); i++){
        float fi  = float(i);
        uv2*=rot(-fi*-0.03);
        uv*=1.0+(fi/c)*0.1;
        col.r += (1.3/c)*rects(uv2,t+fi*0.1)*2.0;
        col.g += (1.3/c)*rects(uv2,t+fi*0.1);

        col.r += (1.2/c)*squares(uv,t+fi*0.01)+(1.2/c)
                        *squares(uv,t+fi*0.01+pi/2.0);
        col   +=((1.2/c)*squares(uv,t+fi*0.01+pi/4.0)+(1.2/c)
                        *squares(uv,t+fi*0.01+pi*0.75))
                        *vec3(31.,255.,255.)/256.;
    }
    fragColor = vec4(col,1.0);
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
