'use client';

import { useEffect, useRef } from 'react';

/*
  Hand-written WebGL1 shader, in the spirit of a Swirl + ChromaFlow + FlutedGlass + FilmGrain stack:
   - swirl:  domain-warped noise between two near-black blues
   - flow:   cyan light that follows the pointer with momentum (8-point trail); an autopilot path
             keeps it alive on touch devices and when the pointer is idle
   - glass:  rounded flutes at an angle, refracting the field, with RGB aberration on the light
   - logo:   (hero only) the three Dech chevrons as glass lenses, drawn in the same pass.
             Doing this here instead of with CSS backdrop-filter is what keeps the hero smooth:
             a backdrop blur over a canvas that changes every frame is re-blurred every frame.
   - grain:  per-frame noise
  Cost control: the noise field is evaluated once per pixel (only the cheap light term is sampled
  three times for the aberration), the canvas renders below CSS resolution, and the resolution
  steps down on its own if frames run long.
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
uniform vec4 uChev[3];
uniform float uChevA[3];

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<3;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}

float flowAt(vec2 uv, vec2 asp, vec2 warp){
  float c = 0.;
  for(int i=0;i<8;i++){
    vec2 d = (uv-uTrail[i])*asp + (warp-.5)*.28;
    c += exp(-dot(d,d)*7.5) * (1.-float(i)/9.);
  }
  return c/3.4;
}

// chevron k as a glass lens: x = signed distance inside (px), y = lens normal (-1..1), z = height 0..1
vec3 chev(vec2 frag, vec4 b){
  vec2 q = (frag-b.xy)/b.zw + .5;
  if(q.x<0.||q.x>1.||q.y<0.||q.y>1.) return vec3(-1.,0.,0.);
  float a = .62*(1.-abs(2.*q.y-1.));
  float d = min(q.x-a, a+.38-q.x);
  return vec3(d*b.z, (q.x-(a+.19))/.19, q.y);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag/uRes;
  vec2 asp = vec2(uRes.x/uRes.y,1.);
  vec2 warp = vec2(fbm(uv*asp*1.2+uTime*.03), fbm(uv*asp*1.2+vec2(5.2,1.3)-uTime*.025));

  // fluted glass
  float ang = uAngle + uScroll*.35;
  vec2 dir = vec2(cos(ang), sin(ang));
  float prof = fract(dot((uv-.5)*asp, dir)*uFreq + uTime*.06)*2.-1.;
  float bulge = sqrt(max(1.-prof*prof,0.));
  vec2 off = dir/asp*prof*(4.+uScroll*7.)*.0065;

  // logo lenses
  float edge = 0., inside = 0., lift = 0.;
  vec3 tint = vec3(0.);
  for(int k=0;k<3;k++){
    vec3 c = chev(frag, uChev[k]);
    if(c.x > 0. && uChevA[k] > 0.){
      float w = uChevA[k];
      off += vec2(c.y*.05, (c.z-.5)*.02)*w;
      inside = max(inside, w);
      edge = max(edge, smoothstep(2.2, 0., c.x)*w);
      lift = max(lift, (.35+.65*c.z)*w);
      tint += (k==0 ? vec3(.85,.9,1.) : k==1 ? vec3(.18,.61,.84) : vec3(.39,.81,.98))*w;
    }
  }

  vec2 p = uv+off;
  float n = fbm(p*asp*1.7 + warp*1.7 + vec2(uTime*.02,-uTime*.015));
  vec3 col = mix(uBaseA, uBaseB, smoothstep(.15,.95,n));
  vec3 flow = mix(uFlowB, uFlowA, smoothstep(.3,.8,n))*uEnergy*(.5+.7*n);
  float ab = .61*.4;
  col += flow*vec3(flowAt(uv+off*(1.+ab),asp,warp), flowAt(p,asp,warp), flowAt(uv+off*(1.-ab),asp,warp));

  col *= .8 + .2*bulge;
  col += pow(clamp(prof*dir.y,0.,1.), 7.)*.12*(1.-uScroll*.6);

  // glass body: brighter, tinted, a soft top light, a crisp rim
  col = mix(col, col*1.35 + tint*.09 + lift*.05, inside);
  col += edge*.55;

  col *= 1. - .38*pow(length((uv-vec2(.5,.45))*vec2(1.05,1.25)), 2.);
  col *= 1. - uScroll*.5;
  col += (hash(frag + fract(uTime*7.)*100.)-.5)*.05;
  gl_FragColor = vec4(col,1.);
}
`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const outCubic = (t) => 1 - Math.pow(1 - t, 3);

const PRESETS = {
  hero: { baseA: '#030406', baseB: '#0c1824', flowA: '#64CEFB', flowB: '#2E9BD6', energy: 1, angle: 31, freq: 8 },
  close: { baseA: '#030406', baseB: '#0a141e', flowA: '#64CEFB', flowB: '#2E9BD6', energy: 0.7, angle: -24, freq: 10 },
};

const CHEV_DEPTH = [0.5, 0.9, 1.35];

/**
 * Lay out the three logo chevrons for this frame, in canvas pixels (GL y-up).
 * scene: { p: dive progress 0..1, reveal: seconds since the curtain opened (or -1), mx, my: smoothed pointer -1..1 }
 */
