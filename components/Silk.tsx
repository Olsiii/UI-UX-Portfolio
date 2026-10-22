"use client";

import { useEffect, useRef } from "react";

/**
 * Live satin background — soft diagonal folds in pearl white and blush, drawn
 * by a tiny WebGL shader. The folds drift slowly on their own and flow along
 * with the page as you scroll (it reads the real, Lenis-smoothed scroll).
 *
 * Cheap by design: one full-screen quad, rendered at ~half resolution (the
 * surface is soft, so nobody can tell), paused when the tab is hidden.
 * If WebGL isn't available the page just stays plain white.
 */

// ---- tuning -----------------------------------------------------------------
const RES = 0.55; // render scale vs. CSS pixels (× devicePixelRatio, capped at 2)
const DRIFT = 1; // speed of the idle motion
const SCROLL_FLOW = 0.55; // how much the folds travel per screen of scrolling

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;

// height of the fabric at point p (p is aspect-corrected, screen height = 1)
float fabric(vec2 p){
  float a = -0.62;                                  // folds run diagonally, top-right to bottom-left
  vec2 q = mat2(cos(a), -sin(a), sin(a), cos(a)) * p;
  float t = uTime, s = uScroll;
  float warp = 0.34 * sin(q.y * 1.25 + t * 0.21 + s * 0.8)
             + 0.20 * sin(q.y * 2.60 - t * 0.16 + 1.7 - s * 0.5);
  float x = q.x + warp;
  float f = 0.56 * sin(x * 3.0  + t * 0.12 + s * 1.15);
  f      += 0.28 * sin(x * 6.2  - q.y * 0.8 + t * 0.18 + s * 0.65 + 1.3);
  f      += 0.11 * sin(x * 11.0 + q.y * 1.4 - t * 0.24 + 2.1);
  return f;
}

float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y);

  float e = 0.0025;
  float dx = (fabric(p + vec2(e, 0.0)) - fabric(p - vec2(e, 0.0))) / (2.0 * e);
  float dy = (fabric(p + vec2(0.0, e)) - fabric(p - vec2(0.0, e))) / (2.0 * e);
  vec3 n = normalize(vec3(-dx * 0.17, -dy * 0.17, 1.0));

  vec3 L = normalize(vec3(-0.45, 0.62, 0.68));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float diff = dot(n, L) * 0.5 + 0.5;
  float nh = max(dot(n, H), 0.0);
  float spec = pow(nh, 60.0) * 0.38 + pow(nh, 9.0) * 0.12;  // tight satin highlight + broad sheen

  // Anila's palette: cream #F1DEDE surface, folds shaded with her pink #FA34E6 at up to 30%
  vec3 cream = vec3(0.945, 0.871, 0.871);
  vec3 pink  = vec3(0.980, 0.204, 0.902);
  float fold = 1.0 - smoothstep(0.18, 0.88, diff);           // 0 on lit ridges, 1 deep in a fold
  vec3 col = cream * mix(1.0, 0.955, fold);                  // gentle depth so it still reads as fabric
  col = mix(col, pink, 0.30 * fold);                         // pink only in the folds, max 30%
  col += spec * 0.55;                                        // soft satin sheen on the ridges
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;                             // dither: no banding
  gl_FragColor = vec4(min(col, vec3(1.0)), 1.0);
}
`;

export default function Silk() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "low-power", preserveDrawingBuffer: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uScroll = gl.getUniformLocation(prog, "uScroll");

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let vh = window.innerHeight;
    const start = performance.now();

    const resize = () => {
      vh = window.innerHeight;
      const k = Math.min(window.devicePixelRatio || 1, 2) * RES;
      const w = Math.max(1, Math.round(canvas.clientWidth * k));
      const h = Math.max(1, Math.round(canvas.clientHeight * k));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };

    const draw = () => {
      const t = still ? 8 : ((performance.now() - start) / 1000) * DRIFT;
      gl.uniform1f(uTime, t);
      gl.uniform1f(uScroll, still ? 0 : (window.scrollY / vh) * SCROLL_FLOW);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    resize();
    draw();
    canvas.classList.add("on");

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !still) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVis);
    if (!still) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      // (context is left alive on purpose: React dev mode remounts and would get a dead context)
    };
  }, []);

  return (
    <div className="silk" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
