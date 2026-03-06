"use client";

import { useRouter } from "next/navigation";
import AvatarFigure from "./AvatarFigure";
import type { SquareVisitor } from "@/lib/demo-data";

/**
 * VisitorSheet — Bottom sheet shown when tapping an avatar in the plaza.
 * Shows quick profile info + action buttons.
 * Designed to be lightweight — not a full profile.
 */
export default function VisitorSheet({
  visitor,
  onClose,
}: {
  visitor: SquareVisitor;
  onClose: () => void;
}) {
  const router = useRouter();
  const minutesAgo = Math.floor((Date.now() - new Date(visitor.lastActive).getTime()) / 60_000);
  const activeLabel = minutesAgo < 2 ? "今アクティブ" : `${minutesAgo}分前`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Sheet */}
      <div
        className="relative w-full max-w-lg rounded-t-3xl pb-8 pt-3"
        style={{ backgroundColor: "var(--card)" }}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full" style={{ backgroundColor: "var(--border)" }} />

        <div className="px-5">
          {/* Avatar + basic info row */}
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <AvatarFigure style={visitor.avatarStyle} size={64} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold truncate">{visitor.displayName}</p>
                {visitor.verified && (
                  <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold text-white" style={{ backgroundColor: "rgba(52,199,123,0.8)" }}>
                    ✓ 認証
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
                {visitor.gender} &middot; ★{visitor.ratingAvg} ({visitor.ratingCount})
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: minutesAgo < 5 ? "var(--success)" : "var(--muted)" }} />
                <span className="text-[10px]" style={{ color: minutesAgo < 5 ? "var(--success)" : "var(--muted)" }}>{activeLabel}</span>
              </div>
            </div>
          </div>

          {/* Bubble / status message */}
          {visitor.bubble && (
            <div
              className="mt-3 rounded-xl px-3.5 py-2.5"
              style={{ backgroundColor: "var(--accent-soft)" }}
            >
              <p className="text-sm" style={{ color: "var(--accent-soft-text)" }}>
                &ldquo;{visitor.bubble}&rdquo;
              </p>
            </div>
          )}

          {/* Quick info chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <InfoChip
              icon={visitor.mode === "call" ? "📞" : visitor.mode === "in_person" ? "🚶" : "📞🚶"}
              label={visitor.mode === "call" ? "通話" : visitor.mode === "in_person" ? "対面" : "どちらでも"}
            />
            {visitor.availability && <InfoChip icon="⏰" label={visitor.availability} />}
            {visitor.area && <InfoChip icon="📍" label={visitor.area} />}
            {visitor.tags.map((t) => (
              <InfoChip key={t} icon="" label={t} />
            ))}
          </div>

          {/* Bio preview */}
          {visitor.bio && (
            <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              {visitor.bio}
            </p>
          )}

          {/* Action buttons */}
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => router.push(`/square/person/${visitor.userId}`)}
              className="btn-outline flex-1 text-xs !py-2.5"
            >
              詳細を見る
            </button>
            <button
              onClick={() => router.push(`/square/request/${visitor.userId}`)}
              className="btn-primary flex-1 text-xs !py-2.5"
            >
              時間共有を依頼
            </button>
          </div>

          {/* Secondary links */}
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => router.push(`/profile/${visitor.userId}`)}
              className="flex-1 rounded-xl py-2 text-center text-[11px] font-medium"
              style={{ color: "var(--muted)", backgroundColor: "var(--bg)" }}
            >
              プロフィール
            </button>
            <button
              onClick={() => router.push(`/market?seller=${visitor.userId}`)}
              className="flex-1 rounded-xl py-2 text-center text-[11px] font-medium"
              style={{ color: "var(--muted)", backgroundColor: "var(--bg)" }}
            >
              スロット一覧
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-medium"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
}
