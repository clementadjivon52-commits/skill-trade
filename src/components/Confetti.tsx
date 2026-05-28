"use client";

import { useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  shape: "circle" | "square" | "triangle" | "heart";
  angle: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
};

export default function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      const timer = setTimeout(() => {
        setParticles([]);
      }, 0);
      return () => clearTimeout(timer);
    }

    const colors = [
      "#f43f5e", // rose
      "#8b5cf6", // violet
      "#06b6d4", // cyan
      "#10b981", // green
      "#fbbf24", // amber
      "#ec4899", // pink
    ];

    const shapes: ("circle" | "square" | "triangle" | "heart")[] = [
      "circle",
      "square",
      "triangle",
      "heart",
    ];

    const newParticles: Particle[] = Array.from({ length: 80 }).map((_, i) => {
      // Launch upwards and spread outwards
      const angle = 220 + Math.random() * 100; // between 220 and 320 degrees (pointing up)
      return {
        id: i,
        x: 50 + (Math.random() - 0.5) * 10, // near center horizontally (%)
        y: 60 + (Math.random() - 0.5) * 10, // near center vertically (%)
        size: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        angle,
        speed: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        opacity: 1,
      };
    });

    const timer = setTimeout(() => {
      setParticles(newParticles);
    }, 0);

    let animationFrameId: number;
    const startTime = Date.now();

    const updateParticles = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > 2500) {
        setParticles([]);
        return;
      }

      setParticles((prev) =>
        prev
          .map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            // X motion
            const dx = Math.cos(rad) * p.speed * 0.45;
            // Y motion, adding simulated gravity pulling down over time
            const dy = Math.sin(rad) * p.speed * 0.45 + (elapsed / 400);

            return {
              ...p,
              x: p.x + dx,
              y: p.y + dy,
              rotation: p.rotation + p.rotationSpeed,
              opacity: Math.max(0, 1 - elapsed / 2500),
            };
          })
          .filter((p) => p.y < 105 && p.x > -5 && p.x < 105 && p.opacity > 0)
      );

      animationFrameId = requestAnimationFrame(updateParticles);
    };

    animationFrameId = requestAnimationFrame(updateParticles);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => {
        const style: React.CSSProperties = {
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          backgroundColor: p.shape !== "heart" ? p.color : undefined,
          color: p.shape === "heart" ? p.color : undefined,
          transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
          opacity: p.opacity,
          position: "absolute",
          transition: "opacity 100ms linear",
        };

        if (p.shape === "circle") {
          return <div key={p.id} style={{ ...style, borderRadius: "50%" }} />;
        }
        if (p.shape === "square") {
          return <div key={p.id} style={style} />;
        }
        if (p.shape === "triangle") {
          return (
            <div
              key={p.id}
              style={{
                ...style,
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderLeft: `${p.size / 2}px solid transparent`,
                borderRight: `${p.size / 2}px solid transparent`,
                borderBottom: `${p.size}px solid ${p.color}`,
              }}
            />
          );
        }
        if (p.shape === "heart") {
          return (
            <svg
              key={p.id}
              viewBox="0 0 24 24"
              fill="currentColor"
              style={style}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          );
        }
        return null;
      })}
    </div>
  );
}
