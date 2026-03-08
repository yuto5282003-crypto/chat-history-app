"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { FarLayer, MidLayer, NearLayer } from "@/components/square/ParallaxPark";
import Bubble from "@/components/square/Bubble";
import VisitorSheet from "@/components/square/VisitorSheet";
import { DEMO_SQUARE_VISITORS } from "@/lib/demo-data";
import type { SquareVisitor } from "@/lib/demo-data";
import { useAvatarSnapshots } from "@/lib/useAvatarSnapshots";

/* ─── Constants ─── */
const WORLD_SCALE = 4; // 4 areas, 4× viewport width
const WALK_SPEED = 8;
const APPROACH_STOP_DIST = 4;
const PROXIMITY_DIST = 6;
const NPC_INTERVAL = 4000;
const NPC_RANGE = 2.5;
const SWIPE_THRESHOLD = 10;
const LEFT_MARGIN = 0; // no scroll past left edge — building fills viewport
const AVATAR_DRAG_THRESHOLD = 8;
const DEFAULT_MY_MODEL = "/api/model-proxy?id=11oL9zWREayIqI2Nh3s7-1dpu9EYGvoTp";
const EMOTES = ["👋", "😂", "❤️", "🔥", "✨"] as const;
const MIN_AVATAR_SIZE = 56;
const MAX_AVATAR_SIZE = 72;

