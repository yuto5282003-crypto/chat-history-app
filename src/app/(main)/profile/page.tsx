"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { getTicketBalance, getTicketLedger, addTicketEntry } from "@/lib/demo-store";
import { DEMO_USER } from "@/lib/demo-data";

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [tickets, setTickets] = useState(18);
  const [ledger, setLedger] = useState<{ delta: number; reason: string; createdAt: string }[]>([]);

  useEffect(() => {
    setMounted(true);
    setTickets(getTicketBalance());
    setLedger(getTicketLedger());
  }, []);

  function handleCharge() {
    addTicketEntry(10, "開発用チャージ（+10）");
    setTickets(getTicketBalance());
    setLedger(getTicketLedger());
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">設定</h1>

      <div className="mt-4 card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold"
            style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-soft-text)" }}>
            {DEMO_USER.displayName[0]}
          </div>
          <div>
            <p className="font-semibold">{DEMO_USER.displayName}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>{DEMO_USER.email}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
          <span className="text-sm">🎫 チケット残高</span>
          <span className="text-lg font-bold" style={{ color: "var(--accent)" }}>{tickets}枚</span>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>表示</h2>
          <div className="mt-2">
            <div className="flex items-center justify-between rounded-xl p-3 text-sm">
              <span>ダークモード</span>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{ backgroundColor: theme === "dark" ? "var(--accent)" : "#d1d5db" }}
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    style={{ transform: theme === "dark" ? "translateX(1.375rem)" : "translateX(0.25rem)" }} />
                </button>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>チケット</h2>
          <button onClick={handleCharge} className="btn-primary mt-2 w-full text-sm">🎫 +10 チャージ（開発用）</button>
          <div className="mt-3 card p-3 space-y-2">
            <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>最近の履歴</p>
            {ledger.slice(0, 6).map((entry, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span>{entry.reason}</span>
                <span className="font-semibold" style={{ color: entry.delta > 0 ? "var(--success)" : "var(--danger)" }}>
                  {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 rounded-xl p-3 text-xs" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-soft-text)" }}>
            <p className="font-semibold">消費ルール:</p>
            <ul className="mt-1 space-y-0.5 list-disc pl-4">
              <li>広場投稿: 2🎫</li>
              <li>時間共有依頼: 5🎫（拒否時2🎫返金）</li>
              <li>スロット出品: 無料</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>その他</h2>
          <div className="mt-2 space-y-1">
            <SettingsRow label="依頼受信箱" href="/requests/inbox" />
            <SettingsRow label="非公開予定管理" href="/friends/events" />
            <SettingsRow label="利用規約" href="/profile" />
            <SettingsRow label="ヘルプ" href="/profile" />
          </div>
        </section>
      </div>
    </div>
  );
}

function SettingsRow({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-xl p-3 text-sm transition-colors hover:opacity-80">
      <span>{label}</span>
      <span style={{ color: "var(--muted)" }}>→</span>
    </Link>
  );
}
