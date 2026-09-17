"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Grain = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  seed: number;
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
    const prev = { x: 0, y: 0 };

    const count = 48;
    const influence = 150;
    const maxSpeed = 1.5;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      grains = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        size: Math.random() * 0.6 + 0.3,
        alpha: Math.random() * 0.08 + 0.03,
        seed: Math.random() * Math.PI * 2,
      }));

      smooth.x = w / 2;
      smooth.y = h / 2;
      prev.x = smooth.x;
      prev.y = smooth.y;
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

      // How fast the pointer is currently stirring the field — drives the vortex.
      const pSpeed = Math.min(Math.hypot(smooth.x - prev.x, smooth.y - prev.y), 40);
      prev.x = smooth.x;
      prev.y = smooth.y;

      // Near-neutral dark base with only a faint violet cast.
      ctx.fillStyle = "#09090e";
      ctx.fillRect(0, 0, w, h);

      // Subtle purple hue that follows the pointer, brightening on movement.
      const radius = pointer.active ? 320 : 220;
      const intensity = pointer.active ? 1 : 0.55;
      const glow = ctx.createRadialGradient(
        smooth.x,
        smooth.y,
        0,
        smooth.x,
        smooth.y,
        radius
      );
      glow.addColorStop(0, `rgba(168, 110, 223, ${0.042 * intensity})`);
      glow.addColorStop(0.5, `rgba(168, 110, 223, ${0.016 * intensity})`);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      for (const g of grains) {
        // Flow field: an angle from layered sines steers each grain along
        // invisible, slowly-shifting currents — ambient, non-repeating drift.
        const a =
          (Math.sin(g.x * 0.004 + t) +
            Math.cos(g.y * 0.004 - t * 0.8) +
            Math.sin((g.x + g.y) * 0.003 + t * 0.5)) *
          1.0;
        g.vx += Math.cos(a) * 0.02;
        g.vy += Math.sin(a) * 0.02;

        if (pointer.active) {
          const dx = g.x - smooth.x;
          const dy = g.y - smooth.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < influence) {
            const f = 1 - dist / influence;
            // Gentle repel away from the cursor...
            g.vx += (dx / dist) * f * 0.08;
            g.vy += (dy / dist) * f * 0.08;
            // ...plus a tangential swirl that scales with pointer speed, so a
            // quick swipe stirs the field into a vortex that then decays.
            g.vx += (-dy / dist) * f * pSpeed * 0.014;
            g.vy += (dx / dist) * f * pSpeed * 0.014;
          }
        }

        // Damping keeps motion calm; clamp prevents runaway streaks.
        g.vx *= 0.93;
        g.vy *= 0.93;
        const sp = Math.hypot(g.vx, g.vy);
        if (sp > maxSpeed) {
          g.vx = (g.vx / sp) * maxSpeed;
          g.vy = (g.vy / sp) * maxSpeed;
        }

        g.x += g.vx;
        g.y += g.vy;

        // Wrap around the edges so the field stays evenly populated.
        if (g.x < -10) g.x += w + 20;
        else if (g.x > w + 10) g.x -= w + 20;
        if (g.y < -10) g.y += h + 20;
        else if (g.y > h + 10) g.y -= h + 20;

        // Irregular twinkle so brightness shimmers rather than sitting flat.
        const twinkle = 0.55 + 0.45 * Math.sin(frame * 0.05 + g.seed);

        // Faint purple tint for grains caught in the pointer glow.
        const near = pointer.active
          ? Math.max(0, 1 - Math.hypot(g.x - smooth.x, g.y - smooth.y) / radius)
          : 0;
        const r = Math.round(180 + near * 4);
        const gc = Math.round(180 - near * 53);
        const b = Math.round(185 + near * 43);

        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${gc}, ${b}, ${g.alpha * twinkle + near * 0.05})`;
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