const AREAS = [
  { name: "カフェ前", icon: "☕", xMin: 0, xMax: 25, xCenter: 12.5 },
  { name: "公園", icon: "⛲", xMin: 25, xMax: 50, xCenter: 37.5 },
  { name: "シティビュー", icon: "🏙️", xMin: 50, xMax: 75, xCenter: 62.5 },
  { name: "駅前", icon: "🚉", xMin: 75, xMax: 100, xCenter: 87.5 },
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
type FloatingEmote = { id: number; emoji: string; x: number; y: number };
type WeatherData = {
  weather: string;
  temp: number;
  description: string;
  isDay: boolean;
  source: string;
};

/* ─── Helper: clamp avatar size ─── */
function avatarSizeFromY(y: number): number {
  const raw = MIN_AVATAR_SIZE + Math.round(((Math.max(20, Math.min(90, y)) - 20) / 70) * (MAX_AVATAR_SIZE - MIN_AVATAR_SIZE));
  return Math.max(MIN_AVATAR_SIZE, Math.min(MAX_AVATAR_SIZE, raw));
}

export default function SquarePage() {
  /* ── Visitor state ── */
  const [visitors, setVisitors] = useState<VisitorAnim[]>([]);
  const [selected, setSelected] = useState<SquareVisitor | null>(null);
  const [myModel, setMyModel] = useState(DEFAULT_MY_MODEL);

  /* ── Self avatar (world coords: x 0-100, y 0-100) ── */
  const [myPos, setMyPos] = useState({ x: 37.5, y: 55 });
  const [myFacing, setMyFacing] = useState<"left" | "right">("right");
  const [myWalkMs, setMyWalkMs] = useState(0);
  const [myIsWalking, setMyIsWalking] = useState(false);

  /* ── Camera ── */
  const [cameraX, setCameraX] = useState(0);
  const [cameraDur, setCameraDur] = useState(0);
  const [viewportW, setViewportW] = useState(0);

  /* ── Social features ── */
  const [isFree, setIsFree] = useState(false);
  const [nearbyVisitor, setNearbyVisitor] = useState<SquareVisitor | null>(null);
  const [floatingEmotes, setFloatingEmotes] = useState<FloatingEmote[]>([]);

  /* ── Avatar snapshots (lightweight pre-rendered images instead of live 3D) ── */
  const { snapshots: avatarSnapshots, enqueue: enqueueAvatarSnapshots } = useAvatarSnapshots(128);

  /* ── Effects ── */
  const [tapRipples, setTapRipples] = useState<TapRipple[]>([]);
  const [meetEffects, setMeetEffects] = useState<MeetEffect[]>([]);
  const rippleId = useRef(0);

  /* ── Weather & time ── */
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentHour] = useState(() => new Date().getHours());

  /* ── Area tab swipe ── */
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabSwipeRef = useRef({ startX: 0, startY: 0, active: false });

  /* ── Avatar drag-to-move ── */
  const [isDraggingSelf, setIsDraggingSelf] = useState(false);
  const [dragGhostPos, setDragGhostPos] = useState<{ x: number; y: number } | null>(null);
  const avatarDragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    moved: false,
  });

  /* ── Compute time overlay ── */
  const isNight = weather ? !weather.isDay : (currentHour < 6 || currentHour >= 19);
  const isSunset = currentHour >= 17 && currentHour < 19;
  const isDawn = currentHour >= 5 && currentHour < 7;
  const isRaining = weather?.weather === "rain" || weather?.weather === "storm";

  const timeOverlay = isNight
    ? "rgba(10,15,40,0.4)"
    : isSunset
    ? "rgba(255,140,50,0.1)"
    : isDawn
    ? "rgba(255,200,100,0.06)"
    : "transparent";

  /* ── Refs ── */
  const parkRef = useRef<HTMLDivElement>(null);
  const moveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const approachRef = useRef<SquareVisitor | null>(null);
  const bubbleRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const npcRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const cameraXRef = useRef(0);
  const myPosRef = useRef(myPos);
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
  const currentAreaIdx = Math.min(Math.floor(myPos.x / 25), 3);

  useEffect(() => { cameraXRef.current = cameraX; }, [cameraX]);
  useEffect(() => { myPosRef.current = myPos; }, [myPos]);

  /* ── Load selected avatar from localStorage ── */
  useEffect(() => {
    const saved = localStorage.getItem("sloty_selected_avatar");
    if (saved) setMyModel(saved);
    const handleStorage = () => {
      const updated = localStorage.getItem("sloty_selected_avatar");
      if (updated) setMyModel(updated);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /* ── Enqueue avatar snapshots for all models ── */
  useEffect(() => {
    const urls = [myModel, ...DEMO_SQUARE_VISITORS.filter((v) => v.model3d).map((v) => v.model3d!)];
    enqueueAvatarSnapshots(urls);
  }, [myModel, enqueueAvatarSnapshots]);

  /* ── Fetch weather ── */
  useEffect(() => {
    fetch("/api/weather")
      .then((r) => r.json())
      .then((d) => setWeather(d))
      .catch(() => {});
    const interval = setInterval(() => {
      fetch("/api/weather")
        .then((r) => r.json())
        .then((d) => setWeather(d))
        .catch(() => {});
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
      return Math.max(-LEFT_MARGIN, Math.min(avatarPx - viewportW / 2, maxCamX));
    },
    [viewportW, worldW, maxCamX]
  );

  /* ── Initial camera ── */
  useEffect(() => {
    if (viewportW > 0) {
      setCameraX(getCameraTarget(37.5));
      setCameraDur(0);
    }
  }, [viewportW, getCameraTarget]);

  /* ── Initialize visitors ── */
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

  /* ── NPC wander ── */
  useEffect(() => {
    npcRef.current = setInterval(() => {
      setVisitors((prev) =>
        prev.map((v) => {
          if (Math.random() > 0.35) return v;
          const dx = (Math.random() - 0.5) * NPC_RANGE * 2;
          const dy = (Math.random() - 0.5) * NPC_RANGE;
          const newX = Math.max(v.x - 8, Math.min(v.x + 8, v.posX + dx));
          const newY = Math.max(30, Math.min(80, v.posY + dy));
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ms = Math.max(1500, (dist / WALK_SPEED) * 1000 * 3);
          return { ...v, posX: newX, posY: newY, facing: dx >= 0 ? "right" : "left", walkMs: ms };
        })
      );
    }, NPC_INTERVAL);
    return () => clearInterval(npcRef.current);
  }, []);

  /* ── Bubble cycling ── */
  useEffect(() => {
    bubbleRef.current = setInterval(() => {
      setVisitors((prev) =>
        prev.map((v, i) => ({ ...v, showBubble: ((Date.now() / 4000 + i * 1.3) % 6) < 3 }))
      );
    }, 3000);
    return () => clearInterval(bubbleRef.current);
  }, []);

  /* ── Proximity detection ── */
  useEffect(() => {
    if (myIsWalking || selected) { setNearbyVisitor(null); return; }
    const nearby = visitors.find((v) =>
      Math.sqrt((myPos.x - v.posX) ** 2 + (myPos.y - v.posY) ** 2) < PROXIMITY_DIST
    );
    setNearbyVisitor(nearby ?? null);
  }, [myPos, visitors, myIsWalking, selected]);

  /* ── Helpers ── */
  const distBetween = (ax: number, ay: number, bx: number, by: number) =>
    Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);

  const moveMyAvatar = useCallback(
    (tx: number, ty: number, onArrive?: () => void) => {
      clearTimeout(moveTimeout.current);
      approachRef.current = null;
      const cur = myPosRef.current;
      const dx = tx - cur.x;
      const dist = distBetween(cur.x, cur.y, tx, ty);
      if (dist < 0.5) return;
      const ms = (dist / WALK_SPEED) * 1000;
      setMyFacing(dx >= 0 ? "right" : "left");
      setMyWalkMs(ms);
      setMyIsWalking(true);
      setCameraX(getCameraTarget(tx));
      setCameraDur(ms);
      requestAnimationFrame(() => { setMyPos({ x: tx, y: ty }); });
      moveTimeout.current = setTimeout(() => {
        setMyIsWalking(false);
        setMyWalkMs(0);
        onArrive?.();
      }, ms + 50);
    },
    [getCameraTarget]
  );

  /* ── Screen → world ── */
  const screenToWorld = useCallback(
    (clientX: number, clientY: number) => {
      const rect = parkRef.current?.getBoundingClientRect();
      if (!rect || !worldW) return null;
      const worldPxX = cameraXRef.current + (clientX - rect.left);
      return {
        x: Math.max(2, Math.min(98, (worldPxX / worldW) * 100)),
        y: Math.max(25, Math.min(85, ((clientY - rect.top) / rect.height) * 100)),
      };
    },
    [worldW]
  );

  /* ── Tap to walk ── */
  const handleGroundTapAt = useCallback(
    (clientX: number, clientY: number) => {
      const pos = screenToWorld(clientX, clientY);
      if (!pos) return;
      const id = ++rippleId.current;
      setTapRipples((r) => [...r, { id, x: pos.x, y: pos.y }]);
      setTimeout(() => setTapRipples((r) => r.filter((rr) => rr.id !== id)), 800);
      moveMyAvatar(pos.x, pos.y);
    },
    [screenToWorld, moveMyAvatar]
  );

  /* ── Visitor tap — approach then profile ── */
  const handleVisitorTap = useCallback(
    (visitor: SquareVisitor) => {
      const v = visitors.find((vv) => vv.id === visitor.id);
      if (!v) { setSelected(visitor); return; }
      const cur = myPosRef.current;
      const angle = Math.atan2(cur.y - v.posY, cur.x - v.posX);
      const tx = Math.max(2, Math.min(98, v.posX + Math.cos(angle) * APPROACH_STOP_DIST));
      const ty = Math.max(25, Math.min(85, v.posY + Math.sin(angle) * APPROACH_STOP_DIST));
      approachRef.current = visitor;
      moveMyAvatar(tx, ty, () => {
        const midX = (tx + v.posX) / 2;
        const midY = (ty + v.posY) / 2;
        const id = ++rippleId.current;
        setMeetEffects((e) => [...e, { id, x: midX, y: midY }]);
        setTimeout(() => setMeetEffects((e) => e.filter((ee) => ee.id !== id)), 900);
        setTimeout(() => { setSelected(visitor); approachRef.current = null; }, 400);
      });
    },
    [visitors, moveMyAvatar]
  );

  /* ── Area jump ── */
  const jumpToArea = useCallback(
    (index: number) => {
      const area = AREAS[index];
      setCameraX(getCameraTarget(area.xCenter));
      setCameraDur(600);
    },
    [getCameraTarget]
  );

  /* ── Emote ── */
  const handleEmote = useCallback(
    (emoji: string) => {
      const id = ++rippleId.current;
      const cur = myPosRef.current;
      setFloatingEmotes((e) => [...e, { id, emoji, x: cur.x, y: cur.y }]);
      setTimeout(() => setFloatingEmotes((e) => e.filter((ee) => ee.id !== id)), 2000);
    },
    []
  );

  /* ── Visible visitors (all with 3D models) ── */
  const visibleVisitors = visitors.filter((v) => v.model3d);

  /* ── Area people count ── */
  const getAreaCount = useCallback(
    (area: typeof AREAS[number]) => {
      const selfIn = myPos.x >= area.xMin && myPos.x < (area.xMax === 100 ? 101 : area.xMax) ? 1 : 0;
      const npcIn = visibleVisitors.filter(
        (v) => v.posX >= area.xMin && v.posX < (area.xMax === 100 ? 101 : area.xMax)
      ).length;
      return selfIn + npcIn;
    },
    [myPos, visibleVisitors]
  );

  /* ── Self avatar drag-to-move (Streetview style) ── */
  const handleSelfDragStart = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    avatarDragRef.current = { active: true, startX: e.clientX, startY: e.clientY, moved: false };
  }, []);

  const handleSelfDragMove = useCallback((e: React.PointerEvent) => {
    const d = avatarDragRef.current;
    if (!d.active) return;
    const totalDist = Math.sqrt((e.clientX - d.startX) ** 2 + (e.clientY - d.startY) ** 2);
    if (totalDist > AVATAR_DRAG_THRESHOLD) {
      d.moved = true;
      if (!isDraggingSelf) setIsDraggingSelf(true);
      const pos = screenToWorld(e.clientX, e.clientY);
      if (pos) setDragGhostPos(pos);
    }
  }, [isDraggingSelf, screenToWorld]);

  const handleSelfDragEnd = useCallback((e: React.PointerEvent) => {
    const d = avatarDragRef.current;
    d.active = false;
    if (d.moved && dragGhostPos) {
      // Instantly place avatar at drop position
      clearTimeout(moveTimeout.current);
      setMyPos({ x: dragGhostPos.x, y: dragGhostPos.y });
      myPosRef.current = { x: dragGhostPos.x, y: dragGhostPos.y };
      setMyFacing(dragGhostPos.x >= myPosRef.current.x ? "right" : "left");
      setCameraX(getCameraTarget(dragGhostPos.x));
      setCameraDur(300);
      setMyIsWalking(false);
      setMyWalkMs(0);
    }
    setIsDraggingSelf(false);
    setDragGhostPos(null);
  }, [dragGhostPos, getCameraTarget]);

  /* ── Pointer handlers (swipe + tap) ── */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
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
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      // Handle avatar drag
      if (avatarDragRef.current.active) {
        handleSelfDragMove(e);
        return;
      }
      const d = dragRef.current;
      if (!d.active) return;
      const totalDx = e.clientX - d.startX;
      d.velocity = e.clientX - d.lastX;
      d.lastX = e.clientX;
      if (Math.abs(totalDx) > SWIPE_THRESHOLD) {
        d.moved = true;
        setCameraX(Math.max(-LEFT_MARGIN, Math.min(d.startCamX - totalDx, maxCamX)));
        setCameraDur(0);
      }
    },
    [maxCamX, handleSelfDragMove]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      // Handle avatar drag end
      if (avatarDragRef.current.active || isDraggingSelf) {
        handleSelfDragEnd(e);
        return;
      }
      const d = dragRef.current;
      if (!d.active) return;
      d.active = false;
      if (!d.moved) {
        handleGroundTapAt(e.clientX, e.clientY);
      } else {
        const momentum = d.velocity * 8;
        setCameraX(Math.max(-LEFT_MARGIN, Math.min(cameraXRef.current - momentum, maxCamX)));
        setCameraDur(300);
      }
    },
    [maxCamX, handleGroundTapAt, isDraggingSelf, handleSelfDragEnd]
  );

  /* ── Area tab swipe gesture ── */
  const handleTabTouchStart = useCallback((e: React.TouchEvent) => {
    tabSwipeRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, active: true };
  }, []);

  const handleTabTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!tabSwipeRef.current.active) return;
    tabSwipeRef.current.active = false;
    const dx = e.changedTouches[0].clientX - tabSwipeRef.current.startX;
    const dy = e.changedTouches[0].clientY - tabSwipeRef.current.startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      const newIdx = dx < 0
        ? Math.min(currentAreaIdx + 1, AREAS.length - 1)
        : Math.max(currentAreaIdx - 1, 0);
      if (newIdx !== currentAreaIdx) jumpToArea(newIdx);
    }
  }, [currentAreaIdx, jumpToArea]);

  /* ── Render sizes ── */
  const myAvatarSize = avatarSizeFromY(myPos.y);
  const myZIndex = Math.round(myPos.y) + 10;

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 72px)" }}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-bold">広場</h1>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-[6px] w-[6px] rounded-full animate-pulse" style={{ backgroundColor: "var(--success)" }} />
            <span className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>
              {visibleVisitors.length + 1}人
            </span>
          </div>
          {/* Weather badge */}
          {weather && (
            <div className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{
              backgroundColor: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}>
              <span>{weather.weather.includes("rain") ? "🌧" : weather.weather.includes("cloud") ? "☁️" : weather.isDay ? "☀️" : "🌙"}</span>
              <span>{weather.temp}°C</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Link href="/square/bubble" className="flex h-8 items-center gap-1 rounded-full px-3 text-[11px] font-medium transition-colors" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-soft-text)" }}>
            吹き出し
          </Link>
          <Link href="/square/customize" className="flex h-8 items-center gap-1 rounded-full px-3 text-[11px] font-medium transition-colors" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-soft-text)" }}>
            アバター
          </Link>
        </div>
      </div>

      {/* ── Area tabs with swipe gesture ── */}
      <div
        ref={tabsRef}
        className="flex gap-1.5 overflow-x-auto px-3 pb-1.5 scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
        onTouchStart={handleTabTouchStart}
        onTouchEnd={handleTabTouchEnd}
      >
        {AREAS.map((area, i) => (
          <button
            key={area.name}
            onClick={() => jumpToArea(i)}
            className="shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-300 active:scale-95"
            style={{
              background: i === currentAreaIdx ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "rgba(255,255,255,0.7)",
              color: i === currentAreaIdx ? "white" : "#3A3A4A",
              backdropFilter: "blur(8px)",
              border: i === currentAreaIdx ? "none" : "1px solid rgba(0,0,0,0.06)",
              boxShadow: i === currentAreaIdx ? "0 2px 8px rgba(102,126,234,0.3)" : "none",
              transform: i === currentAreaIdx ? "scale(1.05)" : "scale(1)",
            }}
          >
            <span className="text-[12px]">{area.icon}</span>
            <span>{area.name}</span>
            <span className="text-[9px] opacity-70 ml-0.5">{getAreaCount(area)}人</span>
          </button>
        ))}
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
            {/* Far parallax (0.3×) */}
            <div className="absolute top-0 left-0 h-full pointer-events-none" style={{
              width: worldW,
              transform: `translateX(${-cameraX * 0.3}px)`,
              transition: cameraDur > 0 ? `transform ${cameraDur}ms ease-in-out` : "none",
              willChange: "transform",
            }}>
              <FarLayer />
            </div>

            {/* Mid parallax (0.6×) */}
            <div className="absolute top-0 left-0 h-full pointer-events-none" style={{
              width: worldW,
              transform: `translateX(${-cameraX * 0.6}px)`,
              transition: cameraDur > 0 ? `transform ${cameraDur}ms ease-in-out` : "none",
              willChange: "transform",
            }}>
              <MidLayer />
            </div>

            {/* Game layer (1×) */}
            <div className="absolute top-0 left-0 h-full" style={{
              width: worldW,
              transform: `translateX(${-cameraX}px)`,
              transition: cameraDur > 0 ? `transform ${cameraDur}ms ease-in-out` : "none",
              willChange: "transform",
            }}>
              <NearLayer />

              {/* Tap ripples */}
              {tapRipples.map((r) => (
                <div key={r.id} className="absolute pointer-events-none" style={{
                  left: `${r.x}%`, top: `${r.y}%`, transform: "translate(-50%,-50%)", zIndex: 999,
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(155,138,251,0.6)", animation: "tapRipple 0.8s ease-out forwards" }} />
                </div>
              ))}

              {/* Meet effects */}
              {meetEffects.map((e) => (
                <div key={e.id} className="absolute pointer-events-none" style={{
                  left: `${e.x}%`, top: `${e.y}%`, transform: "translate(-50%,-50%)", zIndex: 1000,
                }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle, rgba(155,138,251,0.3) 0%, transparent 70%)", animation: "meetPulse 0.9s ease-out forwards" }} />
                </div>
              ))}

              {/* Floating emotes */}
              {floatingEmotes.map((e) => (
                <div key={e.id} className="absolute pointer-events-none" style={{
                  left: `${e.x}%`, top: `${e.y}%`, zIndex: 1001,
                  animation: "emoteFloat 2s ease-out forwards",
                }}>
                  <span className="text-2xl drop-shadow-md">{e.emoji}</span>
                </div>
              ))}

              {/* ── Drag landing shadow (shows where avatar will land) ── */}
              {isDraggingSelf && dragGhostPos && (
                <div className="absolute pointer-events-none" style={{
                  left: `${dragGhostPos.x}%`, top: `${dragGhostPos.y}%`,
                  transform: "translate(-50%, -50%)", zIndex: 1999,
                }}>
                  <div style={{
                    width: myAvatarSize * 0.6, height: myAvatarSize * 0.15, borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(102,126,234,0.4) 0%, rgba(102,126,234,0.15) 50%, transparent 100%)",
                    animation: "avatarLandingShadow 1s ease-in-out infinite alternate",
                  }} />
                </div>
              )}

              {/* ── NPC avatars ── */}
              {visitors.filter((v) => v.model3d).map((v, idx) => {
                const zIndex = Math.round(v.posY);
                const aSize = avatarSizeFromY(v.posY);
                const avatar3DSize = aSize;
                return (
                  <div
                    key={v.id}
                    data-avatar="npc"
                    onClick={(e) => { e.stopPropagation(); handleVisitorTap(v); }}
                    className="absolute group"
                    style={{
                      left: `${v.posX}%`, top: `${v.posY}%`,
                      transform: "translate(-50%, -100%)", zIndex: zIndex + 10,
                      transition: `left ${v.walkMs}ms ease-in-out, top ${v.walkMs}ms ease-in-out`,
                      cursor: "pointer", padding: 8, margin: -8,
                    }}
                  >
                    <div className="relative">
                      <Bubble text={v.bubble} visible={v.showBubble} />
                      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                        background: "radial-gradient(circle, rgba(155,138,251,0.15) 0%, transparent 70%)",
                        transform: "scale(2)", pointerEvents: "none",
                      }} />
                      <div className="flex flex-col items-center relative">
                        {v.model3d && avatarSnapshots.get(v.model3d) ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={avatarSnapshots.get(v.model3d)}
                            alt={v.displayName}
                            style={{ width: avatar3DSize, height: avatar3DSize, objectFit: "contain" }}
                          />
                        ) : (
                          <div className="flex items-center justify-center" style={{ width: avatar3DSize, height: avatar3DSize }}>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent" style={{ borderColor: "rgba(155,138,251,0.6)" }} />
                          </div>
                        )}
                        <div className="animate-avatar-shadow" style={{
                          width: avatar3DSize * 0.5, height: avatar3DSize * 0.1, borderRadius: "50%",
                          background: "radial-gradient(ellipse, rgba(102,126,234,0.25) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
                          marginTop: -4, animationDelay: `${idx * 0.6}s`,
                        }} />
                      </div>
                    </div>
                    <p className="mt-0.5 text-center text-[10px] font-semibold leading-none" style={{
                      color: "#3A3A4A", textShadow: "0 0 6px rgba(255,255,255,0.95), 0 0 12px rgba(255,255,255,0.5)", letterSpacing: "0.02em",
                    }}>{v.displayName}</p>
                  </div>
                );
              })}

              {/* ── Self avatar ── */}
              <div
                data-avatar="self"
                className="absolute"
                style={{
                  left: `${isDraggingSelf && dragGhostPos ? dragGhostPos.x : myPos.x}%`,
                  top: `${isDraggingSelf && dragGhostPos ? dragGhostPos.y : myPos.y}%`,
                  transform: isDraggingSelf ? "translate(-50%, -120%)" : "translate(-50%, -100%)",
                  zIndex: isDraggingSelf ? 3000 : myZIndex,
                  transition: isDraggingSelf ? "none" : (myWalkMs > 0 ? `left ${myWalkMs}ms ease-in-out, top ${myWalkMs}ms ease-in-out` : "none"),
                  cursor: isDraggingSelf ? "grabbing" : "grab",
                }}
                onPointerDown={handleSelfDragStart}
              >
                <div className={`relative flex flex-col items-center ${isDraggingSelf ? "scale-110" : ""}`} style={{
                  transition: "transform 0.2s",
                  filter: isDraggingSelf ? "drop-shadow(0 8px 12px rgba(102,126,234,0.4))" : "none",
                }}>
                  {/* "今ひま" badge */}
                  {isFree && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[8px] font-bold text-white whitespace-nowrap z-20 animate-pulse" style={{
                      background: "linear-gradient(135deg, #34c77b, #2da85c)", boxShadow: "0 1px 6px rgba(52,199,123,0.5)",
                    }}>
                      今ひま
                    </div>
                  )}

                  <div className={`absolute ${isFree ? "-top-[14px]" : "-top-5"} left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[7px] font-bold text-white whitespace-nowrap z-20`} style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", boxShadow: "0 1px 6px rgba(102,126,234,0.5)",
                  }}>YOU</div>

                  {avatarSnapshots.get(myModel) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={avatarSnapshots.get(myModel)}
                      alt="自分"
                      style={{ width: myAvatarSize, height: myAvatarSize, objectFit: "contain" }}
                    />
                  ) : (
                    <div className="flex items-center justify-center" style={{ width: myAvatarSize, height: myAvatarSize }}>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent" style={{ borderColor: "rgba(155,138,251,0.6)" }} />
                    </div>
                  )}

                  <div className="animate-avatar-shadow" style={{
                    width: myAvatarSize * 0.5, height: myAvatarSize * 0.1, borderRadius: "50%",
                    background: isFree
                      ? "radial-gradient(ellipse, rgba(52,199,123,0.35) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)"
                      : "radial-gradient(ellipse, rgba(102,126,234,0.3) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)",
                    marginTop: -4,
                  }} />

                  <p className="mt-0.5 text-center text-[10px] font-bold leading-none" style={{
                    color: "#5B4FC7", textShadow: "0 0 6px rgba(255,255,255,0.95), 0 0 12px rgba(255,255,255,0.5)", letterSpacing: "0.02em",
                  }}>自分</p>
                </div>
              </div>

              {/* Walking indicator */}
              {myIsWalking && (
                <div className="absolute pointer-events-none" style={{
                  left: `${myPos.x}%`, top: `${myPos.y}%`, transform: "translate(-50%,-50%)",
                  zIndex: myZIndex - 1, transition: `left ${myWalkMs}ms ease-in-out, top ${myWalkMs}ms ease-in-out`,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(155,138,251,0.4)", animation: "tapRipple 1.5s ease-out infinite" }} />
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Day/night overlay ── */}
        <div className="absolute inset-0 pointer-events-none z-30 transition-colors duration-[3000ms]" style={{ backgroundColor: timeOverlay }} />

        {/* ── Rain effect ── */}
        {isRaining && (
          <div className="absolute inset-0 pointer-events-none z-31 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={`rain-${i}`} className="absolute" style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                width: 1,
                height: 12 + Math.random() * 8,
                background: "rgba(180,200,220,0.3)",
                animation: `rainDrop ${0.6 + Math.random() * 0.4}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }} />
            ))}
          </div>
        )}

        {/* ── Night lit windows (far buildings) ── */}
        {isNight && (
          <div className="absolute inset-0 pointer-events-none z-29">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`glow-${i}`} className="absolute rounded-sm" style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${5 + Math.random() * 15}%`,
                width: 3 + Math.random() * 4,
                height: 3 + Math.random() * 3,
                background: `rgba(255,${200 + Math.random() * 55},${100 + Math.random() * 80},${0.3 + Math.random() * 0.3})`,
                animation: `windowFlicker ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }} />
            ))}
          </div>
        )}

        {/* ── Proximity "talk" button ── */}
        {nearbyVisitor && !selected && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 animate-[fadeIn_300ms_ease-out]">
            <button
              onClick={() => setSelected(nearbyVisitor)}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg transition-transform active:scale-95"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 16px rgba(102,126,234,0.4)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {nearbyVisitor.displayName}に話しかける
            </button>
          </div>
        )}

        {/* ── Drag hint ── */}
        {isDraggingSelf && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 rounded-full px-4 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md" style={{
            background: "rgba(102,126,234,0.8)", boxShadow: "0 2px 12px rgba(102,126,234,0.4)",
          }}>
            ドロップで移動先を決定
          </div>
        )}

        {/* ── Bottom hint ── */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1.5 text-[10px] font-medium backdrop-blur-md pointer-events-none" style={{
          backgroundColor: "rgba(123,140,255,0.12)", color: "var(--accent)",
          border: "1px solid rgba(123,140,255,0.2)", boxShadow: "0 2px 8px rgba(123,140,255,0.08)", zIndex: 100,
        }}>
          スワイプで見渡す / タップで歩く / アバターをドラッグで移動
        </div>
      </div>

      {/* ── Bottom bar with emotes ── */}
      <div className="flex items-center justify-between px-3 py-2 gap-2">
        {/* Emote buttons */}
        <div className="flex gap-1.5">
          {EMOTES.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmote(emoji)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-transform active:scale-90"
              style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* "今ひま" toggle */}
          <button
            onClick={() => setIsFree(!isFree)}
            className="flex items-center gap-1 rounded-full px-3 py-2 text-[11px] font-semibold transition-all active:scale-95"
            style={{
              background: isFree ? "linear-gradient(135deg, #34c77b, #2da85c)" : "rgba(0,0,0,0.06)",
              color: isFree ? "white" : "var(--muted)",
              boxShadow: isFree ? "0 2px 8px rgba(52,199,123,0.3)" : "none",
            }}
          >
            <span className="text-[12px]">{isFree ? "🟢" : "⚪"}</span>
            今ひま
          </button>

          {/* Post button */}
          <Link
            href="/square/new"
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition-transform active:scale-95"
            style={{ background: "var(--gradient-main)" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            投稿
          </Link>
        </div>
      </div>

      {/* ── Bottom sheet ── */}
      {selected && <VisitorSheet visitor={selected} onClose={() => setSelected(null)} />}

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
        @keyframes emoteFloat {
          0% { transform: translate(-50%, -100%) scale(0.5); opacity: 1; }
          30% { transform: translate(-50%, -180%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -280%) scale(0.8); opacity: 0; }
        }
        @keyframes rainDrop {
          0% { transform: translateY(-10vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes windowFlicker {
          0%, 100% { opacity: 0.3; }
          30% { opacity: 0.7; }
          50% { opacity: 0.4; }
          70% { opacity: 0.8; }
        }
        @keyframes avatarLandingShadow {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.2); opacity: 1; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
