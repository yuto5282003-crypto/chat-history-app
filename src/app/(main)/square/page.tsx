"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import ParkBackground from "@/components/square/ParkBackground";
import AvatarFigure from "@/components/square/AvatarFigure";
import Bubble from "@/components/square/Bubble";
import VisitorSheet from "@/components/square/VisitorSheet";
import { DEMO_SQUARE_VISITORS } from "@/lib/demo-data";
import type { SquareVisitor } from "@/lib/demo-data";

/**
 * SquarePage — Interactive avatar plaza.
 *
 * Layout:
 * ┌─────────────────────┐
 * │ Header              │
 * ├─────────────────────┤
 * │                     │  ← Park area (scrollable, 4:3+ ratio)
 * │   Avatars + Bubbles │
 * │                     │
 * ├─────────────────────┤
 * │ Status bar          │
 * └─────────────────────┘
 *
 * Avatars drift gently. Bubbles cycle visibility.
 * Tap → VisitorSheet bottom sheet.
 */
type VisitorWithAnim = SquareVisitor & { dx: number; dy: number; showBubble: boolean };

export default function SquarePage() {
  const [visitors, setVisitors] = useState<VisitorWithAnim[]>([]);
  const [selected, setSelected] = useState<SquareVisitor | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const bubbleRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Initialize visitors with drift offsets
  useEffect(() => {
    setVisitors(
      DEMO_SQUARE_VISITORS.map((v) => ({ ...v, dx: 0, dy: 0, showBubble: true }))
    );
  }, []);

  // Gentle avatar drift animation (every 4s, small random movement)
  useEffect(() => {
    animRef.current = setInterval(() => {
      setVisitors((prev) =>
        prev.map((v) => ({
          ...v,
          dx: Math.max(-6, Math.min(6, v.dx + (Math.random() - 0.5) * 4)),
          dy: Math.max(-4, Math.min(4, v.dy + (Math.random() - 0.5) * 3)),
        }))
      );
    }, 4000);
    return () => clearInterval(animRef.current);
  }, []);

  // Bubble visibility cycling (stagger so not all show at once)
  useEffect(() => {
    bubbleRef.current = setInterval(() => {
      setVisitors((prev) =>
        prev.map((v, i) => ({
          ...v,
          showBubble: ((Date.now() / 3000 + i * 1.7) % 5) < 3.5,
        }))
      );
    }, 2500);
    return () => clearInterval(bubbleRef.current);
  }, []);

  const handleTap = useCallback((visitor: SquareVisitor) => {
    setSelected(visitor);
  }, []);

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 72px)" }}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <h1 className="text-xl font-bold">広場</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/square/bubble"
            className="flex h-8 items-center gap-1 rounded-full px-3 text-[11px] font-medium"
            style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-soft-text)" }}
          >
            💬 吹き出し
          </Link>
          <Link
            href="/square/customize"
            className="flex h-8 items-center gap-1 rounded-full px-3 text-[11px] font-medium"
            style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-soft-text)" }}
          >
            ✨ 着せ替え
          </Link>
        </div>
      </div>

      {/* ── Park area ── */}
      <div data-no-swipe className="flex-1 relative mx-2 mb-2 rounded-2xl overflow-hidden" style={{ minHeight: 420 }}>
        {/* Background */}
        <ParkBackground />

        {/* Visitor avatars */}
        {visitors.map((v) => (
          <button
            key={v.id}
            onClick={() => handleTap(v)}
            className="absolute transition-all duration-[3500ms] ease-in-out"
            style={{
              left: `${v.x + v.dx}%`,
              top: `${v.y + v.dy}%`,
              transform: "translate(-50%, -100%)",
              zIndex: Math.round(v.y + v.dy),
            }}
          >
            {/* Bubble */}
            <Bubble text={v.bubble} visible={v.showBubble} />
            {/* Avatar */}
            <AvatarFigure style={v.avatarStyle} size={48} animate="idle" />
            {/* Name tag */}
            <p
              className="mt-0.5 text-center text-[9px] font-medium leading-none"
              style={{
                color: "#444",
                textShadow: "0 0 4px rgba(255,255,255,0.9)",
              }}
            >
              {v.displayName}
            </p>
          </button>
        ))}

        {/* "You are here" indicator */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-medium backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(123,140,255,0.15)",
            color: "var(--accent)",
            border: "1px solid rgba(123,140,255,0.25)",
          }}
        >
          あなたもここにいます
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center justify-between px-5 py-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--success)" }} />
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            今 {visitors.length}人がいます
          </span>
        </div>
        <Link
          href="/square/new"
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"
          style={{ background: "var(--gradient-main)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          投稿
        </Link>
      </div>

      {/* ── Bottom sheet ── */}
      {selected && (
        <VisitorSheet visitor={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
