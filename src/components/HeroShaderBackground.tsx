"use client";

import { useEffect, useState } from "react";
import {
  Shader,
  Swirl,
  ChromaFlow,
  FlutedGlass,
  FilmGrain,
  isWebGPUSupported,
} from "shaders/react";

/**
 * Fond motion design (shaders) — DA Julien : blanc + bleu #1F5EFF
 * Fallback CSS si WebGPU indisponible.
 */
export function HeroShaderBackground() {
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!isWebGPUSupported()) {
      setUnavailable(true);
    }
  }, []);

  if (unavailable) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(900px_circle_at_70%_20%,rgba(31,94,255,0.18),transparent_55%),radial-gradient(700px_circle_at_20%_80%,rgba(59,115,255,0.12),transparent_50%),linear-gradient(180deg,#F5F8FC,#EAF0F8)]"
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-700 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-[#F5F8FC]" />
      <Shader
        className="absolute inset-0 h-full w-full"
        style={{ width: "100%", height: "100%" }}
        onReady={() => setReady(true)}
        onUnavailable={() => setUnavailable(true)}
      >
        <Swirl colorA="#ffffff" colorB="#eef3ff" detail={1.7} />
        <ChromaFlow
          baseColor="#ffffff"
          downColor="#1F5EFF"
          leftColor="#3B73FF"
          rightColor="#0A3FCC"
          upColor="#1F5EFF"
          momentum={13}
          radius={3.5}
        />
        <FlutedGlass
          aberration={0.61}
          angle={31}
          frequency={8}
          highlight={0.12}
          highlightSoftness={0}
          lightAngle={-90}
          refraction={4}
          shape="rounded"
          softness={1}
          speed={0.15}
        />
        <FilmGrain strength={0.05} />
      </Shader>
    </div>
  );
}
