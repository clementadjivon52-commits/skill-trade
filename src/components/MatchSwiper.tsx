"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Confetti from "./Confetti";

type UserCandidate = {
  id: string;
  name: string;
  photo: string;
  role: string;
  location: string;
  bio: string;
  availability: string;
  skills: string[];
  timeServices: string[];
  compatibility: number;
};

type MatchSwiperProps = {
  queue: UserCandidate[];
  selectedOfferId?: string;
  selectedOfferTitle?: string;
};

export default function MatchSwiper({
  queue,
  selectedOfferId,
  selectedOfferTitle,
}: MatchSwiperProps) {
  const router = useRouter();
  
  // Track active card index in queue
  const [index, setIndex] = useState(0);
  
  // Dragging states
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Redirection/Success animations
  const [isSwipingOut, setIsSwipingOut] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);

  // Stop drag event references
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const endDragRef = useRef<(() => void) | null>(null);

  // If index reaches end of queue, reset or show empty state
  const isQueueEmpty = index >= queue.length;
  const currentCandidate = !isQueueEmpty ? queue[index] : null;
  
  // Slice cards to render (up to 3 cards visible)
  const stack = !isQueueEmpty ? queue.slice(index, index + 3) : [];

  // Drag handlers
  const startDrag = (clientX: number, clientY: number) => {
    if (isSwipingOut) return;
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!isDragging || isSwipingOut) return;
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;
    setDragOffset({ x: dx, y: dy });

    if (dx > 50) {
      // Swipe indicator could be set here if needed
    }
  };

  const endDrag = () => {
    if (!isDragging || isSwipingOut) return;
    setIsDragging(false);

    const threshold = 140; // horizontal swipe threshold in pixels
    if (dragOffset.x > threshold) {
      // Swipe Right -> Match / Proposition
      triggerSwipe("right");
    } else if (dragOffset.x < -threshold) {
      // Swipe Left -> Skip
      triggerSwipe("left");
    } else {
      // Reset back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Keep ref in sync with latest endDrag closure
  endDragRef.current = endDrag;

  const triggerSwipe = (dir: "left" | "right") => {
    if (isQueueEmpty || !currentCandidate) return;
    setSwipeDirection(dir);
    setIsSwipingOut(true);

    // Set end coordinates for throw animation
    const throwDistance = window.innerWidth > 0 ? window.innerWidth + 200 : 800;
    setDragOffset({
      x: dir === "right" ? throwDistance : -throwDistance,
      y: dragOffset.y * 1.5,
    });

    if (dir === "right") {
      // Explode Confetti for success!
      setConfettiActive(true);
      
      // Delay before redirecting
      setTimeout(() => {
        router.push(
          `/match/success?user=${currentCandidate.id}${selectedOfferId ? `&offer=${selectedOfferId}` : ""}`
        );
      }, 1000);
    } else {
      // Swipe Left -> Move to next candidate after animation
      setTimeout(() => {
        setIndex((prev) => prev + 1);
        // Reset drag positions
        setDragOffset({ x: 0, y: 0 });
        setIsSwipingOut(false);
      }, 350);
    }
  };

  // Drag listeners mapping
  const onMouseDown = (e: React.MouseEvent) => startDrag(e.clientX, e.clientY);
  const onMouseMove = (e: React.MouseEvent) => moveDrag(e.clientX, e.clientY);
  const onMouseUp = () => endDrag();
  
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  };
  const onTouchEnd = () => endDrag();

  // Document level mouseup escape
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) endDragRef.current?.();
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Confetti celebration */}
      <Confetti active={confettiActive} />

      {/* Pile de cartes Swiper */}
      <div 
        ref={cardContainerRef}
        className="relative min-h-[580px] w-full"
      >
        {isQueueEmpty ? (
          <div className="glass-card absolute inset-0 flex flex-col items-center justify-center text-center p-8 rounded-[2.2rem]">
            <div className="h-20 w-20 flex items-center justify-center rounded-full bg-slate-900 border border-cyan-400/20 text-3xl shadow-[0_0_50px_rgba(34,211,238,0.15)] animate-pulse">
              ✨
            </div>
            <h2 className="mt-6 text-3xl font-black text-white">Pile épuisée !</h2>
            <p className="mt-3 text-slate-300 max-w-sm mx-auto text-sm leading-relaxed">
              Tu as exploré tous les profils disponibles à Lomé. Reviens plus tard pour voir les nouveaux talents !
            </p>
            <button
              onClick={() => {
                setIndex(0);
                setDragOffset({ x: 0, y: 0 });
                setIsSwipingOut(false);
                setConfettiActive(false);
              }}
              className="mt-8 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3.5 text-xs font-bold text-white shadow-lg hover:scale-102"
            >
              Recommencer la pile
            </button>
          </div>
        ) : (
          stack
            .slice()
            .reverse()
            .map((candidate, reverseIndex) => {
              const depth = stack.length - reverseIndex - 1;
              const isTop = candidate.id === currentCandidate?.id;
              
              // Base rotation and scale for static deck illusion
              const rotate = depth * 1.6;
              const scale = 1 - depth * 0.03;
              const translate = depth * 18;

              // Top card gets mouse and touch physical translation styles
              const transformStyle = isTop
                ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.08}deg) scale(1)`
                : `translateY(${translate}px) scale(${scale}) rotate(${rotate}deg)`;

              const transitionStyle = isTop && !isDragging
                ? "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)"
                : undefined;

              // Stamps opacity based on current offset
              const nopeOpacity = isTop && dragOffset.x < 0 ? Math.min(0.9, -dragOffset.x / 140) : 0;
              const likeOpacity = isTop && dragOffset.x > 0 ? Math.min(0.9, dragOffset.x / 140) : 0;

              return (
                <article
                  key={candidate.id}
                  onMouseDown={isTop ? onMouseDown : undefined}
                  onMouseMove={isTop ? onMouseMove : undefined}
                  onMouseUp={isTop ? onMouseUp : undefined}
                  onTouchStart={isTop ? onTouchStart : undefined}
                  onTouchMove={isTop ? onTouchMove : undefined}
                  onTouchEnd={isTop ? onTouchEnd : undefined}
                  style={{
                    transform: transformStyle,
                    transition: transitionStyle,
                    zIndex: isTop ? 30 : 20 - depth,
                    cursor: isTop ? (isDragging ? "grabbing" : "grab") : "default",
                  }}
                  className={`glass-card absolute inset-0 overflow-hidden rounded-[2.2rem] shadow-[0_20px_60px_rgba(2,6,23,0.45)] select-none ${
                    isTop ? "border-white/20" : "border-white/10 opacity-70 pointer-events-none"
                  }`}
                >
                  <div className="relative h-full w-full min-h-[580px]">
                    <Image
                      src={candidate.photo}
                      alt={candidate.name}
                      fill
                      priority={isTop}
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

                    {/* Stamps overlays inside top card */}
                    {isTop && (
                      <>
                        <div
                          style={{ opacity: nopeOpacity }}
                          className="absolute top-8 left-8 border-4 border-rose-500/80 bg-rose-950/40 text-rose-400 text-3xl font-black uppercase px-6 py-2 rounded-2xl tracking-[0.2em] -rotate-12 pointer-events-none"
                        >
                          PASSER
                        </div>
                        <div
                          style={{ opacity: likeOpacity }}
                          className="absolute top-8 right-8 border-4 border-cyan-400/80 bg-cyan-950/40 text-cyan-300 text-3xl font-black uppercase px-6 py-2 rounded-2xl tracking-[0.2em] rotate-12 pointer-events-none"
                        >
                          PROPOSER
                        </div>
                      </>
                    )}

                    {/* Profile Information */}
                    <div className="absolute inset-x-0 bottom-0 p-6 pointer-events-none">
                      <div className="rounded-[1.8rem] border border-white/10 bg-slate-950/60 p-5 md:p-6 backdrop-blur-xl pointer-events-auto">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300 font-semibold">
                              Compatibilité {candidate.compatibility}%
                            </p>
                            <h2 className="mt-1.5 text-2xl md:text-3xl font-black text-white leading-tight">
                              {candidate.name}
                            </h2>
                            <p className="mt-1 text-xs text-slate-300 font-medium">
                              {candidate.role} · {candidate.location}
                            </p>
                          </div>
                          {isTop ? (
                            <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-violet-100 font-bold">
                              Carte active
                            </span>
                          ) : null}
                        </div>
                        
                        <p className="mt-4 text-xs md:text-sm leading-relaxed text-slate-200">
                          {candidate.bio}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {[...candidate.skills, ...candidate.timeServices]
                            .slice(0, 4)
                            .map((item) => (
                              <span
                                key={item}
                                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-slate-200 font-bold"
                              >
                                {item}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
        )}
      </div>

      {/* Action Deck panel */}
      <div className="space-y-6 flex flex-col justify-between">
        <div className="glass-card rounded-[2rem] p-6 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Action deck</p>
            <h3 className="mt-1 text-xl font-bold text-white tracking-wide">Choisis ton mouvement</h3>
          </div>
          
          <div className="grid gap-3.5">
            <button
              onClick={() => triggerSwipe("left")}
              disabled={isQueueEmpty || isSwipingOut}
              className="w-full rounded-full border border-white/10 bg-white/5 py-4 text-center text-xs font-semibold text-slate-200 hover:border-red-400/50 hover:bg-red-400/5 transition-all cursor-pointer disabled:opacity-50"
            >
              Swipe suivant (Passer)
            </button>
            
            {currentCandidate && (
              <Link
                href={`/profile/${currentCandidate.id}`}
                className="w-full rounded-full border border-violet-400/25 bg-violet-500/10 py-4 text-center text-xs font-semibold text-violet-200 hover:bg-violet-500/25 transition-all"
              >
                Voir le profil détaillé
              </Link>
            )}
            
            <button
              onClick={() => triggerSwipe("right")}
              disabled={isQueueEmpty || isSwipingOut}
              className="w-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 py-4 text-center text-xs font-black text-white hover:scale-[1.02] shadow-[0_8px_25px_rgba(124,58,237,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              Envoyer une proposition
            </button>
          </div>
        </div>

        {currentCandidate && (
          <div className="glass-card rounded-[2rem] p-6 space-y-3.5">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Disponibilité</p>
              <p className="mt-1.5 text-base font-bold text-white">{currentCandidate.availability}</p>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              {selectedOfferId
                ? `Propose une collaboration autour de "${selectedOfferTitle}" et passe en contact direct après validation.`
                : "Utilise les cartes pour découvrir un partenaire pertinent avant d'ouvrir la conversation WhatsApp."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
