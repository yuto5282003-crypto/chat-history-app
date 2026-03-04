"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getMyKycRequest, submitKycRequest, runKycAiScoring, addKycAssetMeta, getKycLevel } from "@/lib/demo-store";
import type { KycRequest, KycLevel } from "@/lib/demo-store";

const ID_DOC_TYPES = [
  { value: "license", label: "運転免許証" },
  { value: "passport", label: "パスポート" },
  { value: "student", label: "学生証（補助扱い）" },
];

export default function VerifyPage() {
  const router = useRouter();
  const [level, setLevel] = useState<KycLevel>(1);
  const [kycReq, setKycReq] = useState<KycRequest | null>(null);
  const [kycLevel, setKycLevelState] = useState<KycLevel>(0);
  const [idDocType, setIdDocType] = useState("license");
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [idFrontUploaded, setIdFrontUploaded] = useState(false);
  const [idBackUploaded, setIdBackUploaded] = useState(false);
  const [livenessLeftDone, setLivenessLeftDone] = useState(false);
  const [livenessRightDone, setLivenessRightDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string>("");

  useEffect(() => {
    setKycReq(getMyKycRequest());
    setKycLevelState(getKycLevel());
  }, []);

  function handleFileUpload(target: string) {
    setUploadTarget(target);
    fileRef.current?.click();
  }

  function onFileSelected() {
    // In demo mode, just mark as uploaded
    if (uploadTarget === "selfie") setSelfieUploaded(true);
    if (uploadTarget === "id_front") setIdFrontUploaded(true);
    if (uploadTarget === "id_back") setIdBackUploaded(true);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleSubmit() {
    setSubmitting(true);
    submitKycRequest(level);
    const req = getMyKycRequest();
    if (req) {
      // Record asset metadata
      addKycAssetMeta(req.id, "demo-user-1", "selfie");
      if (level >= 2) {
        addKycAssetMeta(req.id, "demo-user-1", "id_front");
        addKycAssetMeta(req.id, "demo-user-1", "id_back");
        addKycAssetMeta(req.id, "demo-user-1", "liveness_left");
        addKycAssetMeta(req.id, "demo-user-1", "liveness_right");
      }
      // Auto AI scoring after 2s
      setTimeout(() => {
        runKycAiScoring(req.id);
        setKycReq(getMyKycRequest());
        setSubmitting(false);
      }, 2000);
    }
    setKycReq(getMyKycRequest());
  }

  const canSubmitLv1 = selfieUploaded;
  const canSubmitLv2 = selfieUploaded && idFrontUploaded && livenessLeftDone && livenessRightDone;
  const canSubmit = level === 1 ? canSubmitLv1 : canSubmitLv2;

  if (kycLevel >= 2) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">本人確認</h1>
        <div className="mt-6 card p-6 text-center">
          <p className="text-4xl">✅</p>
          <p className="mt-2 text-sm font-medium">Lv2 確認済みです</p>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>すべての機能が利用可能です</p>
          <button onClick={() => router.push("/profile")} className="btn-primary mt-4 text-sm">プロフィールへ戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-6">
      <h1 className="text-xl font-bold">本人確認</h1>
      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>安全な利用のために本人確認をお願いします</p>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileSelected} />

      {/* Status display */}
      {kycReq && kycReq.status !== "approved" && kycReq.status !== "none" && (
        <div className="mt-4 card p-4">
          <p className="text-sm font-medium">申請状況</p>
          <div className="mt-2 rounded-lg p-3 text-xs" style={{
            backgroundColor: kycReq.status === "rejected" || kycReq.status === "resubmit_required" ? "rgba(220,38,38,0.08)" : "rgba(234,179,8,0.1)",
            color: kycReq.status === "rejected" || kycReq.status === "resubmit_required" ? "var(--danger)" : "#b45309"
          }}>
            {kycReq.status === "pending_ai" && "🤖 AI判定中...（約2秒）"}
            {kycReq.status === "pending_review" && `📋 管理者レビュー待ち（AIスコア: ${kycReq.aiScore}）`}
            {kycReq.status === "rejected" && `❌ 却下: ${kycReq.reviewerNote || "理由なし"}`}
            {kycReq.status === "resubmit_required" && `🔄 再提出: ${kycReq.reviewerNote || "書類を確認してください"}`}
          </div>
          {kycReq.status === "pending_review" && (
            <p className="mt-2 text-[10px]" style={{ color: "var(--muted)" }}>/admin/kyc で管理者が承認すると反映されます</p>
          )}
        </div>
      )}

      {/* Level selection */}
      {(!kycReq || kycReq.status === "rejected" || kycReq.status === "resubmit_required" || kycReq.status === "none") && (
        <>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setLevel(1)}
              className="flex-1 rounded-xl p-4 text-center text-sm"
              style={{ backgroundColor: level === 1 ? "var(--accent-soft)" : "var(--bg)", border: level === 1 ? "2px solid var(--accent)" : "1px solid var(--border)" }}>
              <p className="text-2xl">🔓</p>
              <p className="mt-1 font-medium">Lv1 ライト</p>
              <p className="text-[10px]" style={{ color: "var(--muted)" }}>通話OK</p>
            </button>
            <button onClick={() => setLevel(2)}
              className="flex-1 rounded-xl p-4 text-center text-sm"
              style={{ backgroundColor: level === 2 ? "var(--accent-soft)" : "var(--bg)", border: level === 2 ? "2px solid var(--accent)" : "1px solid var(--border)" }}>
              <p className="text-2xl">✅</p>
              <p className="mt-1 font-medium">Lv2 強</p>
              <p className="text-[10px]" style={{ color: "var(--muted)" }}>対面OK</p>
            </button>
          </div>

          {/* Required documents */}
          <div className="mt-4 space-y-3">
            <h3 className="text-sm font-medium">必要書類</h3>

            {/* Selfie (both levels) */}
            <div className="card p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">正面セルフィー</p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>Lv1・Lv2 共通</p>
                </div>
                {selfieUploaded ? (
                  <span className="text-sm" style={{ color: "var(--success)" }}>✓ アップロード済み</span>
                ) : (
                  <button onClick={() => handleFileUpload("selfie")} className="btn-primary text-xs !px-3 !py-1">撮影/選択</button>
                )}
              </div>
            </div>

            {/* ID document (Lv2 only) */}
            {level >= 2 && (
              <>
                <div className="card p-3">
                  <p className="text-sm">身分証明書</p>
                  <select className="input mt-1 text-xs" value={idDocType} onChange={e => setIdDocType(e.target.value)}>
                    {ID_DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => handleFileUpload("id_front")} className={idFrontUploaded ? "btn-outline text-xs !px-2 !py-1" : "btn-primary text-xs !px-2 !py-1"}>
                      {idFrontUploaded ? "✓ 表面" : "表面を撮影"}
                    </button>
                    <button onClick={() => handleFileUpload("id_back")} className={idBackUploaded ? "btn-outline text-xs !px-2 !py-1" : "btn-primary text-xs !px-2 !py-1"}>
                      {idBackUploaded ? "✓ 裏面" : "裏面を撮影"}
                    </button>
                  </div>
                </div>

                {/* Liveness check */}
                <div className="card p-3">
                  <p className="text-sm">ライブネスチェック</p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>顔を左右に向けてください</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => setLivenessLeftDone(true)} className={livenessLeftDone ? "btn-outline flex-1 text-xs !py-2" : "btn-primary flex-1 text-xs !py-2"}>
                      {livenessLeftDone ? "✓ 左向き完了" : "← 左を向く"}
                    </button>
                    <button onClick={() => setLivenessRightDone(true)} className={livenessRightDone ? "btn-outline flex-1 text-xs !py-2" : "btn-primary flex-1 text-xs !py-2"}>
                      {livenessRightDone ? "✓ 右向き完了" : "右を向く →"}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button onClick={handleSubmit} disabled={!canSubmit || submitting}
              className="btn-primary w-full text-sm !py-3" style={{ opacity: canSubmit && !submitting ? 1 : 0.5 }}>
              {submitting ? "送信中..." : `Lv${level} 申請を送信`}
            </button>
          </div>
        </>
      )}

      <div className="mt-6 card p-4">
        <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>確認レベルについて</p>
        <div className="mt-2 space-y-2 text-xs" style={{ color: "var(--muted)" }}>
          <p><strong>Lv0</strong> — 閲覧のみ（本人確認なし）</p>
          <p><strong>Lv1</strong> — 通話OK（セルフィー提出）</p>
          <p><strong>Lv2</strong> — 対面OK（身分証 + ライブネスチェック）</p>
        </div>
      </div>
    </div>
  );
}
