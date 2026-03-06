"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AvatarFigure from "@/components/square/AvatarFigure";
import {
  HAIR_STYLE_NAMES, HAIR_COLORS, SKIN_TONES, TOP_COLORS,
  BOTTOM_COLORS, ACCESSORY_NAMES, EXPRESSION_NAMES,
} from "@/lib/demo-data";
import type { AvatarStyle } from "@/lib/demo-data";

type Category = "hair" | "hairColor" | "skin" | "top" | "bottom" | "accessory" | "expression";

const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: "hair", label: "髪型", icon: "💇" },
  { key: "hairColor", label: "髪色", icon: "🎨" },
  { key: "skin", label: "肌", icon: "✋" },
  { key: "top", label: "トップス", icon: "👕" },
  { key: "bottom", label: "ボトムス", icon: "👖" },
  { key: "accessory", label: "アクセ", icon: "🕶️" },
  { key: "expression", label: "表情", icon: "😊" },
];

const DEFAULT_STYLE: AvatarStyle = {
  hairStyle: 0, hairColor: "#2C2C2C", skinTone: "#FFDBB4",
  topColor: "#7B8CFF", bottomColor: "#3A3A5E", accessory: 0, expression: 1,
};

export default function CustomizePage() {
  const router = useRouter();
  const [style, setStyle] = useState<AvatarStyle>(DEFAULT_STYLE);
  const [activeCategory, setActiveCategory] = useState<Category>("hair");

  // Load saved style
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sloty_avatar_style");
      if (saved) setStyle(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const update = (partial: Partial<AvatarStyle>) => setStyle((s) => ({ ...s, ...partial }));

  const save = () => {
    localStorage.setItem("sloty_avatar_style", JSON.stringify(style));
    router.back();
  };

  return (
    <div className="px-5 pt-3 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: "var(--accent-soft)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-soft-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-lg font-bold">着せ替え</h1>
      </div>

      {/* Preview */}
      <div className="flex flex-col items-center rounded-2xl py-8" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <AvatarFigure style={style} size={120} animate="idle" />
        <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>プレビュー</p>
      </div>

      {/* AI suggestion banner */}
      <div className="mt-4 rounded-xl px-4 py-3" style={{ backgroundColor: "var(--accent-soft)", border: "1px solid rgba(123,140,255,0.15)" }}>
        <p className="text-xs font-medium" style={{ color: "var(--accent-soft-text)" }}>
          📸 写真からAIおすすめ作成
        </p>
        <p className="mt-0.5 text-[10px]" style={{ color: "var(--muted)" }}>
          写真をアップロードすると、雰囲気に合ったアバターを自動提案します（任意）
        </p>
        <button className="mt-2 rounded-lg px-3 py-1.5 text-[11px] font-medium" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          写真から作成（準備中）
        </button>
      </div>

      {/* Category tabs */}
      <div data-no-swipe className="mt-5 flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all"
            style={{
              backgroundColor: activeCategory === cat.key ? "var(--accent)" : "var(--card)",
              color: activeCategory === cat.key ? "#fff" : "var(--text)",
              border: activeCategory === cat.key ? "none" : "1px solid var(--border)",
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Options for active category */}
      <div className="mt-4 rounded-2xl p-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        {activeCategory === "hair" && (
          <div className="grid grid-cols-3 gap-2">
            {HAIR_STYLE_NAMES.map((name, i) => (
              <button
                key={i}
                onClick={() => update({ hairStyle: i })}
                className="flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all"
                style={{
                  backgroundColor: style.hairStyle === i ? "var(--accent-soft)" : "var(--bg)",
                  border: style.hairStyle === i ? "2px solid var(--accent)" : "1px solid var(--border)",
                }}
              >
                <AvatarFigure style={{ ...style, hairStyle: i }} size={40} />
                <span className="text-[10px]">{name}</span>
              </button>
            ))}
          </div>
        )}

        {activeCategory === "hairColor" && (
          <div className="flex flex-wrap gap-3">
            {HAIR_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => update({ hairColor: c })}
                className="h-10 w-10 rounded-full transition-all"
                style={{
                  backgroundColor: c,
                  border: style.hairColor === c ? "3px solid var(--accent)" : "2px solid var(--border)",
                  boxShadow: style.hairColor === c ? "0 0 0 2px var(--card)" : "none",
                }}
              />
            ))}
          </div>
        )}

        {activeCategory === "skin" && (
          <div className="flex flex-wrap gap-3">
            {SKIN_TONES.map((c) => (
              <button
                key={c}
                onClick={() => update({ skinTone: c })}
                className="h-10 w-10 rounded-full transition-all"
                style={{
                  backgroundColor: c,
                  border: style.skinTone === c ? "3px solid var(--accent)" : "2px solid var(--border)",
                  boxShadow: style.skinTone === c ? "0 0 0 2px var(--card)" : "none",
                }}
              />
            ))}
          </div>
        )}

        {activeCategory === "top" && (
          <div className="flex flex-wrap gap-3">
            {TOP_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => update({ topColor: c })}
                className="h-10 w-10 rounded-full transition-all"
                style={{
                  backgroundColor: c,
                  border: style.topColor === c ? "3px solid var(--accent)" : "2px solid var(--border)",
                  boxShadow: style.topColor === c ? "0 0 0 2px var(--card)" : "none",
                }}
              />
            ))}
          </div>
        )}

        {activeCategory === "bottom" && (
          <div className="flex flex-wrap gap-3">
            {BOTTOM_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => update({ bottomColor: c })}
                className="h-10 w-10 rounded-full transition-all"
                style={{
                  backgroundColor: c,
                  border: style.bottomColor === c ? "3px solid var(--accent)" : "2px solid var(--border)",
                  boxShadow: style.bottomColor === c ? "0 0 0 2px var(--card)" : "none",
                }}
              />
            ))}
          </div>
        )}

        {activeCategory === "accessory" && (
          <div className="grid grid-cols-2 gap-2">
            {ACCESSORY_NAMES.map((name, i) => (
              <button
                key={i}
                onClick={() => update({ accessory: i })}
                className="flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all"
                style={{
                  backgroundColor: style.accessory === i ? "var(--accent-soft)" : "var(--bg)",
                  border: style.accessory === i ? "2px solid var(--accent)" : "1px solid var(--border)",
                }}
              >
                <AvatarFigure style={{ ...style, accessory: i }} size={40} />
                <span className="text-[10px]">{name}</span>
              </button>
            ))}
          </div>
        )}

        {activeCategory === "expression" && (
          <div className="grid grid-cols-2 gap-2">
            {EXPRESSION_NAMES.map((name, i) => (
              <button
                key={i}
                onClick={() => update({ expression: i })}
                className="flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all"
                style={{
                  backgroundColor: style.expression === i ? "var(--accent-soft)" : "var(--bg)",
                  border: style.expression === i ? "2px solid var(--accent)" : "1px solid var(--border)",
                }}
              >
                <AvatarFigure style={{ ...style, expression: i }} size={40} />
                <span className="text-[10px]">{name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <button onClick={save} className="btn-primary mt-6 w-full">
        保存する
      </button>
    </div>
  );
}
