// ========================================
// Analytics Adapter
// 分析データ取得の抽象インターフェース
// ========================================

import type { PerformanceMetric } from "@/types";

export interface AnalyticsAdapter {
  readonly source: string;
  fetchMetrics(postId: string): Promise<PerformanceMetric | null>;
  fetchBulkMetrics(postIds: string[]): Promise<Map<string, PerformanceMetric>>;
}

// ---------- Demo Adapter ----------
export class DemoAnalyticsAdapter implements AnalyticsAdapter {
  readonly source = "demo";

  async fetchMetrics(postId: string): Promise<PerformanceMetric | null> {
    return {
      id: `metric-${postId}`,
      posted_log_id: postId,
      date: new Date().toISOString().split("T")[0],
      impressions: 500 + Math.floor(Math.random() * 2000),
      clicks: 10 + Math.floor(Math.random() * 50),
      ctr: parseFloat((1 + Math.random() * 5).toFixed(2)),
      engagements: 5 + Math.floor(Math.random() * 30),
      retweets: Math.floor(Math.random() * 10),
      likes: Math.floor(Math.random() * 20),
      replies: Math.floor(Math.random() * 5),
      conversions: Math.floor(Math.random() * 3),
      revenue: parseFloat((Math.random() * 1000).toFixed(0)),
      collected_at: new Date().toISOString(),
    };
  }

  async fetchBulkMetrics(postIds: string[]): Promise<Map<string, PerformanceMetric>> {
    const map = new Map<string, PerformanceMetric>();
    for (const id of postIds) {
      const metric = await this.fetchMetrics(id);
      if (metric) map.set(id, metric);
    }
    return map;
  }
}

// ---------- Factory ----------
export function createAnalyticsAdapter(source?: string): AnalyticsAdapter {
  switch (source) {
    // case "x": return new XAnalyticsAdapter();
    default:
      return new DemoAnalyticsAdapter();
  }
}
