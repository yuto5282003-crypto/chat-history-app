import { NextResponse } from "next/server";
import { createAffiliateSource } from "@/lib/adapters/affiliate-source";

// GET /api/cron/collect — 素材収集ジョブ
// Vercel Cron: 毎日6時に実行
export async function GET(request: Request) {
  // Cron認証チェック
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const source = createAffiliateSource();
    const items = await source.fetchItems({ sortBy: "newest", limit: 20 });

    // TODO: DB保存、重複チェック、除外フィルタ適用

    return NextResponse.json({
      success: true,
      workflow: "collect",
      items_collected: items.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Collection failed", details: String(error) },
      { status: 500 }
    );
  }
}
