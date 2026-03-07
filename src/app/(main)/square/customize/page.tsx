"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { AVATAR_GALLERY } from "@/lib/demo-data";
import type { AvatarGalleryItem } from "@/lib/demo-data";

const GlbAvatarViewer = lazy(() => import("@/components/square/GlbAvatarViewer"));

type GenderFilter = "all" | "male" | "female";

export default function AvatarSelectPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<GenderFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<AvatarGalleryItem | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sloty_selected_avatar");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id) setSelectedId(parsed.id);
      }
    } catch { /* ignore */ }
  }, []);

  const filtered = filter === "all"
    ? AVATAR_GALLERY
    : AVATAR_GALLERY.filter((a) => a.gender === filter);

  const save = (avatar: AvatarGalleryItem) => {
    setSelectedId(avatar.id);
    localStorage.setItem("sloty_selected_avatar", JSON.stringify(avatar));
  };

  const filterButtons: { key: GenderFilter; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "female", label: "女性" },
    { key: "male", label: "男性" },
  ];

  return (
    <div className="px-5 pt-3 pb-8">
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
        <h1 className="text-lg font-bold">アバターを選択</h1>
      </div>

      <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
        使用するアバターを選んでください
      </p>

      {/* Gender filter tabs */}
      <div className="flex gap-2 mb-5">
        {filterButtons.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="rounded-full px-4 py-2 text-[12px] font-semibold transition-all"
            style={{
              backgroundColor: filter === f.key ? "var(--accent)" : "var(--card)",
              color: filter === f.key ? "#fff" : "var(--text)",
              border: filter === f.key ? "none" : "1px solid var(--border)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 3D Preview Modal */}
      {previewAvatar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setPreviewAvatar(null)}
          />
          <div
            className="relative rounded-3xl p-4 w-[90vw] max-w-sm"
            style={{ backgroundColor: "var(--card)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-bold">{previewAvatar.name}</h2>
              <button
                onClick={() => setPreviewAvatar(null)}
                className="text-[20px] leading-none"
                style={{ color: "var(--muted)" }}
              >
                x
              </button>
            </div>
            <div className="flex justify-center">
              <Suspense fallback={
                <div className="flex items-center justify-center" style={{ width: 280, height: 280 }}>
                  <span className="text-sm" style={{ color: "var(--muted)" }}>読み込み中...</span>
                </div>
              }>
                <GlbAvatarViewer
                  glbPath={previewAvatar.glbPath}
                  name={previewAvatar.name}
                  size={280}
                  autoRotate
                />
              </Suspense>
            </div>
            <button
              onClick={() => {
                save(previewAvatar);
                setPreviewAvatar(null);
              }}
              className="mt-4 w-full btn-primary"
            >
              このアバターを使う
            </button>
          </div>
        </div>
      )}

      {/* Avatar grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((avatar) => {
          const isSelected = selectedId === avatar.id;
          const hasGlb = !!avatar.glbPath;
          return (
            <button
              key={avatar.id}
              onClick={() => save(avatar)}
              className="flex flex-col items-center gap-2 rounded-2xl p-4 transition-all active:scale-95"
              style={{
                backgroundColor: isSelected ? "var(--accent-soft)" : "var(--card)",
                border: isSelected ? "2px solid var(--accent)" : "1px solid var(--border)",
              }}
            >
              <div
                className="rounded-2xl p-2 relative"
                style={{ background: "var(--gradient-soft)" }}
              >
                {/* Avatar placeholder circle */}
                <div
                  className="flex items-center justify-center rounded-full text-white font-bold"
                  style={{
                    width: 100,
                    height: 100,
                    background: avatar.gender === "female"
                      ? "linear-gradient(135deg, #f093fb, #f5576c)"
                      : "linear-gradient(135deg, #4facfe, #00f2fe)",
                    fontSize: 40,
                  }}
                >
                  {avatar.name.charAt(0)}
                </div>
                {/* 3D badge */}
                {hasGlb && (
                  <span
                    className="absolute top-1 right-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold text-white"
                    style={{ backgroundColor: "#7B8CFF" }}
                  >
                    3D
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-semibold">{avatar.name}</span>
                <span
                  className="text-[10px] rounded-full px-1.5 py-0.5 font-medium"
                  style={{
                    backgroundColor: avatar.gender === "female" ? "rgba(248,164,200,0.2)" : "rgba(79,172,254,0.2)",
                    color: avatar.gender === "female" ? "#e84393" : "#0984e3",
                  }}
                >
                  {avatar.gender === "female" ? "女性" : "男性"}
                </span>
              </div>
              {/* Preview button for 3D models */}
              {hasGlb && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewAvatar(avatar);
                  }}
                  className="text-[10px] font-medium rounded-full px-2.5 py-1 transition-all"
                  style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-soft-text)" }}
                >
                  3Dプレビュー
                </button>
              )}
              {isSelected && (
                <span
                  className="text-[10px] font-semibold rounded-full px-2 py-0.5"
                  style={{ backgroundColor: "var(--accent)", color: "#fff" }}
                >
                  使用中
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[13px] py-8" style={{ color: "var(--muted)" }}>
          該当するアバターがありません
        </p>
      )}

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mt-6 w-full btn-primary"
      >
        戻る
      </button>
    </div>
  );
}
