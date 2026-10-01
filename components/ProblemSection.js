'use client';

import { useEffect, useRef } from 'react';
import { LogoMark } from './Logo';
import { useScrollProgress, useVisibleFrame, ease } from './scroll/engine';

const FRAGMENTED = ['Excel', 'Procesos manuales', 'Información dispersa', 'Software aislado', 'Tareas repetitivas'];
const CONNECTED = ['Sistemas integrados', 'Procesos automatizados', 'Información centralizada', 'Visibilidad en tiempo real'];

// Start positions of the fragmented chips, as fractions of the stage half-size, plus a tilt.
const FRAG_POS = [
  [-0.7, -0.62, -9],
  [0.52, -0.74, 7],
  [-0.62, 0.5, 5],
  [0.66, 0.16, -11],
  [0.06, 0.8, 4],
];
// Where the connected chips settle.
const CONN_POS = [
  [-0.6, -0.56],
  [0.6, -0.4],
  [-0.56, 0.58],
  [0.6, 0.56],
];
const BROKEN = [
  [0, 1],
  [1, 3],
  [3, 4],
  [4, 2],
  [2, 0],
];

const RED = [248, 113, 113];
const CYAN = [100, 206, 251];

/** point at fraction f along a polyline */
function along(pts, f) {
  let total = 0;
  const seg = [];
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(l);
    total += l;
  }
  let d = f * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? Math.min(1, d / seg[i]) : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k, i];
    }
    d -= seg[i];
  }
  return pts[pts.length - 1];
}

function strokePartial(ctx, pts, f) {
  const end = along(pts, f);
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= end[2]; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.lineTo(end[0], end[1]);
  ctx.stroke();
}

