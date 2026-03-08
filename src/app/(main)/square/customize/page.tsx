"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Avatar3D = dynamic(
  () => import("@/components/square/Avatar3D").then((mod) => {
    // Preload the first few popular models for faster preview
    const preloadIds = AVATAR_CATALOG.slice(0, 4);
    preloadIds.forEach((a) => mod.preloadModel(a.modelUrl));
    return mod;
  }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center" style={{ width: 160, height: 160 }}>
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent" style={{ borderColor: "var(--accent)" }} />
      </div>
    ),
  },
);

/* ── Avatar catalog ── */
type AvatarItem = {
  id: string;
  name: string;
  modelUrl: string;
  gender: "female" | "male";
  color: string;
};

/* ── (placeholder generator removed — now using live 3D thumbnails) ── */

const AVATAR_CATALOG: AvatarItem[] = [
  // 女性アバター
  { id: "f-haruka", name: "はるか", modelUrl: "/api/model-proxy?id=1HPLEuAsvSBhGocNN3RIByW8HAM95yMkF", gender: "female", color: "#ec4899" },
  { id: "f-001", name: "ひなた", modelUrl: "/api/model-proxy?id=1Ov9wTWnjDuT_Uxv9ZzCuzNN-CsvB36j_", gender: "female", color: "#f472b6" },
  { id: "f-002", name: "あおい", modelUrl: "/api/model-proxy?id=1_4Zz2DqKXTXH0WjSfBqyDpa18_2DvWiQ", gender: "female", color: "#a78bfa" },
  { id: "f-003", name: "さくら", modelUrl: "/api/model-proxy?id=13AHSMGJJQiK_y5zJYvmSd72hXyN4fAXu", gender: "female", color: "#60a5fa" },
  { id: "f-004", name: "もえ", modelUrl: "/api/model-proxy?id=1vNzQX_exuRrf2NscqIZYydaACaAt0uGj", gender: "female", color: "#34d399" },
  { id: "f-005", name: "ゆい", modelUrl: "/api/model-proxy?id=1Vy5TUp1iODbnNS0ixu_vWHC3Ex4mQel5", gender: "female", color: "#fbbf24" },
  { id: "f-006", name: "りん", modelUrl: "/api/model-proxy?id=14sUdfRO4M2gfZrTQ8WbRukZfGZGHYIH1", gender: "female", color: "#fb923c" },
  { id: "f-007", name: "ことね", modelUrl: "/api/model-proxy?id=1VJ2HXqWrGcKmnzrOkME3tqzHyeLf7htf", gender: "female", color: "#f87171" },
  // 女性アバター（新規）
  { id: "f-008", name: "なな", modelUrl: "/api/model-proxy?id=1WrlLDVaFxwYcTuq_u4MPOgKaFwqmR_KD", gender: "female", color: "#e879f9" },
  { id: "f-009", name: "まゆ", modelUrl: "/api/model-proxy?id=1PK_EU_udFtRgp7y5nIHb4GlI64qEu9Rj", gender: "female", color: "#c084fc" },
  { id: "f-010", name: "しおり", modelUrl: "/api/model-proxy?id=1y3KlQj08LDVhue-yO7x_aimzwRVjI90e", gender: "female", color: "#67e8f9" },
  // 男性アバター
  { id: "m-jibun", name: "自分", modelUrl: "/api/model-proxy?id=11oL9zWREayIqI2Nh3s7-1dpu9EYGvoTp", gender: "male", color: "#667eea" },
  { id: "m-001", name: "たくや", modelUrl: "/api/model-proxy?id=17DOS8dIWcuaveJn2i6bC7uMWWoByZuSo", gender: "male", color: "#60a5fa" },
  { id: "m-002", name: "りょう", modelUrl: "/api/model-proxy?id=19ZNNMNayYT7F9rIVvEi-Mwlh5NwNju8S", gender: "male", color: "#34d399" },
  { id: "m-003", name: "そうた", modelUrl: "/api/model-proxy?id=11zJGTW_nwDEFjHgCQ1xjUCx5aR14GF98", gender: "male", color: "#fbbf24" },
  { id: "m-004", name: "かいと", modelUrl: "/api/model-proxy?id=1Pb2X10mLCFmIEWm3-R7oumbaor_JEHG_", gender: "male", color: "#fb923c" },
  { id: "m-005", name: "ゆうき", modelUrl: "/api/model-proxy?id=1C-WnG6zSvxQHxySQ-V0zwEyXAEgu6cXF", gender: "male", color: "#f87171" },
  { id: "m-006", name: "はると", modelUrl: "/api/model-proxy?id=1CYC2zW5YaKrZOpPbFPgQpWypml0DaEmf", gender: "male", color: "#a78bfa" },
  { id: "m-007", name: "れん", modelUrl: "/api/model-proxy?id=1tusqe8fHJ1kloGLV3-4-aCE7g31K1OkB", gender: "male", color: "#2dd4bf" },
];

