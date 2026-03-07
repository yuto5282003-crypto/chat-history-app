"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ParkBackground from "@/components/square/ParkBackground";
import AvatarFigure from "@/components/square/AvatarFigure";
import Bubble from "@/components/square/Bubble";
import VisitorSheet from "@/components/square/VisitorSheet";
import { DEMO_SQUARE_VISITORS } from "@/lib/demo-data";
import type { SquareVisitor } from "@/lib/demo-data";

const Avatar3D = dynamic(() => import("@/components/square/Avatar3D"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center" style={{ width: 80, height: 80 }}>
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent" style={{ borderColor: "var(--accent)" }} />
    </div>
  ),
});

/* ─── Constants ─── */
const WALK_SPEED = 10; // % per second
const APPROACH_STOP_DIST = 7; // stop this far from target (%)
const NPC_INTERVAL = 4000; // ms between NPC wander decisions
const NPC_RANGE = 3.5; // max % per NPC step
// 男の子3Dモデル — Google Drive経由
const MY_MODEL = "/api/model-proxy?id=11oL9zWREayIqI2Nh3s7-1dpu9EYGvoTp";

/* ─── Types ─── */
type VisitorAnim = SquareVisitor & {
  posX: number;
  posY: number;
  showBubble: boolean;
  facing: "left" | "right";
  walkMs: number; // CSS transition duration for current movement
};

type TapRipple = { id: number; x: number; y: number };
type MeetEffect = { id: number; x: number; y: number };

