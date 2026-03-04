"use client";

import { useState, useEffect } from "react";
import {
  getAdminSession, setAdminSession, clearAdminSession, addAdminAudit, getAdminAuditLog,
  getKycRequests, updateKycRequest, addKycAudit, getKycAuditLog, runKycAiScoring, getKycAssetsMeta,
  getUsers, updateUser, banUser, unbanUser, forcePasswordReset,
  getReports, getRooms, getMessages, getMedia, getCallLogs,
  getTicketLedger, getTicketBalance,
} from "@/lib/demo-store";
import type {
  AdminAuditEntry, KycRequest, KycAuditEntry, KycAssetMeta,
  DemoUser, DemoReport, DemoRoom, DemoMessage, DemoMedia, TicketEntry,
} from "@/lib/demo-store";

const ADMIN_TABS = ["KYC", "Users", "Reports", "Sessions", "Messages", "Tickets", "Audit Logs"] as const;
type AdminTab = typeof ADMIN_TABS[number];

const STATUS_LABELS: Record<string, string> = {
  none: "未申請", pending_ai: "AI判定中", pending_review: "レビュー待ち",
  approved: "承認済み", rejected: "却下", resubmit_required: "再提出要求",
};
const STATUS_COLORS: Record<string, string> = {
  pending_ai: "#f59e0b", pending_review: "#3b82f6", approved: "#22c55e",
  rejected: "#ef4444", resubmit_required: "#f97316",
};