const GENDER_TABS = [
  { key: "female" as const, label: "女性", icon: "👩" },
  { key: "male" as const, label: "男性", icon: "👨" },
];

const STORAGE_KEY = "sloty_selected_avatar";

/* ── Avatar thumbnail for grid (uses simple styled card to avoid WebGL context limit) ── */
function AvatarThumbnail({
  avatar,
  isSelected,
}: {
  avatar: AvatarItem;
  isSelected: boolean;
}) {
  return (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{
        width: 90,
        height: 100,
        background: isSelected
          ? `linear-gradient(135deg, ${avatar.color}40, ${avatar.color}20)`
          : `linear-gradient(135deg, ${avatar.color}18, ${avatar.color}08)`,
        transition: "background 0.3s",
      }}
    >
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 56,
            height: 56,
            background: `linear-gradient(135deg, ${avatar.color}50, ${avatar.color}30)`,
            boxShadow: isSelected ? `0 2px 10px ${avatar.color}40` : "none",
            transition: "box-shadow 0.3s",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <span className="text-[10px] font-bold" style={{ color: avatar.color }}>
          {avatar.name}
        </span>
      </div>
    </div>
  );
}

export default function AvatarSelectPage() {
  const router = useRouter();
  const [gender, setGender] = useState<"female" | "male">("female");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentModelUrl, setCurrentModelUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);

  // Load current selection
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCurrentModelUrl(saved);
      const match = AVATAR_CATALOG.find((a) => a.modelUrl === saved);
      if (match) {
        setSelectedId(match.id);
        setGender(match.gender);
      }
    }
  }, []);

  const filteredAvatars = AVATAR_CATALOG.filter((a) => a.gender === gender);
  const selectedAvatar = AVATAR_CATALOG.find((a) => a.id === selectedId);

  const handleSelect = (avatar: AvatarItem) => {
    setSelectedId(avatar.id);
    setPreviewError(false);
  };

  const handleSave = () => {
    if (!selectedAvatar) return;
    localStorage.setItem(STORAGE_KEY, selectedAvatar.modelUrl);
    router.back();
  };

  return (
    <div className="px-5 pt-3 pb-8 flex flex-col" style={{ minHeight: "calc(100vh - 72px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--accent-soft)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-soft-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-lg font-bold">アバター選択</h1>
      </div>

      {/* Preview area — only ONE 3D Canvas here */}
      <div
        className="flex flex-col items-center rounded-2xl py-6 mb-4 relative"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
      >
        {selectedAvatar ? (
          <>
            {previewError ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 64, height: 64,
                    background: `linear-gradient(135deg, ${selectedAvatar.color}, ${selectedAvatar.color}aa)`,
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>3Dプレビューを読み込めませんでした</p>
              </div>
            ) : (
              <div onError={() => setPreviewError(true)}>
                <Avatar3D
                  modelUrl={selectedAvatar.modelUrl}
                  size={160}
                  autoRotate
                  animationSpeed={0.8}
                />
              </div>
            )}
            <p className="mt-2 text-[13px] font-semibold">{selectedAvatar.name}</p>
            {currentModelUrl === selectedAvatar.modelUrl && (
              <span
                className="absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #34c77b, #2da85c)" }}
              >
                使用中
              </span>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-8">
            <span className="text-4xl">👤</span>
            <p className="text-[12px]" style={{ color: "var(--muted)" }}>
              アバターを選んでね
            </p>
          </div>
        )}
      </div>

      {/* Gender tabs */}
      <div className="flex gap-2 mb-4">
        {GENDER_TABS.map((tab) => {
          const count = AVATAR_CATALOG.filter((a) => a.gender === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setGender(tab.key)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold transition-all active:scale-95"
              style={{
                background: gender === tab.key
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "var(--card)",
                color: gender === tab.key ? "white" : "var(--text)",
                border: gender === tab.key ? "none" : "1px solid var(--border)",
                boxShadow: gender === tab.key ? "0 2px 8px rgba(102,126,234,0.3)" : "none",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                style={{
                  backgroundColor: gender === tab.key ? "rgba(255,255,255,0.25)" : "var(--accent-soft)",
                  color: gender === tab.key ? "white" : "var(--accent-soft-text)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Avatar grid */}
      {filteredAvatars.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 flex-1">
          {filteredAvatars.map((avatar) => {
            const isSelected = selectedId === avatar.id;
            const isCurrent = currentModelUrl === avatar.modelUrl;
            return (
              <button
                key={avatar.id}
                onClick={() => handleSelect(avatar)}
                className="flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-all active:scale-95 relative"
                style={{
                  backgroundColor: isSelected ? "var(--accent-soft)" : "var(--card)",
                  border: isSelected ? "2px solid var(--accent)" : "1px solid var(--border)",
                  boxShadow: isSelected ? "0 2px 12px rgba(102,126,234,0.2)" : "none",
                }}
              >
                {isCurrent && (
                  <span
                    className="absolute top-2 right-2 rounded-full px-1.5 py-0.5 text-[8px] font-bold text-white z-10"
                    style={{ background: "linear-gradient(135deg, #34c77b, #2da85c)" }}
                  >
                    使用中
                  </span>
                )}
                <AvatarThumbnail
                  avatar={avatar}
                  isSelected={isSelected}
                />
                <span className="text-[11px] font-medium">{avatar.name}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 rounded-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <span className="text-4xl">🚧</span>
          <p className="text-[13px] font-medium" style={{ color: "var(--muted)" }}>
            準備中...もう少し待ってね！
          </p>
        </div>
      )}

      {/* Hint text */}
      <p className="text-center text-[10px] mt-2 mb-1" style={{ color: "var(--muted)" }}>
        タップで選択 → 上のプレビューで3D確認できるよ
      </p>

      {/* Save button */}
      <div className="mt-2 sticky bottom-4">
        <button
          onClick={handleSave}
          disabled={!selectedAvatar || currentModelUrl === selectedAvatar?.modelUrl}
          className="w-full rounded-xl py-3 text-[14px] font-bold text-white transition-all active:scale-95 disabled:opacity-40 disabled:scale-100"
          style={{
            background: selectedAvatar && currentModelUrl !== selectedAvatar.modelUrl
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "var(--border)",
            boxShadow: selectedAvatar && currentModelUrl !== selectedAvatar.modelUrl
              ? "0 4px 16px rgba(102,126,234,0.4)"
              : "none",
          }}
        >
          {!selectedAvatar
            ? "アバターを選んでね"
            : currentModelUrl === selectedAvatar.modelUrl
            ? "このアバターを使用中"
            : "このアバターに決定！"}
        </button>
      </div>
    </div>
  );
}