export default function SquarePage() {
  /* ── Visitor state ── */
  const [visitors, setVisitors] = useState<VisitorAnim[]>([]);
  const [selected, setSelected] = useState<SquareVisitor | null>(null);
  const [rotatingAvatarId, setRotatingAvatarId] = useState<string | null>(null);

  /* ── Self avatar state ── */
  const [myPos, setMyPos] = useState({ x: 50, y: 58 });
  const [myFacing, setMyFacing] = useState<"left" | "right">("right");
  const [myWalkMs, setMyWalkMs] = useState(0);
  const [myIsWalking, setMyIsWalking] = useState(false);

  /* ── Effects ── */
  const [tapRipples, setTapRipples] = useState<TapRipple[]>([]);
  const [meetEffects, setMeetEffects] = useState<MeetEffect[]>([]);
  const rippleId = useRef(0);

  /* ── Refs ── */
  const moveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const approachRef = useRef<SquareVisitor | null>(null);
  const parkRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const npcRef = useRef<ReturnType<typeof setInterval>>(undefined);

  /* ── Initialize visitors — show all (3D model, avatarImage, or AvatarFigure fallback) ── */
  useEffect(() => {
    setVisitors(
      DEMO_SQUARE_VISITORS.map((v, i) => ({
        ...v,
        posX: v.x,
        posY: v.y,
        showBubble: i < 4,
        facing: Math.random() > 0.5 ? "left" : "right",
        walkMs: 0,
      }))
    );
  }, []);

  /* ── NPC wander — replace old drift ── */
  useEffect(() => {
    npcRef.current = setInterval(() => {
      setVisitors((prev) =>
        prev.map((v) => {
          // 35% chance to walk each tick
          if (Math.random() > 0.35) return v;
          const dx = (Math.random() - 0.5) * NPC_RANGE * 2;
          const dy = (Math.random() - 0.5) * NPC_RANGE;
          const newX = Math.max(8, Math.min(92, v.posX + dx));
          const newY = Math.max(22, Math.min(88, v.posY + dy));
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ms = Math.max(1500, (dist / WALK_SPEED) * 1000 * 3); // NPCs move slower
          return {
            ...v,
            posX: newX,
            posY: newY,
            facing: dx >= 0 ? "right" : "left",
            walkMs: ms,
          };
        })
      );
    }, NPC_INTERVAL);
    return () => clearInterval(npcRef.current);
  }, []);

  /* ── Bubble cycling ── */
  useEffect(() => {
    bubbleRef.current = setInterval(() => {
      setVisitors((prev) =>
        prev.map((v, i) => ({
          ...v,
          showBubble: ((Date.now() / 4000 + i * 1.3) % 6) < 3,
        }))
      );
    }, 3000);
    return () => clearInterval(bubbleRef.current);
  }, []);

  /* ── Helpers ── */
  const distBetween = (ax: number, ay: number, bx: number, by: number) =>
    Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);

  const moveMyAvatar = useCallback(
    (tx: number, ty: number, onArrive?: () => void) => {
      clearTimeout(moveTimeout.current);
      approachRef.current = null;

      const dx = tx - myPos.x;
      const dy = ty - myPos.y;
      const dist = distBetween(myPos.x, myPos.y, tx, ty);
      if (dist < 0.5) return; // already there

      const ms = (dist / WALK_SPEED) * 1000;
      setMyFacing(dx >= 0 ? "right" : "left");
      setMyWalkMs(ms);
      setMyIsWalking(true);

      // Use rAF to ensure the transition property is set before position changes
      requestAnimationFrame(() => {
        setMyPos({ x: tx, y: ty });
      });

      moveTimeout.current = setTimeout(() => {
        setMyIsWalking(false);
        setMyWalkMs(0);
        onArrive?.();
      }, ms + 50);
    },
    [myPos]
  );

  /* ── Ground tap — move self ── */
  const handleGroundTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (rotatingAvatarId) return;
      // Ignore if tapped on an avatar button
      const target = e.target as HTMLElement;
      if (target.closest("[data-avatar]")) return;

      const rect = parkRef.current?.getBoundingClientRect();
      if (!rect) return;

      let clientX: number, clientY: number;
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const px = ((clientX - rect.left) / rect.width) * 100;
      const py = ((clientY - rect.top) / rect.height) * 100;

      // Clamp to walkable area
      const tx = Math.max(5, Math.min(95, px));
      const ty = Math.max(20, Math.min(90, py));

      // Add tap ripple
      const id = ++rippleId.current;
      setTapRipples((r) => [...r, { id, x: tx, y: ty }]);
      setTimeout(() => setTapRipples((r) => r.filter((rr) => rr.id !== id)), 800);

      moveMyAvatar(tx, ty);
    },
    [moveMyAvatar, rotatingAvatarId]
  );

  /* ── Visitor tap — approach then show profile ── */
  const handleVisitorTap = useCallback(
    (visitor: SquareVisitor) => {
      if (rotatingAvatarId) return;

      const v = visitors.find((vv) => vv.id === visitor.id);
      if (!v) {
        setSelected(visitor);
        return;
      }

      // Calculate approach position — stop near the visitor, facing them
      const angle = Math.atan2(myPos.y - v.posY, myPos.x - v.posX);
      const tx = v.posX + Math.cos(angle) * APPROACH_STOP_DIST;
      const ty = v.posY + Math.sin(angle) * APPROACH_STOP_DIST;

      approachRef.current = visitor;

      moveMyAvatar(
        Math.max(5, Math.min(95, tx)),
        Math.max(20, Math.min(90, ty)),
        () => {
          // Meeting effect
          const midX = (tx + v.posX) / 2;
          const midY = (ty + v.posY) / 2;
          const id = ++rippleId.current;
          setMeetEffects((e) => [...e, { id, x: midX, y: midY }]);
          setTimeout(() => setMeetEffects((e) => e.filter((ee) => ee.id !== id)), 900);

          // Show profile after brief pause
          setTimeout(() => {
            setSelected(visitor);
            approachRef.current = null;
          }, 400);
        }
      );
    },
    [visitors, myPos, moveMyAvatar, rotatingAvatarId]
  );

  /* ── Render ── */
  const myAvatarSize = 62 + Math.round((myPos.y / 100) * 16);
  const myZIndex = Math.round(myPos.y) + 10;

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 72px)" }}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1.5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-bold">広場</h1>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-[6px] w-[6px] rounded-full animate-pulse"
              style={{ backgroundColor: "var(--success)" }}
            />
            <span className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>
              {visitors.length + 1}人
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Link
            href="/square/bubble"
            className="flex h-8 items-center gap-1 rounded-full px-3 text-[11px] font-medium transition-colors"
            style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-soft-text)" }}
          >
            吹き出し
          </Link>
          <Link
            href="/square/customize"
            className="flex h-8 items-center gap-1 rounded-full px-3 text-[11px] font-medium transition-colors"
            style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-soft-text)" }}
          >
            着せ替え
          </Link>
        </div>
      </div>

      {/* ── Park area ── */}
      <div
        ref={parkRef}
        data-no-swipe
        className="flex-1 relative mx-2 mb-1 rounded-2xl overflow-hidden"
        style={{
          minHeight: 680,
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.03)",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        onClick={handleGroundTap}
      >
        <ParkBackground />

        {/* Ambient particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { x: "15%", y: "30%", delay: "0s", dur: "8s" },
            { x: "70%", y: "25%", delay: "2s", dur: "10s" },
            { x: "45%", y: "60%", delay: "4s", dur: "7s" },
            { x: "80%", y: "50%", delay: "1s", dur: "9s" },
            { x: "30%", y: "70%", delay: "3s", dur: "11s" },
          ].map((p, i) => (
            <div
              key={`particle-${i}`}
              className="absolute animate-plaza-float"
              style={{
                left: p.x,
                top: p.y,
                width: 3,
                height: 3,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.5)",
                animationDelay: p.delay,
                animationDuration: p.dur,
              }}
            />
          ))}
        </div>

        {/* ── Tap ripple effects ── */}
        {tapRipples.map((r) => (
          <div
            key={r.id}
            className="absolute pointer-events-none"
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 999,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "2px solid rgba(155,138,251,0.6)",
                animation: "tapRipple 0.8s ease-out forwards",
              }}
            />
          </div>
        ))}

        {/* ── Meet effects ── */}
        {meetEffects.map((e) => (
          <div
            key={e.id}
            className="absolute pointer-events-none"
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
            }}
          >
            {/* Sparkle ring */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(155,138,251,0.3) 0%, transparent 70%)",
                animation: "meetPulse 0.9s ease-out forwards",
              }}
            />
            {/* Star particles */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <div
                key={deg}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  backgroundColor: "#9b8afb",
                  animation: `meetStar 0.7s ease-out ${deg / 1000}s forwards`,
                  transform: `rotate(${deg}deg) translateX(0px)`,
                }}
              />
            ))}
          </div>
        ))}

        {/* ── NPC visitor avatars ── */}
        {visitors.map((v, idx) => {
          const zIndex = Math.round(v.posY);
          const avatarSize = 62 + Math.round((v.posY / 100) * 16);
          const hasImage = !!v.avatarImage;
          const has3D = !!v.model3d;
          const avatar3DSize = avatarSize * 0.95;

          return (
            <div
              key={v.id}
              data-avatar="npc"
              onClick={(e) => {
                e.stopPropagation();
                handleVisitorTap(v);
              }}
              className="absolute group"
              style={{
                left: `${v.posX}%`,
                top: `${v.posY}%`,
                transform: `translate(-50%, -100%)${!has3D && v.facing === "left" ? " scaleX(-1)" : ""}`,
                zIndex: has3D ? zIndex + 10 : zIndex,
                transition: `left ${v.walkMs}ms ease-in-out, top ${v.walkMs}ms ease-in-out`,
                cursor: "pointer",
                // Larger touch target
                padding: "8px",
                margin: "-8px",
              }}
            >
              <div className="relative">
                <div style={{ transform: `scaleX(${!has3D && v.facing === "left" ? -1 : 1})` }}>
                  <Bubble text={v.bubble} visible={v.showBubble} />
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "radial-gradient(circle, rgba(155,138,251,0.15) 0%, transparent 70%)",
                    transform: "scale(2)",
                    pointerEvents: "none",
                  }}
                />

                {has3D ? (
                  <div className="flex flex-col items-center relative">
                    <div
                      className="absolute -top-1 -right-1 z-10 rounded-full px-1.5 py-0.5 text-[8px] font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        boxShadow: "0 1px 4px rgba(102,126,234,0.4)",
                      }}
                    >
                      3D
                    </div>
                    <Avatar3D
                      modelUrl={v.model3d}
                      size={avatar3DSize}
                      autoRotate={false}
                      animationSpeed={0.8}
                      enableLongPressRotate
                      onRotatingChange={(rotating) =>
                        setRotatingAvatarId(rotating ? v.id : null)
                      }
                    />
                    {/* Transparent tap capture — ensures click reaches handleVisitorTap even over Canvas */}
                    {rotatingAvatarId !== v.id && (
                      <div
                        className="absolute inset-0 z-[5] cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVisitorTap(v);
                        }}
                      />
                    )}
                    <div
                      className="animate-avatar-shadow"
                      style={{
                        width: avatar3DSize * 0.5,
                        height: avatar3DSize * 0.1,
                        borderRadius: "50%",
                        background:
                          "radial-gradient(ellipse, rgba(102,126,234,0.25) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
                        marginTop: -4,
                        animationDelay: `${idx * 0.6}s`,
                      }}
                    />
                  </div>
                ) : hasImage ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={v.avatarImage}
                      alt={v.displayName}
                      className="animate-avatar-float"
                      style={{
                        width: avatarSize,
                        height: avatarSize,
                        objectFit: "contain",
                        animationDelay: `${idx * 0.6}s`,
                        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.08))",
                      }}
                      draggable={false}
                    />
                    <div
                      className="animate-avatar-shadow"
                      style={{
                        width: avatarSize * 0.5,
                        height: avatarSize * 0.12,
                        borderRadius: "50%",
                        backgroundColor: "rgba(0,0,0,0.12)",
                        marginTop: -2,
                        animationDelay: `${idx * 0.6}s`,
                      }}
                    />
                  </div>
                ) : (
                  <AvatarFigure style={v.avatarStyle} size={avatarSize} animate="idle" />
                )}
              </div>

              {/* Name tag */}
              <p
                className="mt-0.5 text-center text-[10px] font-semibold leading-none"
                style={{
                  color: "#3A3A4A",
                  textShadow:
                    "0 0 6px rgba(255,255,255,0.95), 0 0 12px rgba(255,255,255,0.5)",
                  transform: `scaleX(${!has3D && v.facing === "left" ? -1 : 1})`,
                  letterSpacing: "0.02em",
                }}
              >
                {v.displayName}
              </p>
            </div>
          );
        })}

        {/* ── My avatar (self) ── */}
        <div
          data-avatar="self"
          className="absolute"
          style={{
            left: `${myPos.x}%`,
            top: `${myPos.y}%`,
            transform: "translate(-50%, -100%)",
            zIndex: myZIndex,
            transition:
              myWalkMs > 0
                ? `left ${myWalkMs}ms ease-in-out, top ${myWalkMs}ms ease-in-out`
                : "none",
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* "You" indicator */}
            <div
              className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[7px] font-bold text-white whitespace-nowrap z-20"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 1px 6px rgba(102,126,234,0.5)",
              }}
            >
              YOU
            </div>

            {/* 3D badge */}
            <div
              className="absolute -top-1 -right-1 z-10 rounded-full px-1.5 py-0.5 text-[8px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 1px 4px rgba(102,126,234,0.4)",
              }}
            >
              3D
            </div>

            <Avatar3D
              modelUrl={MY_MODEL}
              size={myAvatarSize * 0.95}
              autoRotate={false}
              animationSpeed={myIsWalking ? 1.2 : 0.6}
              enableLongPressRotate
              onRotatingChange={(rotating) =>
                setRotatingAvatarId(rotating ? "self" : null)
              }
            />

            {/* Ground glow */}
            <div
              className="animate-avatar-shadow"
              style={{
                width: myAvatarSize * 0.5,
                height: myAvatarSize * 0.1,
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse, rgba(102,126,234,0.3) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)",
                marginTop: -4,
              }}
            />

            {/* Name tag */}
            <p
              className="mt-0.5 text-center text-[10px] font-bold leading-none"
              style={{
                color: "#5B4FC7",
                textShadow:
                  "0 0 6px rgba(255,255,255,0.95), 0 0 12px rgba(255,255,255,0.5)",
                letterSpacing: "0.02em",
              }}
            >
              自分
            </p>
          </div>
        </div>

        {/* ── Walking indicator (when moving) ── */}
        {myIsWalking && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${myPos.x}%`,
              top: `${myPos.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: myZIndex - 1,
              transition: `left ${myWalkMs}ms ease-in-out, top ${myWalkMs}ms ease-in-out`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "rgba(155,138,251,0.4)",
                animation: "tapRipple 1.5s ease-out infinite",
              }}
            />
          </div>
        )}

        {/* Bottom indicator */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1.5 text-[10px] font-medium backdrop-blur-md pointer-events-none"
          style={{
            backgroundColor: "rgba(123,140,255,0.12)",
            color: "var(--accent)",
            border: "1px solid rgba(123,140,255,0.2)",
            boxShadow: "0 2px 8px rgba(123,140,255,0.08)",
            zIndex: 100,
          }}
        >
          地面をタップで移動 / キャラをタップで話しかける
        </div>
      </div>

      {/* ── Bottom action bar ── */}
      <div className="flex items-center justify-between px-5 py-2">
        <p className="text-[11px]" style={{ color: "var(--muted)" }}>
          タップして歩こう
        </p>
        <Link
          href="/square/new"
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition-transform active:scale-95"
          style={{ background: "var(--gradient-main)" }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          投稿する
        </Link>
      </div>

      {/* ── Bottom sheet ── */}
      {selected && (
        <VisitorSheet visitor={selected} onClose={() => setSelected(null)} />
      )}

      {/* ── Inline keyframe styles ── */}
      <style jsx global>{`
        @keyframes tapRipple {
          0% {
            transform: scale(0.3);
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        @keyframes meetPulse {
          0% {
            transform: scale(0.2);
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes meetStar {
          0% {
            transform: rotate(var(--deg, 0deg)) translateX(0px);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--deg, 0deg)) translateX(30px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
