"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

// Star colours as RGB, matching the paper, signal and flare tokens.
const TINTS = {
  paper: "232, 236, 242",
  signal: "61, 123, 255",
  flare: "255, 122, 47",
} as const;

type Star = { x: number; y: number; z: number; tint: keyof typeof TINTS };

const BASE_SPEED = 12; // px per second at full depth
const SCROLL_BOOST = 0.9; // how much scroll velocity speeds the stars up
const MAX_STREAK = 90; // longest streak in px

/**
 * Canvas star field that drifts downward like a slow ascent. Scrolling
 * speeds it up into streaks; the mouse adds a little parallax.
 * Draws one still frame for reduced-motion visitors.
 */
export function Starfield({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const velocity = useRef(0);

  useLenis((lenis) => {
    velocity.current = lenis.velocity;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let frame = 0;
    let last = performance.now();
    let visible = true;
    let smoothedVelocity = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    // Mostly white, a few blue, and a rare warm orange one.
    const pickTint = (): Star["tint"] => {
      const roll = Math.random();
      return roll < 0.03 ? "flare" : roll < 0.11 ? "signal" : "paper";
    };

    const makeStar = (y = Math.random() * height): Star => ({
      x: Math.random() * width,
      y,
      z: 0.15 + Math.random() * 0.85,
      tint: pickTint(),
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(420, Math.round((width * height) / 3500));
      stars = Array.from({ length: count }, () => makeStar());
      if (reducedMotion) draw(0);
    };

    const draw = (dt: number) => {
      smoothedVelocity += (velocity.current - smoothedVelocity) * 0.12;
      const boost = Math.abs(smoothedVelocity) * SCROLL_BOOST;
      const direction = smoothedVelocity < 0 ? -1 : 1;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        const speed = (BASE_SPEED + boost * 60) * star.z;
        star.y += speed * dt * direction;
        if (star.y > height + MAX_STREAK) Object.assign(star, makeStar(-MAX_STREAK));
        if (star.y < -MAX_STREAK) Object.assign(star, makeStar(height + MAX_STREAK));

        const x = star.x + pointer.x * 24 * star.z;
        const y = star.y + pointer.y * 16 * star.z;
        const streak = Math.min(MAX_STREAK, boost * 14 * star.z);
        const alpha = 0.25 + star.z * 0.65;

        ctx.strokeStyle = ctx.fillStyle = `rgba(${TINTS[star.tint]}, ${alpha})`;

        if (streak > 1.5) {
          ctx.lineWidth = star.z * 1.6;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y - streak * direction);
          ctx.stroke();
        } else {
          const size = star.z * 1.6;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (visible) draw(dt);
      frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = event.clientX / window.innerWidth - 0.5;
      pointer.ty = event.clientY / window.innerHeight - 0.5;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    if (reducedMotion) return () => resizeObserver.disconnect();

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibilityObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
