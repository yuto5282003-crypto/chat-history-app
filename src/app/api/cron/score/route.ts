import { NextResponse } from "next/server";
import { calculateScore, rankCandidates } from "@/lib/services/scoring";
import { demoItems } from "@/lib/demo-data";

// GET /api/cron/score — スコアリングジョブ
// Vercel Cron: 毎日7時に実行
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // TODO: DBから未スコアリング素材を取得
    const items = demoItems;

    const scored = items.map((item) => {
      const scores = calculateScore(item, {
        peakHours: [10, 12, 15, 19, 21],
      });
      return { item, ...scores };
    });

    const ranked = rankCandidates(scored);

    return NextResponse.json({
      success: true,
      workflow: "score",
      items_scored: ranked.length,
      top_score: ranked[0]?.total_score,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Scoring failed", details: String(error) },
      { status: 500 }
    );
  }
}
