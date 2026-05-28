"use client";

import { useEffect, useRef, useState } from "react";

type WalletCard3DProps = {
  balance: number;
  ownerName?: string;
  lastTopUp?: string;
};

export default function WalletCard3D({
  balance,
  ownerName = "Compte Démo",
  lastTopUp = "Non défini",
}: WalletCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [displayBalance, setDisplayBalance] = useState(0);

  // Animate token balance counter
  useEffect(() => {
    const end = balance;
    if (end === 0) return;
    
    const duration = 1200; // ms
    const increment = end / (duration / 16); // 60fps
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setDisplayBalance(end);
        clearInterval(timer);
      } else {
        setDisplayBalance(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [balance]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Position of mouse relative to card center (normalized between -0.5 and 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // 3D rotations based on mouse position
  const rotateX = isHovered ? -coords.y * 22 : 0; // tilt up to 22 degrees
  const rotateY = isHovered ? coords.x * 22 : 0;
  
  // Holographic reflection gradient position
  const glossX = isHovered ? 50 + coords.x * 100 : 50;
  const glossY = isHovered ? 50 + coords.y * 100 : 50;

  return (
    <div
      className="perspective-[1000px] w-full"
      style={{ perspective: "1000px" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.03 : 1})`,
          transition: isHovered ? "transform 80ms ease-out" : "transform 400ms ease-in-out",
          transformStyle: "preserve-3d",
        }}
        className="relative aspect-[1.586/1] w-full max-w-[420px] mx-auto rounded-3xl p-6 md:p-8 overflow-hidden border border-white/20 shadow-[0_30px_60px_rgba(2,6,23,0.55)] cursor-pointer select-none bg-gradient-to-br from-slate-950/80 via-slate-900/90 to-slate-950/85 backdrop-blur-2xl"
      >
        {/* Holographic light layer */}
        <div
          style={{
            background: `radial-gradient(circle at ${glossX}% ${glossY}%, rgba(34, 211, 238, 0.16) 0%, rgba(124, 58, 237, 0.12) 40%, transparent 70%)`,
            transition: "background 100ms ease-out",
          }}
          className="pointer-events-none absolute inset-0 z-0"
        />

        {/* Diagonal glowing reflex line */}
        <div
          style={{
            transform: `translateX(${isHovered ? (coords.x + coords.y) * 80 : -50}%) rotate(-25deg)`,
            transition: isHovered ? "transform 80ms ease-out" : "transform 500ms ease",
          }}
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent w-[200%]"
        />

        {/* Content layers with preserve-3d translation for depth */}
        <div className="relative z-10 flex h-full flex-col justify-between" style={{ transform: "translateZ(40px)" }}>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Lomé Youth Network
              </p>
              <h4 className="mt-1 text-lg font-bold tracking-wider text-white">SKILL-TRADE</h4>
            </div>
            {/* Holographic Chip icon */}
            <div className="relative h-9 w-11 rounded-lg border border-yellow-400/20 bg-gradient-to-br from-yellow-400/30 to-amber-600/20 p-1">
              <div className="h-full w-full rounded border border-yellow-300/10 bg-yellow-500/15" />
            </div>
          </div>

          {/* Balance display */}
          <div className="my-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Solde Actuel</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                {displayBalance.toLocaleString()}
              </span>
              <span className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                ST
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.15em] text-slate-400">Titulaire</p>
              <p className="text-sm font-medium text-white tracking-wide mt-0.5">{ownerName}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-[0.15em] text-slate-400">Dernier Topup</p>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">{lastTopUp}</p>
            </div>
          </div>
        </div>

        {/* Subtle decorative glow at the bottom-right corner */}
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl" />
      </div>
    </div>
  );
}
