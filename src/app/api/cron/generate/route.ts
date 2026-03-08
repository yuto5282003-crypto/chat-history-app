import { NextResponse } from "next/server";
import { createAIProvider, AIRateLimitError, AIOverloadedError } from "@/lib/adapters/ai-provider";
import { buildPostGenerationPrompt } from "@/lib/prompts/post-generation";
import { demoItems } from "@/lib/demo-data";

// GET /api/cron/generate — 文面生成ジョブ
// Vercel Cron: 毎日8時に実行
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = createAIProvider();
  const tones = ["click_bait", "natural", "casual"] as const;
  let generatedCount = 0;
  let skippedCount = 0;
  let rateLimitHit = false;

  // TODO: DBから上位候補を取得
  const topItems = demoItems.slice(0, 3);

  for (const item of topItems) {
    if (rateLimitHit) break;

    for (const tone of tones) {
      const prompt = buildPostGenerationPrompt({
        item,
        tone,
        length: "medium",
        ng_words: [],
      });

      try {
        await provider.generateText(prompt);
        generatedCount++;
      } catch (error) {
        if (error instanceof AIRateLimitError || error instanceof AIOverloadedError) {
          console.warn(`[cron/generate] レート制限到達、残りのアイテムをスキップ: ${error.message}`);
          rateLimitHit = true;
          skippedCount++;
          break;
        }
        // その他のエラーはスキップして続行
        console.error(`[cron/generate] 生成失敗 (item=${item.id}, tone=${tone}):`, error);
        skippedCount++;
      }
    }
  }

  return NextResponse.json({
    success: !rateLimitHit,
    workflow: "generate",
    items_processed: topItems.length,
    variants_generated: generatedCount,
    variants_skipped: skippedCount,
    rate_limited: rateLimitHit,
    timestamp: new Date().toISOString(),
  });
}
