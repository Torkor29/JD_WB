"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMedia";

/**
 * Fond hero type motionsites / Axion :
 * bandes liquides + verre cannelé animé.
 * WebGL2 (large support) — pas dépendant de WebGPU.
 * DA Julien : blanc + bleu #1F5EFF
 */
const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.05;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  float t = u_time * 0.22;

  // Swirl / flow field
  float angle = 0.55;
  float ca = cos(angle);
  float sa = sin(angle);
  vec2 q = mat2(ca, -sa, sa, ca) * p;

  float flow = fbm(q * 1.35 + vec2(t * 0.7, -t * 0.45));
  float flow2 = fbm(q * 2.1 - vec2(t * 0.55, t * 0.35) + flow);

  // Fluted glass ribs (diagonal)
  float ribs = q.x * 18.0 + q.y * 7.0 + flow2 * 1.8;
  float flute = sin(ribs);
  float fluteMask = smoothstep(-0.15, 0.85, flute);
  float seam = pow(abs(flute), 0.35);

  // Chromatic liquid bands
  float band = smoothstep(0.28, 0.72, flow2);
  float streak = smoothstep(0.55, 0.95, abs(sin(ribs * 0.35 + t)));

  vec3 paper = vec3(0.961, 0.973, 0.988); // #F5F8FC
  vec3 blue  = vec3(0.122, 0.369, 1.0);    // #1F5EFF
  vec3 blue2 = vec3(0.231, 0.451, 1.0);    // #3B73FF
  vec3 deep  = vec3(0.039, 0.247, 0.800);  // #0A3FCC
  vec3 white = vec3(1.0);

  vec3 col = paper;
  col = mix(col, white, 0.55 + 0.2 * flow);
  col = mix(col, mix(blue2, blue, streak), band * 0.72 * fluteMask);
  col = mix(col, deep, streak * band * 0.28);
  col += white * (1.0 - seam) * 0.12 * band; // highlights on flutes

  // Soft vignette / top glow like reference
  float glow = exp(-length(p * vec2(0.75, 1.1) - vec2(0.35, -0.15)) * 1.6);
  col = mix(col, mix(blue, white, 0.35), glow * 0.18);

  // Film grain
  float g = hash(gl_FragCoord.xy + fract(u_time) * 40.0);
  col += (g - 0.5) * 0.035;

  gl_FragColor = vec4(col, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function LiquidHeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        premultipliedAlpha: false,
      }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");

    let raf = 0;
    let start = performance.now();
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        start = performance.now() - (performance.now() - start);
        loop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const loop = () => {
      if (!running) return;
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [reduce]);

  if (reduce) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(900px_circle_at_70%_15%,rgba(31,94,255,0.28),transparent_50%),linear-gradient(135deg,#F5F8FC_0%,#DCE8FF_45%,#F5F8FC_100%)]"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    />
  );
}
