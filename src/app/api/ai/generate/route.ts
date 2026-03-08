import { NextResponse } from "next/server";
import { createAIProvider, AIRateLimitError, AIOverloadedError } from "@/lib/adapters/ai-provider";
import { buildPostGenerationPrompt, type PostGenerationParams } from "@/lib/prompts/post-generation";
import { demoItems } from "@/lib/demo-data";

// POST /api/ai/generate — AI文面生成
export async function POST(request: Request) {
  const body = await request.json();
  const { item_id, tone, length, ng_words } = body;

  const item = demoItems.find((i) => i.id === item_id);
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const params: PostGenerationParams = {
    item,
    tone: tone || "natural",
    length: length || "medium",
    ng_words: ng_words || [],
  };

  const prompt = buildPostGenerationPrompt(params);
  const provider = createAIProvider();

  try {
    const result = await provider.generateText(prompt);
    return NextResponse.json({
      success: true,
      generated_text: result.text,
      provider: result.provider,
      model: result.model,
      tokens: {
        input: result.input_tokens,
        output: result.output_tokens,
      },
      duration_ms: result.duration_ms,
    });
  } catch (error) {
    if (error instanceof AIRateLimitError) {
      const retryAfterSec = error.retryAfterMs ? Math.ceil(error.retryAfterMs / 1000) : null;
      return NextResponse.json(
        {
          error: "rate_limit",
          message: "APIのレート制限に達しました。リトライ後も制限が解除されませんでした。",
          retry_after_seconds: retryAfterSec,
        },
        {
          status: 429,
          headers: retryAfterSec ? { "Retry-After": String(retryAfterSec) } : {},
        }
      );
    }

    if (error instanceof AIOverloadedError) {
      return NextResponse.json(
        {
          error: "overloaded",
          message: "AIサーバーが混雑しています。しばらく待ってから再度お試しください。",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "generation_failed", message: "AI文面生成に失敗しました", details: String(error) },
      { status: 500 }
    );
  }
}
