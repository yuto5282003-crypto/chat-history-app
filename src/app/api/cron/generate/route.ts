import { NextResponse } from "next/server";
import { createAIProvider } from "@/lib/adapters/ai-provider";
import { buildPostGenerationPrompt } from "@/lib/prompts/post-generation";
import { demoItems } from "@/lib/demo-data";

// GET /api/cron/generate — 文面生成ジョブ
// Vercel Cron: 毎日8時に実行
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const provider = createAIProvider();
    const tones = ["click_bait", "natural", "casual"] as const;
    let generatedCount = 0;

    // TODO: DBから上位候補を取得
    const topItems = demoItems.slice(0, 3);

    for (const item of topItems) {
      for (const tone of tones) {
        const prompt = buildPostGenerationPrompt({
          item,
          tone,
          length: "medium",
          ng_words: [],
        });

        await provider.generateText(prompt);
        generatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      workflow: "generate",
      items_processed: topItems.length,
      variants_generated: generatedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Generation failed", details: String(error) },
      { status: 500 }
    );
  }
}
