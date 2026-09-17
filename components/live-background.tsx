"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Grain = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  size: number;
  alpha: number;
};

export function LiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let grains: Grain[] = [];
    let frame = 0;

    const pointer = { x: 0, y: 0, active: false };
    const smooth = { x: 0, y: 0 };

    const count = 48;
    const influence = 120;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      grains = Array.from({ length: count }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x,
          y,
          ox: x,
          oy: y,
          size: Math.random() * 0.6 + 0.3,
          alpha: Math.random() * 0.08 + 0.03,
        };
      });

      smooth.x = w / 2;
      smooth.y = h / 2;
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const draw = () => {
      frame += 1;
      const t = frame * 0.0015;

      const targetX = pointer.active ? pointer.x : w / 2 + Math.sin(t) * 24;
      const targetY = pointer.active ? pointer.y : h / 2 + Math.cos(t) * 20;
      smooth.x += (targetX - smooth.x) * 0.05;
      smooth.y += (targetY - smooth.y) * 0.05;

      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const bg = isDark ? "#000000" : "#fbfbfd";
      const grainColor = isDark ? "180, 180, 185" : "110, 110, 115";

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(
        smooth.x,
        smooth.y,
        0,
        smooth.x,
        smooth.y,
        pointer.active ? 280 : 200
      );
      const glowInner = isDark ? "rgba(10, 132, 255, 0.06)" : "rgba(0, 113, 227, 0.05)";
      const glowOuter = "transparent";
      glow.addColorStop(0, glowInner);
      glow.addColorStop(0.5, isDark ? "rgba(10, 132, 255, 0.02)" : "rgba(0, 113, 227, 0.015)");
      glow.addColorStop(1, glowOuter);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      for (const g of grains) {
        g.ox += Math.sin(t + g.x * 0.008) * 0.015;
        g.oy += Math.cos(t + g.y * 0.008) * 0.015;

        let gx = g.ox;
        let gy = g.oy;

        if (pointer.active) {
          const dx = gx - smooth.x;
          const dy = gy - smooth.y;
          const dist = Math.hypot(dx, dy);
          if (dist < influence && dist > 0) {
            const force = (1 - dist / influence) * 0.25;
            gx += (dx / dist) * force * 8;
            gy += (dy / dist) * force * 8;
          }
        }

        g.x += (gx - g.x) * 0.1;
        g.y += (gy - g.y) * 0.1;

        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${grainColor}, ${g.alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[var(--bg)]"
        aria-hidden
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
