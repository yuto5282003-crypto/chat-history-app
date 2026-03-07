"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Avatar3D = dynamic(() => import("@/components/square/Avatar3D"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent" style={{ borderColor: "var(--accent)" }} />
    </div>
  ),
});

/* ── Avatar catalog ── */
type AvatarItem = {
  id: string;
  name: string;
  modelUrl: string;
  gender: "female" | "male";
};

const AVATAR_CATALOG: AvatarItem[] = [
  { id: "f-001", name: "アバター 1", modelUrl: "/api/model-proxy?id=1Ov9wTWnjDuT_Uxv9ZzCuzNN-CsvB36j_", gender: "female" },
  { id: "f-002", name: "アバター 2", modelUrl: "/api/model-proxy?id=1_4Zz2DqKXTXH0WjSfBqyDpa18_2DvWiQ", gender: "female" },
  { id: "f-003", name: "アバター 3", modelUrl: "/api/model-proxy?id=13AHSMGJJQiK_y5zJYvmSd72hXyN4fAXu", gender: "female" },
  { id: "f-004", name: "アバター 4", modelUrl: "/api/model-proxy?id=1vNzQX_exuRrf2NscqIZYydaACaAt0uGj", gender: "female" },
  { id: "f-005", name: "アバター 5", modelUrl: "/api/model-proxy?id=1Vy5TUp1iODbnNS0ixu_vWHC3Ex4mQel5", gender: "female" },
  { id: "f-006", name: "アバター 6", modelUrl: "/api/model-proxy?id=14sUdfRO4M2gfZrTQ8WbRukZfGZGHYIH1", gender: "female" },
  { id: "f-007", name: "アバター 7", modelUrl: "/api/model-proxy?id=1VJ2HXqWrGcKmnzrOkME3tqzHyeLf7htf", gender: "female" },
];

const GENDER_TABS = [
  { key: "female" as const, label: "女性", icon: "👩" },
  { key: "male" as const, label: "男性", icon: "👨" },
];

const STORAGE_KEY = "sloty_selected_avatar";

export default function AvatarSelectPage() {
  const router = useRouter();
  const [gender, setGender] = useState<"female" | "male">("female");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentModelUrl, setCurrentModelUrl] = useState<string | null>(null);

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

      {/* Preview area */}
      <div
        className="flex flex-col items-center rounded-2xl py-6 mb-4 relative"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
      >
        {selectedAvatar ? (
          <>
            <Avatar3D
              modelUrl={selectedAvatar.modelUrl}
              size={160}
              autoRotate
              animationSpeed={0.8}
            />
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
                <Avatar3D
                  modelUrl={avatar.modelUrl}
                  size={110}
                  autoRotate={isSelected}
                  animationSpeed={0.6}
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

      {/* Save button */}
      <div className="mt-4 sticky bottom-4">
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
