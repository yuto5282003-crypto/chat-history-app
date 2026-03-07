"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FarLayer, MidLayer, NearLayer } from "@/components/square/ParallaxPark";
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
const WORLD_SCALE = 3; // world is 3× viewport width
const WALK_SPEED = 8; // % per second (world coords)
const APPROACH_STOP_DIST = 4;
const NPC_INTERVAL = 4000;
const NPC_RANGE = 2.5;
const SWIPE_THRESHOLD = 10; // px before swipe is recognised
const MY_MODEL = "/api/model-proxy?id=11oL9zWREayIqI2Nh3s7-1dpu9EYGvoTp";

const AREAS = [
  { name: "カフェ前", icon: "☕", xMin: 0, xMax: 33 },
  { name: "中央広場", icon: "⛲", xMin: 33, xMax: 66 },
  { name: "シティビュー", icon: "🏙️", xMin: 66, xMax: 100 },
] as const;

/* ─── Types ─── */
type VisitorAnim = SquareVisitor & {
  posX: number;
  posY: number;
  showBubble: boolean;
  facing: "left" | "right";
  walkMs: number;
};

type TapRipple = { id: number; x: number; y: number };
type MeetEffect = { id: number; x: number; y: number };

export default function SquarePage() {
  /* ── Visitor state ── */
  const [visitors, setVisitors] = useState<VisitorAnim[]>([]);
  const [selected, setSelected] = useState<SquareVisitor | null>(null);
  const [rotatingAvatarId, setRotatingAvatarId] = useState<string | null>(null);

  /* ── Self avatar state (world coordinates: x 0-100, y 0-100) ── */
  const [myPos, setMyPos] = useState({ x: 50, y: 55 });
  const [myFacing, setMyFacing] = useState<"left" | "right">("right");
  const [myWalkMs, setMyWalkMs] = useState(0);
  const [myIsWalking, setMyIsWalking] = useState(false);

  /* ── Camera ── */
  const [cameraX, setCameraX] = useState(0); // px offset
  const [cameraDur, setCameraDur] = useState(0); // transition duration ms
  const [viewportW, setViewportW] = useState(0);

  /* ── Effects ── */
  const [tapRipples, setTapRipples] = useState<TapRipple[]>([]);
  const [meetEffects, setMeetEffects] = useState<MeetEffect[]>([]);
  const rippleId = useRef(0);

  /* ── Refs ── */
  const parkRef = useRef<HTMLDivElement>(null);
  const moveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const approachRef = useRef<SquareVisitor | null>(null);
  const bubbleRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const npcRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const cameraXRef = useRef(0);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startCamX: 0,
    lastX: 0,
    velocity: 0,
    moved: false,
  });

  /* ── Derived ── */
  const worldW = viewportW * WORLD_SCALE;
  const maxCamX = Math.max(0, worldW - viewportW);

  /* ── Keep ref in sync ── */
  useEffect(() => {
    cameraXRef.current = cameraX;
  }, [cameraX]);

  /* ── Viewport sizing ── */
  useEffect(() => {
    const el = parkRef.current;
    if (!el) return;
    const update = () => setViewportW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Camera target helper ── */
  const getCameraTarget = useCallback(
    (worldPercentX: number) => {
      if (!viewportW) return 0;
      const avatarPx = (worldPercentX / 100) * worldW;
      return Math.max(0, Math.min(avatarPx - viewportW / 2, maxCamX));
    },
    [viewportW, worldW, maxCamX]
  );

  /* ── Initial camera ── */
  useEffect(() => {
    if (viewportW > 0) {
      const target = getCameraTarget(50);
      setCameraX(target);
      setCameraDur(0);
    }
  }, [viewportW, getCameraTarget]);

  /* ── Initialize visitors (3D only) ── */
  useEffect(() => {
    const supported = DEMO_SQUARE_VISITORS.filter((v) => !!v.model3d);
    setVisitors(
      supported.map((v, i) => ({
        ...v,
        posX: v.x,
        posY: v.y,
        showBubble: i < 4,
        facing: Math.random() > 0.5 ? "left" : "right",
        walkMs: 0,
      }))
    );
  }, []);

  /* ── NPC wander (constrained near home) ── */
  useEffect(() => {
    npcRef.current = setInterval(() => {
      setVisitors((prev) =>
        prev.map((v) => {
          if (Math.random() > 0.35) return v;
          const dx = (Math.random() - 0.5) * NPC_RANGE * 2;
          const dy = (Math.random() - 0.5) * NPC_RANGE;
          const newX = Math.max(v.x - 8, Math.min(v.x + 8, v.posX + dx));
          const newY = Math.max(25, Math.min(85, v.posY + dy));
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ms = Math.max(1500, (dist / WALK_SPEED) * 1000 * 3);
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
      if (dist < 0.5) return;

      const ms = (dist / WALK_SPEED) * 1000;
      setMyFacing(dx >= 0 ? "right" : "left");
      setMyWalkMs(ms);
      setMyIsWalking(true);

      // Camera follows avatar walk
      const camTarget = getCameraTarget(tx);
      setCameraX(camTarget);
      setCameraDur(ms);

      requestAnimationFrame(() => {
        setMyPos({ x: tx, y: ty });
      });

      moveTimeout.current = setTimeout(() => {
        setMyIsWalking(false);
        setMyWalkMs(0);
        onArrive?.();
      }, ms + 50);
    },
    [myPos, getCameraTarget]
  );

  /* ── Screen → world coordinate conversion ── */
  const screenToWorld = useCallback(
    (clientX: number, clientY: number) => {
      const rect = parkRef.current?.getBoundingClientRect();
      if (!rect || !worldW) return null;
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;
      const worldPxX = cameraXRef.current + relX;
      return {
        x: Math.max(2, Math.min(98, (worldPxX / worldW) * 100)),
        y: Math.max(20, Math.min(90, (relY / rect.height) * 100)),
      };
    },
    [worldW]
  );

  /* ── Tap to walk ── */
  const handleGroundTapAt = useCallback(
    (clientX: number, clientY: number) => {
      if (rotatingAvatarId) return;
      const pos = screenToWorld(clientX, clientY);
      if (!pos) return;

      const id = ++rippleId.current;
      setTapRipples((r) => [...r, { id, x: pos.x, y: pos.y }]);
      setTimeout(() => setTapRipples((r) => r.filter((rr) => rr.id !== id)), 800);

      moveMyAvatar(pos.x, pos.y);
    },
    [screenToWorld, moveMyAvatar, rotatingAvatarId]
  );

  /* ── Visitor tap — approach then profile ── */
  const handleVisitorTap = useCallback(
    (visitor: SquareVisitor) => {
      if (rotatingAvatarId) return;
      const v = visitors.find((vv) => vv.id === visitor.id);
      if (!v) {
        setSelected(visitor);
        return;
      }

      const angle = Math.atan2(myPos.y - v.posY, myPos.x - v.posX);
      const tx = Math.max(2, Math.min(98, v.posX + Math.cos(angle) * APPROACH_STOP_DIST));
      const ty = Math.max(20, Math.min(90, v.posY + Math.sin(angle) * APPROACH_STOP_DIST));

      approachRef.current = visitor;
      moveMyAvatar(tx, ty, () => {
        const midX = (tx + v.posX) / 2;
        const midY = (ty + v.posY) / 2;
        const id = ++rippleId.current;
        setMeetEffects((e) => [...e, { id, x: midX, y: midY }]);
        setTimeout(() => setMeetEffects((e) => e.filter((ee) => ee.id !== id)), 900);
        setTimeout(() => {
          setSelected(visitor);
          approachRef.current = null;
        }, 400);
      });
    },
    [visitors, myPos, moveMyAvatar, rotatingAvatarId]
  );

  /* ── Pointer handlers (swipe + tap) ── */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (rotatingAvatarId) return;
      if ((e.target as HTMLElement).closest("[data-avatar]")) return;
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startCamX: cameraXRef.current,
        lastX: e.clientX,
        velocity: 0,
        moved: false,
      };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [rotatingAvatarId]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d.active) return;
      const totalDx = e.clientX - d.startX;
      d.velocity = e.clientX - d.lastX;
      d.lastX = e.clientX;
      if (Math.abs(totalDx) > SWIPE_THRESHOLD) {
        d.moved = true;
        const newCam = Math.max(0, Math.min(d.startCamX - totalDx, maxCamX));
        setCameraX(newCam);
        setCameraDur(0);
      }
    },
    [maxCamX]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d.active) return;
      d.active = false;
      if (!d.moved) {
        handleGroundTapAt(e.clientX, e.clientY);
      } else {
        // Momentum
        const momentum = d.velocity * 8;
        const newCam = Math.max(0, Math.min(cameraXRef.current - momentum, maxCamX));
        setCameraX(newCam);
        setCameraDur(300);
      }
    },
    [maxCamX, handleGroundTapAt]
  );

  /* ── Area label ── */
  const currentArea = AREAS.find((a) => myPos.x >= a.xMin && myPos.x < a.xMax) ?? AREAS[1];

  /* ── Render sizes ── */
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

      {/* ── Park viewport ── */}
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {viewportW > 0 && (
          <>
            {/* ── Far parallax layer (0.3×) ── */}
            <div
              className="absolute top-0 left-0 h-full pointer-events-none"
              style={{
                width: worldW,
                transform: `translateX(${-cameraX * 0.3}px)`,
                transition: cameraDur > 0 ? `transform ${cameraDur}ms ease-in-out` : "none",
                willChange: "transform",
              }}
            >
              <FarLayer />
            </div>

            {/* ── Mid parallax layer (0.6×) ── */}
            <div
              className="absolute top-0 left-0 h-full pointer-events-none"
              style={{
                width: worldW,
                transform: `translateX(${-cameraX * 0.6}px)`,
                transition: cameraDur > 0 ? `transform ${cameraDur}ms ease-in-out` : "none",
                willChange: "transform",
              }}
            >
              <MidLayer />
            </div>

            {/* ── Game layer (1×) — ground + avatars ── */}
            <div
              className="absolute top-0 left-0 h-full"
              style={{
                width: worldW,
                transform: `translateX(${-cameraX}px)`,
                transition: cameraDur > 0 ? `transform ${cameraDur}ms ease-in-out` : "none",
                willChange: "transform",
              }}
            >
              <NearLayer />

              {/* Tap ripples */}
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

              {/* Meet effects */}
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
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(155,138,251,0.3) 0%, transparent 70%)",
                      animation: "meetPulse 0.9s ease-out forwards",
                    }}
                  />
                </div>
              ))}

              {/* ── NPC avatars (3D, always mounted) ── */}
              {visitors.map((v, idx) => {
                const zIndex = Math.round(v.posY);
                const avatarSize = 62 + Math.round((v.posY / 100) * 16);
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
                      transform: "translate(-50%, -100%)",
                      zIndex: zIndex + 10,
                      transition: `left ${v.walkMs}ms ease-in-out, top ${v.walkMs}ms ease-in-out`,
                      cursor: "pointer",
                      padding: 8,
                      margin: -8,
                    }}
                  >
                    <div className="relative">
                      <Bubble text={v.bubble} visible={v.showBubble} />

                      <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: "radial-gradient(circle, rgba(155,138,251,0.15) 0%, transparent 70%)",
                          transform: "scale(2)",
                          pointerEvents: "none",
                        }}
                      />

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
                    </div>

                    <p
                      className="mt-0.5 text-center text-[10px] font-semibold leading-none"
                      style={{
                        color: "#3A3A4A",
                        textShadow: "0 0 6px rgba(255,255,255,0.95), 0 0 12px rgba(255,255,255,0.5)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {v.displayName}
                    </p>
                  </div>
                );
              })}

              {/* ── Self avatar ── */}
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
                  <div
                    className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[7px] font-bold text-white whitespace-nowrap z-20"
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 1px 6px rgba(102,126,234,0.5)",
                    }}
                  >
                    YOU
                  </div>

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

                  <p
                    className="mt-0.5 text-center text-[10px] font-bold leading-none"
                    style={{
                      color: "#5B4FC7",
                      textShadow: "0 0 6px rgba(255,255,255,0.95), 0 0 12px rgba(255,255,255,0.5)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    自分
                  </p>
                </div>
              </div>

              {/* Walking indicator */}
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
            </div>
          </>
        )}

        {/* ── UI Overlays (fixed to viewport) ── */}

        {/* Area indicator */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md"
          style={{
            backgroundColor: "rgba(255,255,255,0.75)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          <span className="text-[12px]">{currentArea.icon}</span>
          <span className="text-[11px] font-semibold" style={{ color: "#3A3A4A" }}>
            {currentArea.name}
          </span>
        </div>

        {/* Area dots */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 flex gap-1.5">
          {AREAS.map((a) => (
            <div
              key={a.name}
              className="rounded-full transition-all duration-300"
              style={{
                width: a === currentArea ? 12 : 6,
                height: 6,
                borderRadius: a === currentArea ? 3 : "50%",
                backgroundColor: a === currentArea ? "var(--accent)" : "rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </div>

        {/* Bottom hint */}
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
          スワイプで見渡す / タップで歩く
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

      {/* ── Keyframes ── */}
      <style jsx global>{`
        @keyframes tapRipple {
          0% { transform: scale(0.3); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes meetPulse {
          0% { transform: scale(0.2); opacity: 1; }
          50% { opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes meetStar {
          0% { transform: rotate(var(--deg, 0deg)) translateX(0px); opacity: 1; }
          100% { transform: rotate(var(--deg, 0deg)) translateX(30px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
