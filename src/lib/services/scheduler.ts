// ========================================
// スケジューリングサービス
// 投稿時間の最適化・衝突回避
// ========================================

import type { ScheduledPost } from "@/types";

export interface TimeSlot {
  hour: number;
  minute: number;
  score: number;
}

export interface ScheduleConstraints {
  daily_limit: number;
  min_interval_minutes: number;
  allow_night: boolean;
  night_start: number;
  night_end: number;
  peak_hours: number[];
}

const DEFAULT_CONSTRAINTS: ScheduleConstraints = {
  daily_limit: 6,
  min_interval_minutes: 90,
  allow_night: false,
  night_start: 1,
  night_end: 6,
  peak_hours: [10, 12, 15, 19, 21],
};

export function findOptimalTimeSlots(
  existingScheduled: ScheduledPost[],
  count: number,
  constraints: ScheduleConstraints = DEFAULT_CONSTRAINTS
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  // 既存の予約時間を取得
  const occupiedTimes = existingScheduled
    .filter((s) => s.status === "scheduled" || s.status === "pending_approval")
    .map((s) => new Date(s.scheduled_at).getHours() * 60 + new Date(s.scheduled_at).getMinutes());

  // 日の残り予約可能数
  const remaining = Math.min(count, constraints.daily_limit - existingScheduled.length);

  for (const hour of constraints.peak_hours) {
    if (slots.length >= remaining) break;

    // 深夜チェック
    if (!constraints.allow_night && hour >= constraints.night_start && hour < constraints.night_end) {
      continue;
    }

    const minuteInDay = hour * 60;

    // 既存予約との間隔チェック
    const tooClose = occupiedTimes.some(
      (t) => Math.abs(t - minuteInDay) < constraints.min_interval_minutes
    );

    if (!tooClose) {
      slots.push({
        hour,
        minute: 0,
        score: constraints.peak_hours.includes(hour) ? 90 : 50,
      });
      occupiedTimes.push(minuteInDay);
    }
  }

  // ピーク時間で足りない場合、他の時間帯を補完
  if (slots.length < remaining) {
    for (let h = 9; h <= 23; h++) {
      if (slots.length >= remaining) break;
      if (slots.some((s) => s.hour === h)) continue;
      if (!constraints.allow_night && h >= constraints.night_start && h < constraints.night_end) continue;

      const minuteInDay = h * 60;
      const tooClose = occupiedTimes.some(
        (t) => Math.abs(t - minuteInDay) < constraints.min_interval_minutes
      );

      if (!tooClose) {
        slots.push({ hour: h, minute: 0, score: 40 });
        occupiedTimes.push(minuteInDay);
      }
    }
  }

  return slots.sort((a, b) => a.hour - b.hour);
}

export function formatTimeSlot(slot: TimeSlot): string {
  return `${String(slot.hour).padStart(2, "0")}:${String(slot.minute).padStart(2, "0")}`;
}
