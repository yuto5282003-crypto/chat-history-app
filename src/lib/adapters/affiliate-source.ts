// ========================================
// Affiliate Source Adapter
// ASP/素材取得の抽象インターフェース
// ========================================

import type { AffiliateItem } from "@/types";
import { demoItems } from "@/lib/demo-data";

export interface AffiliateSourceAdapter {
  readonly name: string;
  fetchItems(options?: FetchOptions): Promise<AffiliateItem[]>;
}

export interface FetchOptions {
  category?: string;
  limit?: number;
  sortBy?: "newest" | "popular" | "ranking";
}

// ---------- Demo Adapter ----------
export class DemoAffiliateSource implements AffiliateSourceAdapter {
  readonly name = "demo";

  async fetchItems(options?: FetchOptions): Promise<AffiliateItem[]> {
    let items = [...demoItems];

    if (options?.category) {
      items = items.filter((i) => i.category === options.category);
    }

    if (options?.sortBy === "popular") {
      items.sort((a, b) => b.popularity_score - a.popularity_score);
    } else if (options?.sortBy === "newest") {
      items.sort((a, b) => b.freshness_score - a.freshness_score);
    }

    if (options?.limit) {
      items = items.slice(0, options.limit);
    }

    return items;
  }
}

// ---------- Factory ----------
// 将来的にASP固有のアダプターを追加
export function createAffiliateSource(sourceName?: string): AffiliateSourceAdapter {
  switch (sourceName) {
    // case "fanza": return new FanzaAdapter();
    // case "dmm": return new DMMAdapter();
    default:
      return new DemoAffiliateSource();
  }
}
