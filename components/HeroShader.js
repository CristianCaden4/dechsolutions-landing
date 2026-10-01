'use client';

import { useEffect, useRef } from 'react';

/*
  Hand-written WebGL1 shader, in the spirit of a Swirl + ChromaFlow + FlutedGlass + FilmGrain stack:
   - swirl:  domain-warped noise between two near-black blues
   - flow:   cyan light that follows the pointer with momentum (8-point trail); an autopilot path
             keeps it alive on touch devices and when the pointer is idle
   - glass:  rounded flutes at an angle, refracting the field with RGB aberration and a top highlight
   - grain:  per-frame noise
  No third-party shader package: it runs everywhere WebGL runs and carries no license terms.
*/

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uTrail[8];
uniform float uScroll;
uniform float uEnergy;
uniform float uAngle;
uniform float uFreq;
uniform vec3 uBaseA;
uniform vec3 uBaseB;
uniform vec3 uFlowA;
uniform vec3 uFlowB;

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<4;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}

vec3 field(vec2 uv, vec2 asp, vec2 warp){
  vec2 p = uv*asp;
  float n = fbm(p*1.7 + warp*1.7 + vec2(uTime*.02,-uTime*.015));
  vec3 col = mix(uBaseA, uBaseB, smoothstep(.15,.95,n));
  float c = 0.;
  for(int i=0;i<8;i++){
    vec2 d = (uv-uTrail[i])*asp + (warp-.5)*.28;
    c += exp(-dot(d,d)*7.5) * (1.-float(i)/9.);
  }
  c /= 3.4;
  vec3 flow = mix(uFlowB, uFlowA, smoothstep(.3,.8,n));
  return col + flow*c*uEnergy*(.5+.7*n);
}

void main(){
  vec2 uv = gl_FragCoord.xy/uRes;
  vec2 asp = vec2(uRes.x/uRes.y,1.);
  vec2 p = uv*asp;
  vec2 warp = vec2(fbm(p*1.2+uTime*.03), fbm(p*1.2+vec2(5.2,1.3)-uTime*.025));

  float ang = uAngle + uScroll*.35;
  vec2 dir = vec2(cos(ang), sin(ang));
  float s = dot((uv-.5)*asp, dir)*uFreq + uTime*.06;
  float prof = fract(s)*2.-1.;
  float bulge = sqrt(max(1.-prof*prof,0.));
  float refr = (4.+uScroll*7.)*.0065;
  vec2 off = dir/asp*prof*refr;
  float ab = .61*.4;

  vec3 col;
  col.r = field(uv+off*(1.+ab), asp, warp).r;
  col.g = field(uv+off, asp, warp).g;
  col.b = field(uv+off*(1.-ab), asp, warp).b;

  col *= .8 + .2*bulge;
  float h = clamp(prof*dir.y, 0., 1.);
  col += pow(h, 7.)*.12*(1.-uScroll*.6);

  col *= 1. - .38*pow(length((uv-vec2(.5,.45))*vec2(1.05,1.25)), 2.);
  col *= 1. - uScroll*.5;
  col += (hash(gl_FragCoord.xy + fract(uTime*7.)*100.)-.5)*.05;
  gl_FragColor = vec4(col,1.);
}
`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

const PRESETS = {
  hero: { baseA: '#030406', baseB: '#0c1824', flowA: '#64CEFB', flowB: '#2E9BD6', energy: 1, angle: 31, freq: 8 },
  close: { baseA: '#030406', baseB: '#0a141e', flowA: '#64CEFB', flowB: '#2E9BD6', energy: 0.7, angle: -24, freq: 10 },
};

export default function HeroShader({ preset = 'hero', progressRef, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) {
      canvas.parentElement?.classList.add('shader-fallback');
      return undefined;
    }

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      return sh;
    };
    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);
    } catch (err) {
      console.warn('HeroShader:', err);
      canvas.parentElement?.classList.add('shader-fallback');
      return undefined;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n) => gl.getUniformLocation(prog, n);
    const cfg = PRESETS[preset];
    gl.uniform3fv(u('uBaseA'), hex(cfg.baseA));
    gl.uniform3fv(u('uBaseB'), hex(cfg.baseB));
    gl.uniform3fv(u('uFlowA'), hex(cfg.flowA));
    gl.uniform3fv(u('uFlowB'), hex(cfg.flowB));
    gl.uniform1f(u('uEnergy'), cfg.energy);
    gl.uniform1f(u('uAngle'), (cfg.angle * Math.PI) / 180);
    gl.uniform1f(u('uFreq'), cfg.freq);
    const uRes = u('uRes');
    const uTime = u('uTime');
    const uTrail = u('uTrail');
    const uScroll = u('uScroll');

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const scale = coarse ? 0.42 : 0.62;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, Math.round(r.width * scale));
      canvas.height = Math.max(2, Math.round(r.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    let lastT = 0;
    // ResizeObserver fires asynchronously, after `draw` below is initialised
    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(lastT);
    });
    ro.observe(canvas);

    // pointer + momentum trail
    const trail = new Float32Array(16).fill(0.6);
    const head = { x: 0.65, y: 0.55 };
    const target = { x: 0.65, y: 0.55 };
    let lastPointer = -1e9;
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      target.x = (e.clientX - r.left) / r.width;
      target.y = 1 - (e.clientY - r.top) / r.height;
      lastPointer = performance.now();
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let running = false;
    const t0 = performance.now();

    const step = (now) => {
      const t = (now - t0) / 1000;
      if (now - lastPointer > 2200) {
        // autopilot: slow figure-eight so the light is alive without a pointer
        const k = preset === 'close' ? 0.6 : 1;
        target.x = 0.62 + 0.24 * Math.sin(t * 0.33 * k);
        target.y = 0.52 + 0.2 * Math.sin(t * 0.51 * k + 1.2);
      }
      head.x += (target.x - head.x) * 0.075;
      head.y += (target.y - head.y) * 0.075;
      trail[0] = head.x;
      trail[1] = head.y;
      for (let i = 1; i < 8; i++) {
        trail[i * 2] += (trail[(i - 1) * 2] - trail[i * 2]) * 0.2;
        trail[i * 2 + 1] += (trail[(i - 1) * 2 + 1] - trail[i * 2 + 1]) * 0.2;
      }
      return t;
    };
    const draw = (t) => {
      lastT = t;
      gl.uniform1f(uTime, t);
      gl.uniform2fv(uTrail, trail);
      gl.uniform1f(uScroll, progressRef?.current ?? 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const frame = (now) => {
      draw(step(now));
      if (running) raf = requestAnimationFrame(frame);
    };

    let inView = false;
    const play = () => {
      if (running || reduced || !inView || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // settle the trail, then paint one still frame (this is also the reduced-motion state)
    let warm = 0;
    for (let i = 0; i < 60; i++) warm = step(t0 + 16 * i);
    draw(warm);

    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView) play();
        else pause();
      },
      { rootMargin: '80px' }
    );
    io.observe(canvas);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener('visibilitychange', onVis);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      // no loseContext() here: a remount (React strict mode, fast refresh) reuses this same canvas
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [preset, progressRef]);

  return <canvas ref={canvasRef} className={`shader-canvas ${className}`} aria-hidden="true" />;
}
