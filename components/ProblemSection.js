'use client';

import { useEffect, useRef } from 'react';
import { LogoMark } from './Logo';
import { useScrollProgress, useVisibleFrame, ease } from './scroll/engine';
import SplitHeading from './fx/SplitHeading';
import Kicker from './fx/Kicker';

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

  // particle field + stage geometry, rebuilt on resize. Everything the frame loop needs about layout
  // is cached here, so the loop itself never reads layout.
  useEffect(() => {
    const canvas = canvasRef.current;
    const build = () => {
      const r = canvas.getBoundingClientRect();
      const stage = stageRef.current.getBoundingClientRect();
      const s = st.current;
      s.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      s.w = r.width;
      s.h = r.height;
      s.hw = stage.width / 2;
      s.hh = stage.height / 2;
      // the stage and the canvas live in the same sticky box, so this offset never changes while pinned
      s.ccx = stage.left - r.left + s.hw;
      s.ccy = stage.top - r.top + s.hh;
      s.maxD = Math.hypot(Math.max(s.ccx, s.w - s.ccx), Math.max(s.ccy, s.h - s.ccy));
      canvas.width = Math.round(r.width * s.dpr);
      canvas.height = Math.round(r.height * s.dpr);
      const gap = r.width < 700 ? 30 : 40;
      const cols = Math.floor(r.width / gap);
      const rows = Math.floor(r.height / gap);
      const ox = (r.width - (cols - 1) * gap) / 2;
      const oy = (r.height - (rows - 1) * gap) / 2;
      const n = cols * rows;
      const parts = {
        n,
        x: new Float32Array(n),
        y: new Float32Array(n),
        gx: new Float32Array(n),
        gy: new Float32Array(n),
        sp: new Float32Array(n),
        dist: new Float32Array(n),
        px: new Float32Array(n),
        py: new Float32Array(n),
        bucket: new Uint8Array(n),
        order: new Uint16Array(n),
      };
      for (let i = 0; i < n; i++) {
        parts.gx[i] = ox + (i % cols) * gap;
        parts.gy[i] = oy + Math.floor(i / cols) * gap;
        parts.x[i] = Math.random() * r.width;
        parts.y[i] = Math.random() * r.height;
        parts.sp[i] = 0.35 + Math.random() * 0.9;
        parts.dist[i] = Math.hypot(parts.gx[i] - s.ccx, parts.gy[i] - s.ccy);
      }
      s.parts = parts;
      s.last = {};
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  useScrollProgress(
    sectionRef,
    (p) => {
      st.current.p = p;
    },
    { mode: 'pin', ease: 0.09 }
  );

  // write a style only when it changed
  const put = (el, key, prop, value) => {
    const last = st.current.last;
    if (last[key] === value) return;
    last[key] = value;
    el.style[prop] = value;
  };

  useVisibleFrame(stickyRef, (now) => {
    const s = st.current;
    if (!s.parts) return;
    const t = now / 1000;
    const p = s.p;
    const a1 = ease.smooth(ease.range(p, 0.1, 0.46));
    const coreK = ease.range(p, 0.26, 0.44);
    const a2 = ease.range(p, 0.5, 0.74);
    const { hw, hh, ccx, ccy, maxD, w, h, dpr, parts } = s;

    // ---- DOM planes (chip centres are computed, not measured)
    const k1 = ease.outCubic(a1);
    const fragC = [];
    fragRefs.current.forEach((el, i) => {
      const [fx, fy, rot] = FRAG_POS[i];
      const drift = 1 - k1;
      const x = fx * hw * 0.86 * drift + Math.sin(t * 0.7 + i * 1.7) * 10 * drift;
      const y = fy * hh * 0.86 * drift + Math.cos(t * 0.9 + i) * 8 * drift;
      fragC.push([ccx + x, ccy + y]);
      const op = 1 - ease.range(a1, 0.72, 1);
      put(el, `fo${i}`, 'opacity', op.toFixed(3));
      if (op <= 0) return;
      const r = rot * drift + Math.sin(t * 1.3 + i) * 2.5 * drift;
      el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${r.toFixed(2)}deg) scale(${(1 - 0.6 * k1).toFixed(3)})`;
    });
    put(coreRef.current, 'ct', 'transform', `translate(-50%, -50%) scale(${(0.35 + 0.65 * ease.outCubic(coreK)).toFixed(3)})`);
    put(coreRef.current, 'co', 'opacity', coreK.toFixed(3));
    const k2 = ease.outCubic(a2);
    const connC = [];
    connRefs.current.forEach((el, i) => {
      const [cx, cy] = CONN_POS[i];
      const x = cx * hw * 0.84 * k2;
      const y = cy * hh * 0.84 * k2;
      connC.push([ccx + x, ccy + y]);
      put(el, `nt${i}`, 'transform', `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(0.5 + 0.5 * k2).toFixed(3)})`);
      put(el, `no${i}`, 'opacity', ease.range(a2, 0.05, 0.5).toFixed(3));
    });
    const fl = ease.range(p, 0.3, 0.42);
    const cl = ease.range(p, 0.48, 0.6);
    put(fragLabelRef.current, 'flo', 'opacity', (1 - fl).toFixed(3));
    put(fragLabelRef.current, 'flt', 'transform', `translateY(${(-fl * 14).toFixed(1)}px)`);
    put(connLabelRef.current, 'clo', 'opacity', cl.toFixed(3));
    put(connLabelRef.current, 'clt', 'transform', `translateY(${((1 - cl) * 14).toFixed(1)}px)`);

    // ---- canvas plane
    const ctx = canvasRef.current.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const pulseR = ((t * 320) % (maxD + 300)) - 60;

    // particles: position + a colour bucket each, then one fillStyle per bucket (not per particle)
    const COLORS = 8;
    const PULSES = 3;
    const counts = new Uint16Array(COLORS * PULSES);
    for (let i = 0; i < parts.n; i++) {
      const d = parts.dist[i] / maxD;
      // assembly ripples outward from the core
      const a = ease.smooth(ease.range(p, 0.12 + d * 0.24, 0.32 + d * 0.24));
      if (a < 1) {
        // chaos: drift along a slowly turning flow field (skipped once a particle has settled)
        const ang = (Math.sin(parts.x[i] * 0.0035 + t * 0.4) + Math.cos(parts.y[i] * 0.004 - t * 0.3)) * Math.PI;
        parts.x[i] += Math.cos(ang) * parts.sp[i];
        parts.y[i] += Math.sin(ang) * parts.sp[i];
        if (parts.x[i] < 0) parts.x[i] += w;
        else if (parts.x[i] > w) parts.x[i] -= w;
        if (parts.y[i] < 0) parts.y[i] += h;
        else if (parts.y[i] > h) parts.y[i] -= h;
      }
      parts.px[i] = parts.x[i] + (parts.gx[i] - parts.x[i]) * a;
      parts.py[i] = parts.y[i] + (parts.gy[i] - parts.y[i]) * a;
      const pulse = a2 > 0 ? Math.exp(-((parts.dist[i] - pulseR) ** 2) / 3200) * a2 : 0;
      const b = Math.round(a * (COLORS - 1)) * PULSES + Math.min(PULSES - 1, Math.round(pulse * (PULSES - 1)));
      parts.bucket[i] = b;
      counts[b]++;
    }
    const starts = new Uint16Array(COLORS * PULSES);
    for (let b = 1; b < starts.length; b++) starts[b] = starts[b - 1] + counts[b - 1];
    const fill = starts.slice();
    for (let i = 0; i < parts.n; i++) parts.order[fill[parts.bucket[i]]++] = i;
    for (let b = 0; b < starts.length; b++) {
      if (!counts[b]) continue;
      const a = Math.floor(b / PULSES) / (COLORS - 1);
      const pulse = (b % PULSES) / (PULSES - 1);
      const r = RED[0] + (CYAN[0] - RED[0]) * a;
      const g = RED[1] + (CYAN[1] - RED[1]) * a;
      const bl = RED[2] + (CYAN[2] - RED[2]) * a;
      ctx.fillStyle = `rgba(${r | 0},${g | 0},${bl | 0},${(0.62 - 0.34 * a + pulse * 0.7).toFixed(3)})`;
      const size = 1.6 + (1 - a) * 1.1 + pulse * 1.4;
      const half = size / 2;
      for (let j = starts[b]; j < starts[b] + counts[b]; j++) {
        const i = parts.order[j];
        ctx.fillRect(parts.px[i] - half, parts.py[i] - half, size, size);
      }
    }

    // shockwave: the instant the system connects, a ring of light rolls out from the core
    if (a2 > 0.001 && a2 < 0.999) {
      for (let k = 0; k < 2; k++) {
        const q = ease.clamp(a2 * 1.25 - k * 0.22);
        if (q <= 0 || q >= 1) continue;
        ctx.beginPath();
        ctx.arc(ccx, ccy, 60 + ease.outCubic(q) * maxD, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100,206,251,${((1 - q) * (k ? 0.25 : 0.55)).toFixed(3)})`;
        ctx.lineWidth = k ? 1 : 2;
        ctx.stroke();
      }
    }

    // broken red links between the fragments
    const brokenA = (1 - a1) * 0.4;
    if (brokenA > 0.01) {
      const c = fragC;
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
      connC.forEach(([x2, y2], i) => {
        const midX = ccx + (x2 - ccx) * 0.55;
        const pts = [
          [ccx, ccy],
          [midX, ccy],
          [midX, y2],
          [x2, y2],
        ];
        strokePartial(ctx, pts, ease.range(a2, 0.1, 0.85));
        if (a2 > 0.85) {
          ctx.fillStyle = 'rgba(234,248,255,0.95)';
          for (let m = 0; m < 2; m++) {
            const [px, py] = along(pts, (t * 0.42 + i * 0.27 + m * 0.5) % 1);
            ctx.beginPath();
            ctx.arc(px, py, 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
    }
  });

  return (
    <section ref={sectionRef} data-nav-theme="dark" data-spy="inicio" className="problem" aria-labelledby="problem-title">
      <div ref={stickyRef} className="problem-sticky">
        <canvas ref={canvasRef} className="problem-canvas" aria-hidden="true" />

        <div className="wrap problem-layout">
          <div className="problem-copy">
            <Kicker>El problema</Kicker>
            <SplitHeading id="problem-title" className="section-heading dark" text="Tu empresa no debería adaptarse a un software rígido." />
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