export default function ProblemSection() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const coreRef = useRef(null);
  const fragRefs = useRef([]);
  const connRefs = useRef([]);
  const fragLabelRef = useRef(null);
  const connLabelRef = useRef(null);
  const st = useRef({ p: 0, parts: null, w: 0, h: 0, dpr: 1 });

  // particle field, rebuilt on resize: each particle has a chaotic position and a slot in the brand's dot grid
  useEffect(() => {
    const canvas = canvasRef.current;
    const build = () => {
      const r = canvas.getBoundingClientRect();
      const s = st.current;
      s.dpr = Math.min(window.devicePixelRatio || 1, 2);
      s.w = r.width;
      s.h = r.height;
      canvas.width = Math.round(r.width * s.dpr);
      canvas.height = Math.round(r.height * s.dpr);
      const gap = r.width < 700 ? 30 : 40;
      const cols = Math.floor(r.width / gap);
      const rows = Math.floor(r.height / gap);
      const ox = (r.width - (cols - 1) * gap) / 2;
      const oy = (r.height - (rows - 1) * gap) / 2;
      const n = cols * rows;
      const parts = { n, x: new Float32Array(n), y: new Float32Array(n), gx: new Float32Array(n), gy: new Float32Array(n), sp: new Float32Array(n) };
      for (let i = 0; i < n; i++) {
        parts.gx[i] = ox + (i % cols) * gap;
        parts.gy[i] = oy + Math.floor(i / cols) * gap;
        parts.x[i] = Math.random() * r.width;
        parts.y[i] = Math.random() * r.height;
        parts.sp[i] = 0.35 + Math.random() * 0.9;
      }
      s.parts = parts;
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useScrollProgress(
    sectionRef,
    (p) => {
      st.current.p = p;
    },
    { mode: 'pin', ease: 0.09 }
  );

  useVisibleFrame(stickyRef, (now) => {
    const s = st.current;
    if (!s.parts) return;
    const t = now / 1000;
    const p = s.p;
    const a1 = ease.smooth(ease.range(p, 0.1, 0.46));
    const coreK = ease.range(p, 0.34, 0.5);
    const a2 = ease.range(p, 0.5, 0.74);

    // ---- DOM planes
    const stage = stageRef.current.getBoundingClientRect();
    const cvs = canvasRef.current.getBoundingClientRect();
    const hw = stage.width / 2;
    const hh = stage.height / 2;
    const k1 = ease.outCubic(a1);
    fragRefs.current.forEach((el, i) => {
      const [fx, fy, rot] = FRAG_POS[i];
      const drift = 1 - k1;
      const x = fx * hw * 0.86 * drift + Math.sin(t * 0.7 + i * 1.7) * 10 * drift;
      const y = fy * hh * 0.86 * drift + Math.cos(t * 0.9 + i) * 8 * drift;
      const r = rot * drift + Math.sin(t * 1.3 + i) * 2.5 * drift;
      el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${1 - 0.6 * k1})`;
      el.style.opacity = 1 - ease.range(a1, 0.72, 1);
    });
    const coreS = 0.35 + 0.65 * ease.outCubic(coreK);
    coreRef.current.style.transform = `translate(-50%, -50%) scale(${coreS})`;
    coreRef.current.style.opacity = coreK;
    const k2 = ease.outCubic(a2);
    connRefs.current.forEach((el, i) => {
      const [cx, cy] = CONN_POS[i];
      el.style.transform = `translate(-50%, -50%) translate3d(${cx * hw * 0.84 * k2}px, ${cy * hh * 0.84 * k2}px, 0) scale(${0.5 + 0.5 * k2})`;
      el.style.opacity = ease.range(a2, 0.05, 0.5);
    });
    fragLabelRef.current.style.opacity = 1 - ease.range(p, 0.3, 0.42);
    fragLabelRef.current.style.transform = `translateY(${-ease.range(p, 0.3, 0.42) * 14}px)`;
    connLabelRef.current.style.opacity = ease.range(p, 0.48, 0.6);
    connLabelRef.current.style.transform = `translateY(${(1 - ease.range(p, 0.48, 0.6)) * 14}px)`;

    // ---- canvas plane
    const ctx = canvasRef.current.getContext('2d');
    const { w, h, dpr, parts } = s;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const ccx = stage.left - cvs.left + hw;
    const ccy = stage.top - cvs.top + hh;
    const maxD = Math.hypot(Math.max(ccx, w - ccx), Math.max(ccy, h - ccy));
    const pulseR = ((t * 320) % (maxD + 300)) - 60;

    for (let i = 0; i < parts.n; i++) {
      // chaos: drift along a slowly turning flow field
      const ang = (Math.sin(parts.x[i] * 0.0035 + t * 0.4) + Math.cos(parts.y[i] * 0.004 - t * 0.3)) * Math.PI;
      parts.x[i] += Math.cos(ang) * parts.sp[i];
      parts.y[i] += Math.sin(ang) * parts.sp[i];
      if (parts.x[i] < 0) parts.x[i] += w;
      else if (parts.x[i] > w) parts.x[i] -= w;
      if (parts.y[i] < 0) parts.y[i] += h;
      else if (parts.y[i] > h) parts.y[i] -= h;

      const gx = parts.gx[i];
      const gy = parts.gy[i];
      const dist = Math.hypot(gx - ccx, gy - ccy);
      const d = dist / maxD;
      // assembly ripples outward from the core
      const a = ease.smooth(ease.range(p, 0.12 + d * 0.24, 0.32 + d * 0.24));
      const x = parts.x[i] + (gx - parts.x[i]) * a;
      const y = parts.y[i] + (gy - parts.y[i]) * a;
      const pulse = a2 > 0 ? Math.exp(-((dist - pulseR) ** 2) / 3200) * a2 : 0;
      const r = RED[0] + (CYAN[0] - RED[0]) * a;
      const g = RED[1] + (CYAN[1] - RED[1]) * a;
      const b = RED[2] + (CYAN[2] - RED[2]) * a;
      const alpha = 0.62 - 0.34 * a + pulse * 0.7;
      const size = 1.6 + (1 - a) * 1.1 + pulse * 1.4;
      ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha.toFixed(3)})`;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }

    const centerOf = (el) => {
      const r = el.getBoundingClientRect();
      return [r.left - cvs.left + r.width / 2, r.top - cvs.top + r.height / 2];
    };

    // broken red links between the fragments
    const brokenA = (1 - a1) * 0.4;
    if (brokenA > 0.01) {
      const c = fragRefs.current.map(centerOf);
      ctx.setLineDash([3, 7]);
      ctx.lineDashOffset = -t * 18;
      ctx.lineWidth = 1;
      BROKEN.forEach(([i, j], k) => {
        const flicker = 0.6 + 0.4 * Math.sin(t * 5 + k * 2.1);
        ctx.strokeStyle = `rgba(248,113,113,${(brokenA * flicker).toFixed(3)})`;
        const mx = (c[i][0] + c[j][0]) / 2 + Math.sin(t + k) * 12;
        const my = (c[i][1] + c[j][1]) / 2;
        // stop short of the middle: the link is broken
        ctx.beginPath();
        ctx.moveTo(c[i][0], c[i][1]);
        ctx.lineTo(c[i][0] + (mx - c[i][0]) * 0.8, c[i][1] + (my - c[i][1]) * 0.8);
        ctx.moveTo(c[j][0], c[j][1]);
        ctx.lineTo(c[j][0] + (mx - c[j][0]) * 0.8, c[j][1] + (my - c[j][1]) * 0.8);
        ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    // circuit links from the core to every connected chip, then data pulses along them
    if (a2 > 0.01) {
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(100,206,251,0.55)';
      connRefs.current.forEach((el, i) => {
        const [x2, y2] = centerOf(el);
        const midX = ccx + (x2 - ccx) * 0.55;
        const pts = [
          [ccx, ccy],
          [midX, ccy],
          [midX, y2],
          [x2, y2],
        ];
        const f = ease.range(a2, 0.1, 0.85);
        strokePartial(ctx, pts, f);
        if (a2 > 0.85) {
          for (let m = 0; m < 2; m++) {
            const [px, py] = along(pts, (t * 0.42 + i * 0.27 + m * 0.5) % 1);
            ctx.fillStyle = 'rgba(234,248,255,0.95)';
            ctx.beginPath();
            ctx.arc(px, py, 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
    }
  });

  return (
    <section ref={sectionRef} data-nav-theme="dark" className="problem" aria-labelledby="problem-title">
      <div ref={stickyRef} className="problem-sticky">
        <canvas ref={canvasRef} className="problem-canvas" aria-hidden="true" />

        <div className="wrap problem-layout">
          <div className="problem-copy">
            <p className="tag-mono">
              <span className="tag-mono__slash">//</span> El problema
            </p>
            <h2 id="problem-title" className="section-heading dark">
              Tu empresa no debería adaptarse a un software rígido.
            </h2>
            <p className="section-sub dark">
              La tecnología debería adaptarse a tu negocio y a la forma en que realmente funciona.
            </p>
            <div className="problem-state" aria-hidden="true">
              <span ref={fragLabelRef} className="problem-state__label frag">
                <span className="status-dot red" /> Operación fragmentada
              </span>
              <span ref={connLabelRef} className="problem-state__label conn">
                <span className="status-dot" /> Operación conectada
              </span>
            </div>
          </div>

          <div ref={stageRef} className="asm-stage" aria-hidden="true">
            <div ref={coreRef} className="asm-core">
              <span className="asm-core__ring" />
              <span className="asm-core__ring r2" />
              <LogoMark width={46} height={27} />
            </div>
            {FRAGMENTED.map((tag, i) => (
              <span key={tag} ref={(el) => (fragRefs.current[i] = el)} className="asm-chip frag">
                {tag}
              </span>
            ))}
            {CONNECTED.map((tag, i) => (
              <span key={tag} ref={(el) => (connRefs.current[i] = el)} className="asm-chip conn">
                <span className="status-dot" />
                {tag}
              </span>
            ))}
          </div>

          {/* Readable version for assistive tech and for reduced motion */}
          <div className="problem-static">
            <div className="problem-card frag">
              <p className="problem-card__title frag">Operación fragmentada</p>
              <ul>
                {FRAGMENTED.map((tag) => (
                  <li key={tag} className="problem-tag frag">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="problem-card conn">
              <p className="problem-card__title conn">Operación conectada</p>
              <ul>
                {CONNECTED.map((tag) => (
                  <li key={tag} className="problem-tag conn">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
