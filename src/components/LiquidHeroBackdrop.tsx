"use client";

import { useEffect, useRef, useState } from "react";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMedia";

/**
 * Fond hero type motionsites / Axion :
 * bandes liquides + verre cannelé animé.
 * WebGL désactivé sur mobile (perf / context lost) → fallback CSS.
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

  float angle = 0.55;
  float ca = cos(angle);
  float sa = sin(angle);
  vec2 q = mat2(ca, -sa, sa, ca) * p;

  float flow = fbm(q * 1.35 + vec2(t * 0.7, -t * 0.45));
  float flow2 = fbm(q * 2.1 - vec2(t * 0.55, t * 0.35) + flow);

  float ribs = q.x * 18.0 + q.y * 7.0 + flow2 * 1.8;
  float flute = sin(ribs);
  float fluteMask = smoothstep(-0.15, 0.85, flute);
  float seam = pow(abs(flute), 0.35);

  float band = smoothstep(0.28, 0.72, flow2);
  float streak = smoothstep(0.55, 0.95, abs(sin(ribs * 0.35 + t)));

  vec3 paper = vec3(0.961, 0.973, 0.988);
  vec3 blue  = vec3(0.122, 0.369, 1.0);
  vec3 blue2 = vec3(0.231, 0.451, 1.0);
  vec3 deep  = vec3(0.039, 0.247, 0.800);
  vec3 white = vec3(1.0);

  vec3 col = paper;
  col = mix(col, white, 0.55 + 0.2 * flow);
  col = mix(col, mix(blue2, blue, streak), band * 0.72 * fluteMask);
  col = mix(col, deep, streak * band * 0.28);
  col += white * (1.0 - seam) * 0.12 * band;

  float glow = exp(-length(p * vec2(0.75, 1.1) - vec2(0.35, -0.15)) * 1.6);
  col = mix(col, mix(blue, white, 0.35), glow * 0.18);

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

function CssFallback() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_70%_10%,rgba(31,94,255,0.32),transparent_52%),linear-gradient(145deg,#F5F8FC_0%,#D6E4FF_42%,#EEF3FA_100%)]" />
      <div className="absolute -left-1/4 top-1/4 h-[55%] w-[80%] animate-floaty rounded-full bg-accent/20 blur-3xl" />
      <div
        className="absolute -right-1/4 bottom-0 h-[45%] w-[70%] rounded-full bg-accent/15 blur-3xl"
        style={{ animation: "floaty 8s ease-in-out infinite reverse" }}
      />
    </div>
  );
}

export function LiquidHeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();
  const mobile = useIsMobile(900);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || reduce || mobile || failed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
      }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) {
      setFailed(true);
      return;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setFailed(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setFailed(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
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
    const start = performance.now();
    let running = true;

    const onContextLost = (e: Event) => {
      e.preventDefault();
      running = false;
      cancelAnimationFrame(raf);
      setFailed(true);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
      if (running) loop();
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
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [ready, reduce, mobile, failed]);

  if (!ready || reduce || mobile || failed) {
    return <CssFallback />;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    />
  );
}