function layoutChevrons(out, alphaOut, cssW, cssH, scale, scene) {
  const mobile = cssW < 768;
  const W = mobile ? Math.min(96, Math.max(56, cssW * 0.17)) : Math.min(220, Math.max(78, cssW * 0.12));
  const H = W * 2.06;
  const right = cssW * (mobile ? 0.06 : 0.07);
  const cy = mobile ? cssH * 0.265 + W * 1.03 : cssH * 0.44;
  const midX = cssW - right - W / 2 - 1.14 * W;
  const p = scene.p;
  const e = outCubic(p);
  const dive = 1 + p * p * p * 11;
  const fadeOut = 1 - clamp01((p - 0.8) / 0.2);
  for (let k = 0; k < 3; k++) {
    const r = scene.reveal < 0 ? 0 : outCubic(clamp01((scene.reveal - k * 0.12) / 1.3));
    let x = cssW - right - W / 2 - (2 - k) * 1.14 * W + (k - 1) * e * 70;
    let y = cy;
    x += 80 * (1 - r) - scene.mx * CHEV_DEPTH[k] * 16;
    y += -scene.my * CHEV_DEPTH[k] * 11;
    // dive: scale every lens about the middle chevron's centre
    x = midX + (x - midX) * dive;
    y = cy + (y - cy) * dive;
    const s = dive * (0.8 + 0.2 * r);
    out[k * 4] = x * scale;
    out[k * 4 + 1] = (cssH - y) * scale;
    out[k * 4 + 2] = W * s * scale;
    out[k * 4 + 3] = H * s * scale;
    alphaOut[k] = r * fadeOut;
  }
}

export default function HeroShader({ preset = 'hero', progressRef, sceneRef, className = '' }) {
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
    const uChev = u('uChev');
    const uChevA = u('uChevA');
    const chev = new Float32Array(12);
    const chevA = new Float32Array(3);
    gl.uniform1fv(uChevA, chevA);

    // render resolution, relative to CSS pixels; steps down if the device struggles
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let scale = coarse ? 0.38 : 0.5;
    const MIN_SCALE = 0.28;
    let cssW = 1;
    let cssH = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      cssW = r.width;
      cssH = r.height;
      canvas.width = Math.max(2, Math.round(cssW * scale));
      canvas.height = Math.max(2, Math.round(cssH * scale));
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

    // pointer + momentum trail (relative to the canvas, cached rect: no layout reads per move)
    const trail = new Float32Array(16).fill(0.6);
    const head = { x: 0.65, y: 0.55 };
    const target = { x: 0.65, y: 0.55 };
    const ptr = { tx: 0, ty: 0, x: 0, y: 0 };
    let lastPointer = -1e9;
    const onMove = (e) => {
      ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.ty = (e.clientY / window.innerHeight) * 2 - 1;
      const top = canvas.getBoundingClientRect().top;
      if (e.clientY < top || e.clientY > top + cssH) return;
      target.x = e.clientX / cssW;
      target.y = 1 - (e.clientY - top) / cssH;
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
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;
      return t;
    };
    const draw = (t) => {
      lastT = t;
      gl.uniform1f(uTime, t);
      gl.uniform2fv(uTrail, trail);
      gl.uniform1f(uScroll, progressRef?.current ?? 0);
      const scene = sceneRef?.current;
      if (scene) {
        scene.mx = ptr.x;
        scene.my = ptr.y;
        scene.p = progressRef?.current ?? 0;
        scene.reveal = scene.revealAt ? (performance.now() - scene.revealAt) / 1000 : reduced ? 9 : -1;
        layoutChevrons(chev, chevA, cssW, cssH, scale, scene);
        gl.uniform4fv(uChev, chev);
        gl.uniform1fv(uChevA, chevA);
        scene.onFrame?.(scene);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // adaptive quality: if the page averages under ~48fps, render fewer pixels
    let acc = 0;
    let count = 0;
    let prev = 0;
    const frame = (now) => {
      if (prev) {
        acc += now - prev;
        count++;
        if (count === 90) {
          if (acc / count > 21 && scale > MIN_SCALE) {
            scale = Math.max(MIN_SCALE, scale * 0.8);
            resize();
          }
          acc = 0;
          count = 0;
        }
      }
      prev = now;
      draw(step(now));
      if (running) raf = requestAnimationFrame(frame);
    };

    let inView = false;
    const play = () => {
      if (running || reduced || !inView || document.hidden) return;
      running = true;
      prev = 0;
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
  }, [preset, progressRef, sceneRef]);

  return <canvas ref={canvasRef} className={`shader-canvas ${className}`} aria-hidden="true" />;
}
