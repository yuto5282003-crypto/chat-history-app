import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "healthy":
    case "completed":
    case "posted":
    case "approved":
      return "text-green-500 bg-green-500/10";
    case "warning":
    case "pending":
    case "pending_approval":
    case "scheduled":
      return "text-yellow-500 bg-yellow-500/10";
    case "error":
    case "failed":
    case "rejected":
      return "text-red-500 bg-red-500/10";
    case "paused":
    case "cancelled":
      return "text-muted-foreground bg-muted";
    default:
      return "text-muted-foreground bg-muted";
  }
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "承認待ち",
    approved: "採用済み",
    rejected: "却下",
    alternative_requested: "別案要求",
    regenerate_requested: "再生成要求",
    scheduled: "予約済み",
    pending_approval: "承認待ち",
    posted: "投稿済み",
    failed: "失敗",
    paused: "一時停止",
    cancelled: "キャンセル",
    healthy: "正常",
    warning: "警告",
    error: "エラー",
    started: "実行中",
    completed: "完了",
  };
  return labels[status] || status;
}

export function getToneLabel(tone: string): string {
  const labels: Record<string, string> = {
    click_bait: "クリック重視",
    natural: "自然体",
    informative: "情報提供",
    casual: "カジュアル",
    urgent: "緊急感",
  };
  return labels[tone] || tone;
}

export function getRiskSeverityColor(severity: string): string {
  switch (severity) {
    case "high":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    case "medium":
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    case "low":
      return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    default:
      return "text-muted-foreground bg-muted";
  }
}