// Demo passcode (in production would be server-side)
const DEMO_PASSCODE = "sloty2024";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<AdminTab>("KYC");

  useEffect(() => {
    const session = getAdminSession();
    if (session.authenticated) setAuthed(true);
  }, []);

  function handleLogin() {
    if (passcode === DEMO_PASSCODE) {
      setAdminSession();
      addAdminAudit("ADMIN_LOGIN", "session", "owner", "管理画面ログイン");
      setAuthed(true);
      setError("");
    } else {
      setError("パスコードが正しくありません");
    }
  }

  function handleLogout() {
    clearAdminSession();
    addAdminAudit("ADMIN_LOGOUT", "session", "owner", "管理画面ログアウト");
    setAuthed(false);
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm p-6 mt-20">
        <div className="card p-6 text-center">
          <p className="text-3xl">🔐</p>
          <h1 className="mt-2 text-lg font-bold">管理画面ログイン</h1>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Owner専用：Admin Passcode を入力</p>
          <input type="password" className="input mt-4" placeholder="パスコード" value={passcode}
            onChange={e => setPasscode(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
          {error && <p className="mt-1 text-xs" style={{ color: "var(--danger)" }}>{error}</p>}
          <button onClick={handleLogin} className="btn-primary w-full mt-3 text-sm">ログイン</button>
          <p className="mt-3 text-[10px]" style={{ color: "var(--muted)" }}>デモ用パスコード: sloty2024</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">管理画面</h1>
        <div className="flex items-center gap-2">
          <a href="/profile" className="text-xs" style={{ color: "var(--accent)" }}>← アプリ</a>
          <button onClick={handleLogout} className="text-xs px-2 py-1 rounded" style={{ color: "var(--danger)" }}>ログアウト</button>
        </div>
      </div>
      <p className="text-[10px]" style={{ color: "var(--muted)" }}>Owner: demo@sloty.app / セッション30分</p>

      {/* Tabs */}
      <div className="mt-4 flex gap-1 overflow-x-auto pb-1" style={{ borderBottom: "1px solid var(--border)" }}>
        {ADMIN_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="shrink-0 px-3 py-2 text-xs font-medium transition-colors"
            style={{ color: tab === t ? "var(--accent)" : "var(--muted)", borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent" }}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "KYC" && <AdminKyc />}
        {tab === "Users" && <AdminUsers />}
        {tab === "Reports" && <AdminReports />}
        {tab === "Sessions" && <AdminSessions />}
        {tab === "Messages" && <AdminMessages />}
        {tab === "Tickets" && <AdminTickets />}
        {tab === "Audit Logs" && <AdminAuditLogs />}
      </div>
    </div>
  );
}

// ===== KYC Tab =====
function AdminKyc() {
  const [requests, setRequests] = useState<KycRequest[]>([]);
  const [auditLog, setAuditLog] = useState<KycAuditEntry[]>([]);
  const [selected, setSelected] = useState<KycRequest | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [viewReason, setViewReason] = useState("");
  const [showAssets, setShowAssets] = useState(false);
  const [assets, setAssets] = useState<KycAssetMeta[]>([]);

  useEffect(() => { refresh(); }, []);
  function refresh() { setRequests(getKycRequests()); setAuditLog(getKycAuditLog()); }

  function handleViewAssets(req: KycRequest) {
    if (!viewReason.trim()) { alert("閲覧理由を入力してください"); return; }
    addAdminAudit("VIEW_KYC_ASSET", "kyc", req.id, viewReason);
    setAssets(getKycAssetsMeta(req.id));
    setShowAssets(true);
    refresh();
  }
  function handleApprove(req: KycRequest) {
    if (!reviewNote.trim()) { alert("理由を入力してください"); return; }
    updateKycRequest(req.id, { status: "approved", reviewerNote: reviewNote });
    addKycAudit(req.id, "approved", "owner", reviewNote);
    addAdminAudit("APPROVE_KYC", "kyc", req.id, reviewNote);
    setSelected(null); setReviewNote(""); refresh();
  }
  function handleReject(req: KycRequest) {
    if (!reviewNote.trim()) { alert("理由を入力してください"); return; }
    updateKycRequest(req.id, { status: "rejected", reviewerNote: reviewNote });
    addKycAudit(req.id, "rejected", "owner", reviewNote);
    addAdminAudit("REJECT_KYC", "kyc", req.id, reviewNote);
    setSelected(null); setReviewNote(""); refresh();
  }
  function handleResubmit(req: KycRequest) {
    if (!reviewNote.trim()) { alert("理由を入力してください"); return; }
    updateKycRequest(req.id, { status: "resubmit_required", reviewerNote: reviewNote });
    addKycAudit(req.id, "resubmit_required", "owner", reviewNote);
    addAdminAudit("RESUBMIT_KYC", "kyc", req.id, reviewNote);
    setSelected(null); setReviewNote(""); refresh();
  }
  function handleRunAi(req: KycRequest) {
    runKycAiScoring(req.id);
    refresh();
  }

  return (
    <div>
      <h2 className="text-sm font-semibold">KYC審査キュー</h2>
      <div className="mt-3 space-y-3">
        {requests.length === 0 && <p className="text-sm" style={{ color: "var(--muted)" }}>審査待ちの申請はありません</p>}
        {requests.map(req => (
          <div key={req.id} className="card p-4 cursor-pointer" onClick={() => { setSelected(req); setReviewNote(""); setShowAssets(false); setViewReason(""); }}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-sm">{req.displayName}</span>
                <span className="ml-2 text-xs" style={{ color: "var(--muted)" }}>Lv{req.level}</span>
              </div>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ backgroundColor: `${STATUS_COLORS[req.status] ?? "#999"}20`, color: STATUS_COLORS[req.status] ?? "#999" }}>
                {STATUS_LABELS[req.status]}
              </span>
            </div>
            {req.aiScore !== null && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--muted)" }}>AI:</span>
                <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                  <div className="h-2 rounded-full" style={{ width: `${req.aiScore}%`, backgroundColor: req.aiScore >= 80 ? "var(--success)" : "#f59e0b" }} />
                </div>
                <span className="text-xs font-medium">{req.aiScore}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md rounded-2xl p-5 max-h-[80vh] overflow-y-auto" style={{ backgroundColor: "var(--card)" }}>
            <h3 className="text-lg font-bold">{selected.displayName} — Lv{selected.level}</h3>
            <p className="text-xs" style={{ color: "var(--muted)" }}>ステータス: {STATUS_LABELS[selected.status]}</p>
            {selected.aiScore !== null && <p className="text-xs" style={{ color: "var(--muted)" }}>AI スコア: {selected.aiScore}</p>}

            {selected.status === "pending_ai" && (
              <button onClick={() => { handleRunAi(selected); setSelected(getKycRequests().find(r => r.id === selected.id) ?? null); }} className="btn-primary w-full mt-3 text-sm">AI判定を実行</button>
            )}

            {/* KYC asset viewing with reason */}
            <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}>
              <p className="text-xs font-medium">提出書類の閲覧（理由必須）</p>
              <input className="input mt-1 text-xs" placeholder="閲覧理由（例：本人確認審査）" value={viewReason} onChange={e => setViewReason(e.target.value)} />
              <button onClick={() => handleViewAssets(selected)} className="btn-outline w-full mt-1 text-[10px]">提出書類を確認</button>
              {showAssets && (
                <div className="mt-2 space-y-1">
                  {assets.length === 0 && <p className="text-[10px]" style={{ color: "var(--muted)" }}>メタデータなし</p>}
                  {assets.map(a => (
                    <div key={a.id} className="flex items-center gap-2 text-[10px] p-2 rounded" style={{ backgroundColor: "var(--accent-soft)" }}>
                      <span>📄 {a.assetType}</span>
                      <span className="flex-1 truncate" style={{ color: "var(--muted)" }}>{a.objectKey}</span>
                      <span className="text-[9px]" style={{ color: "var(--muted)" }}>
                        {/* Watermark simulation */}
                        <span className="bg-black/10 px-1 rounded">SLOTY MODERATION</span>
                      </span>
                    </div>
                  ))}
                  <p className="text-[9px]" style={{ color: "var(--muted)" }}>※ 画像はウォーターマーク付き一時表示。DL禁止。</p>
                </div>
              )}
            </div>

            {(selected.status === "pending_review" || selected.status === "pending_ai") && (
              <>
                <div className="mt-3">
                  <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>審査メモ（理由必須）</label>
                  <input className="input mt-1" placeholder="理由を入力" value={reviewNote} onChange={e => setReviewNote(e.target.value)} />
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleReject(selected)} className="btn-outline flex-1 text-xs" style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>却下</button>
                  <button onClick={() => handleResubmit(selected)} className="btn-outline flex-1 text-xs" style={{ color: "#f97316", borderColor: "#f97316" }}>再提出</button>
                  <button onClick={() => handleApprove(selected)} className="btn-primary flex-1 text-xs">承認</button>
                </div>
              </>
            )}
            <button onClick={() => setSelected(null)} className="btn-outline w-full mt-3 text-sm">閉じる</button>
          </div>
        </div>
      )}

      {/* KYC Audit */}
      <div className="mt-6">
        <h3 className="text-xs font-semibold" style={{ color: "var(--muted)" }}>KYC監査ログ</h3>
        <div className="mt-2 space-y-1">
          {auditLog.slice(0, 20).map(entry => (
            <div key={entry.id} className="flex items-center gap-2 text-[10px] py-1" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="shrink-0" style={{ color: "var(--muted)" }}>{new Date(entry.createdAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}</span>
              <span className="font-medium">{entry.actor}</span>
              <span style={{ color: "var(--muted)" }}>{entry.action}</span>
              <span className="truncate flex-1">{entry.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== Users Tab =====
function AdminUsers() {
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [selected, setSelected] = useState<DemoUser | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => { setUsers(getUsers()); }, []);

  function handleBan(u: DemoUser) {
    addAdminAudit("BAN_USER", "user", u.id, note || "BAN処理");
    banUser(u.id);
    setUsers(getUsers()); setSelected(null);
  }
  function handleUnban(u: DemoUser) {
    addAdminAudit("UNBAN_USER", "user", u.id, note || "BAN解除");
    unbanUser(u.id);
    setUsers(getUsers()); setSelected(null);
  }
  function handleForceReset(u: DemoUser) {
    addAdminAudit("FORCE_PASSWORD_RESET", "user", u.id, note || "強制パスワードリセット");
    forcePasswordReset(u.id);
    setUsers(getUsers()); setSelected(null);
  }
  function handleSaveNote(u: DemoUser) {
    updateUser(u.id, { adminNote: note });
    setUsers(getUsers());
  }

  return (
    <div>
      <h2 className="text-sm font-semibold">ユーザー管理</h2>
      <p className="text-[10px]" style={{ color: "var(--muted)" }}>パスワード平文の閲覧は禁止（ハッシュ化保存前提）</p>
      <div className="mt-3 space-y-2">
        {users.map(u => (
          <div key={u.id} className="card p-3 cursor-pointer" onClick={() => { setSelected(u); setNote(u.adminNote); }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{u.displayName}</span>
                <span className="text-[10px] px-1 rounded" style={{ backgroundColor: u.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: u.status === "active" ? "var(--success)" : "var(--danger)" }}>
                  {u.status}
                </span>
              </div>
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>Lv{u.kycLevel}</span>
            </div>
            <div className="mt-1 text-[10px]" style={{ color: "var(--muted)" }}>
              <span>{u.loginEmail}</span> / <span>{u.loginProvider}</span> / <span>通報{u.reportCount}件</span>
              {u.forceResetFlag && <span className="ml-1" style={{ color: "var(--danger)" }}>※PW強制リセット済</span>}
            </div>
          </div>
        ))}
      </div>

      {/* User detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md rounded-2xl p-5" style={{ backgroundColor: "var(--card)" }}>
            <h3 className="text-lg font-bold">{selected.displayName}</h3>
            <div className="mt-2 space-y-1 text-xs" style={{ color: "var(--muted)" }}>
              <p>ID: {selected.id}</p>
              <p>Email: {selected.loginEmail}</p>
              <p>ログイン方式: {selected.loginProvider}</p>
              <p>KYCレベル: Lv{selected.kycLevel}</p>
              <p>通報回数: {selected.reportCount}</p>
              <p>最終アクティブ: {new Date(selected.lastActiveAt).toLocaleString("ja-JP")}</p>
              <p>状態: {selected.status}</p>
              {selected.forceResetFlag && <p style={{ color: "var(--danger)" }}>※ パスワード強制リセット済み</p>}
              <p className="text-[10px] italic">※ パスワードの平文閲覧は不可（仕様）</p>
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>管理者メモ</label>
              <input className="input mt-1 text-xs" value={note} onChange={e => setNote(e.target.value)} placeholder="メモ（保存可）" />
              <button onClick={() => handleSaveNote(selected)} className="btn-outline w-full mt-1 text-[10px]">メモ保存</button>
            </div>
            <div className="mt-3 flex gap-2">
              {selected.status === "active" ? (
                <button onClick={() => handleBan(selected)} className="btn-outline flex-1 text-xs" style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>BAN</button>
              ) : (
                <button onClick={() => handleUnban(selected)} className="btn-outline flex-1 text-xs" style={{ color: "var(--success)", borderColor: "var(--success)" }}>BAN解除</button>
              )}
              <button onClick={() => handleForceReset(selected)} className="btn-outline flex-1 text-xs" style={{ color: "#f59e0b", borderColor: "#f59e0b" }}>強制PWリセット</button>
            </div>
            <button onClick={() => setSelected(null)} className="btn-outline w-full mt-3 text-sm">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Reports Tab =====
function AdminReports() {
  const [reports, setReports] = useState<DemoReport[]>([]);
  useEffect(() => { setReports(getReports()); }, []);

  return (
    <div>
      <h2 className="text-sm font-semibold">通報一覧</h2>
      <div className="mt-3 space-y-2">
        {reports.length === 0 && <p className="text-sm" style={{ color: "var(--muted)" }}>通報はありません</p>}
        {reports.map(r => (
          <div key={r.id} className="card p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">通報 #{r.id.slice(-4)}</span>
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>{new Date(r.createdAt).toLocaleString("ja-JP")}</span>
            </div>
            <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              <p>Room: {r.roomId} / 対象: {r.targetId}</p>
              <p>理由: {r.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Sessions Tab =====
function AdminSessions() {
  const [rooms, setRooms] = useState<DemoRoom[]>([]);
  useEffect(() => { setRooms(getRooms()); }, []);

  return (
    <div>
      <h2 className="text-sm font-semibold">セッション一覧（成立/通話/対面）</h2>
      <div className="mt-3 space-y-2">
        {rooms.length === 0 && <p className="text-sm" style={{ color: "var(--muted)" }}>セッションはありません</p>}
        {rooms.map(r => {
          const calls = getCallLogs(r.id);
          return (
            <div key={r.id} className="card p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{r.participants.map(p => p.displayName).join(" / ")}</span>
                <span className="text-[10px]" style={{ color: r.extended ? "var(--accent)" : "var(--muted)" }}>{r.extended ? "延長済" : ""}</span>
              </div>
              <div className="mt-1 text-[10px]" style={{ color: "var(--muted)" }}>
                <p>{new Date(r.startAt).toLocaleString("ja-JP")} 〜 {new Date(r.endAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}</p>
                <p>通話回数: {calls.length}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== Messages Tab (moderation) =====
function AdminMessages() {
  const [reports, setReportsState] = useState<DemoReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<DemoReport | null>(null);
  const [viewReason, setViewReason] = useState("");
  const [messages, setMessagesState] = useState<DemoMessage[]>([]);
  const [media, setMediaState] = useState<DemoMedia[]>([]);
  const [breakGlass, setBreakGlass] = useState(false);
  const [breakGlassRoomId, setBreakGlassRoomId] = useState("");
  const [breakGlassReason, setBreakGlassReason] = useState("");

  useEffect(() => { setReportsState(getReports()); }, []);

  function handleViewMessages(rpt: DemoReport) {
    if (!viewReason.trim()) { alert("閲覧理由を入力してください（必須）"); return; }
    addAdminAudit("VIEW_CHAT_LOG", "room", rpt.roomId, `通報 #${rpt.id.slice(-4)} - ${viewReason}`);
    const msgs = getMessages(rpt.roomId).slice(-200); // Direct 200 limit
    setMessagesState(msgs);
    addAdminAudit("VIEW_MEDIA_LOG", "room", rpt.roomId, viewReason);
    setMediaState(getMedia(rpt.roomId));
  }

  function handleBreakGlassView() {
    if (!breakGlassReason.trim()) { alert("緊急閲覧理由を入力してください（必須）"); return; }
    if (!breakGlassRoomId.trim()) { alert("Room IDを入力してください"); return; }
    addAdminAudit("VIEW_CHAT_LOG", "room", breakGlassRoomId, `[BREAK-GLASS] ${breakGlassReason}`);
    const msgs = getMessages(breakGlassRoomId).slice(-200);
    setMessagesState(msgs);
    setMediaState(getMedia(breakGlassRoomId));
    setSelectedReport(null);
  }

  // Mask external contacts in admin view too
  const CONTACT_RE = /(\d{3}[-\s]?\d{4}[-\s]?\d{4}|@[a-zA-Z0-9_.]+|LINE|カカオ|instagram|twitter|discord)/gi;
  function maskText(text: string): string {
    return text.replace(CONTACT_RE, "***MASKED***");
  }

  return (
    <div>
      <h2 className="text-sm font-semibold">メッセージ閲覧（運営用）</h2>
      <p className="text-[10px]" style={{ color: "var(--muted)" }}>原則: reportId紐付けのみ / break-glass: 理由必須+監査ログ / 200件上限</p>
      <p className="text-[10px]" style={{ color: "var(--danger)" }}>一括DL・エクスポート禁止</p>

      {/* Report-linked viewing */}
      <div className="mt-3 space-y-2">
        {reports.map(rpt => (
          <div key={rpt.id} className="card p-3 cursor-pointer" onClick={() => { setSelectedReport(rpt); setViewReason(""); setMessagesState([]); setMediaState([]); }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">通報 #{rpt.id.slice(-4)} → Room: {rpt.roomId.slice(-6)}</span>
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>{new Date(rpt.createdAt).toLocaleDateString("ja-JP")}</span>
            </div>
            <p className="text-[10px]" style={{ color: "var(--muted)" }}>{rpt.reason}</p>
          </div>
        ))}
        {reports.length === 0 && <p className="text-xs" style={{ color: "var(--muted)" }}>通報なし</p>}
      </div>

      {/* Break glass */}
      <div className="mt-4 p-3 rounded-xl" style={{ border: "1px dashed var(--danger)" }}>
        <p className="text-xs font-medium" style={{ color: "var(--danger)" }}>🚨 緊急閲覧（Break Glass）</p>
        <p className="text-[10px]" style={{ color: "var(--muted)" }}>通報外の会話を閲覧。監査ログに記録されます。</p>
        <button onClick={() => setBreakGlass(!breakGlass)} className="btn-outline w-full mt-2 text-[10px]" style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>
          {breakGlass ? "閉じる" : "Break Glass を開く"}
        </button>
        {breakGlass && (
          <div className="mt-2 space-y-1">
            <input className="input text-xs" placeholder="Room ID (例: room-1234)" value={breakGlassRoomId} onChange={e => setBreakGlassRoomId(e.target.value)} />
            <input className="input text-xs" placeholder="緊急閲覧理由（必須）" value={breakGlassReason} onChange={e => setBreakGlassReason(e.target.value)} />
            <button onClick={handleBreakGlassView} className="btn-primary w-full text-xs">閲覧する</button>
          </div>
        )}
      </div>

      {/* Report detail + messages */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedReport(null)} />
          <div className="relative w-full max-w-lg rounded-2xl p-5 max-h-[80vh] overflow-y-auto" style={{ backgroundColor: "var(--card)" }}>
            <h3 className="text-sm font-bold">通報 #{selectedReport.id.slice(-4)} のチャット</h3>
            <div className="mt-2">
              <input className="input text-xs" placeholder="閲覧理由（必須）" value={viewReason} onChange={e => setViewReason(e.target.value)} />
              <button onClick={() => handleViewMessages(selectedReport)} className="btn-primary w-full mt-1 text-xs">閲覧する</button>
            </div>

            {messages.length > 0 && (
              <div className="mt-3 space-y-1 max-h-60 overflow-y-auto">
                {messages.map(m => (
                  <div key={m.id} className="text-[10px] p-1.5 rounded" style={{ backgroundColor: "var(--bg)" }}>
                    <span className="font-medium">{m.senderName}</span>
                    <span className="ml-1" style={{ color: "var(--muted)" }}>{new Date(m.createdAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}</span>
                    <p className="mt-0.5" style={{ color: m.masked ? "var(--danger)" : undefined }}>{maskText(m.text)}</p>
                  </div>
                ))}
              </div>
            )}

            {media.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>画像送信履歴（ウォーターマーク付き / DL禁止）</p>
                <div className="mt-1 space-y-1">
                  {media.map(m => (
                    <div key={m.id} className="text-[10px] p-2 rounded relative" style={{ backgroundColor: "var(--bg)" }}>
                      <span>{m.senderName} — {new Date(m.createdAt).toLocaleTimeString("ja-JP")}</span>
                      <div className="mt-1 relative h-16 w-16 rounded bg-gray-200 flex items-center justify-center">
                        <span>🖼️</span>
                        <span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold text-black/20 rotate-[-20deg]">SLOTY MODERATION {new Date().toISOString().slice(0, 10)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setSelectedReport(null)} className="btn-outline w-full mt-3 text-sm">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Tickets Tab =====
function AdminTickets() {
  const [ledger, setLedger] = useState<TicketEntry[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => { setLedger(getTicketLedger()); setBalance(getTicketBalance()); }, []);

  return (
    <div>
      <h2 className="text-sm font-semibold">チケット台帳</h2>
      <p className="mt-1 text-xs">現在の残高: <span className="font-bold" style={{ color: "var(--accent)" }}>{balance}🎫</span></p>
      <div className="mt-3 space-y-1 max-h-96 overflow-y-auto">
        {ledger.map((entry, i) => (
          <div key={i} className="flex items-center justify-between text-xs py-1" style={{ borderBottom: "1px solid var(--border)" }}>
            <div>
              <span>{entry.reason}</span>
              <span className="ml-2 text-[10px]" style={{ color: "var(--muted)" }}>{new Date(entry.createdAt).toLocaleString("ja-JP")}</span>
            </div>
            <span className="font-semibold" style={{ color: entry.delta > 0 ? "var(--success)" : "var(--danger)" }}>{entry.delta > 0 ? `+${entry.delta}` : entry.delta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Audit Logs Tab =====
function AdminAuditLogs() {
  const [logs, setLogs] = useState<AdminAuditEntry[]>([]);

  useEffect(() => { setLogs(getAdminAuditLog()); const iv = setInterval(() => setLogs(getAdminAuditLog()), 3000); return () => clearInterval(iv); }, []);

  return (
    <div>
      <h2 className="text-sm font-semibold">管理者監査ログ</h2>
      <p className="text-[10px]" style={{ color: "var(--muted)" }}>誰が・何を・いつ・なぜ — 全操作を記録</p>
      <div className="mt-3 space-y-1 max-h-96 overflow-y-auto">
        {logs.length === 0 && <p className="text-xs" style={{ color: "var(--muted)" }}>ログなし</p>}
        {logs.map(entry => (
          <div key={entry.id} className="text-[10px] py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2">
              <span className="shrink-0 font-medium" style={{ color: entry.action.startsWith("VIEW_") ? "#f59e0b" : entry.action.includes("BAN") ? "var(--danger)" : "var(--accent)" }}>
                {entry.action}
              </span>
              <span style={{ color: "var(--muted)" }}>{entry.targetType}/{entry.targetId.slice(0, 12)}</span>
              <span className="ml-auto shrink-0" style={{ color: "var(--muted)" }}>{new Date(entry.createdAt).toLocaleString("ja-JP")}</span>
            </div>
            <p className="mt-0.5" style={{ color: "var(--muted)" }}>理由: {entry.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
