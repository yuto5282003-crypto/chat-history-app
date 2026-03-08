import { NextResponse } from "next/server";
import { createAIProvider, type ImageInput } from "@/lib/adapters/ai-provider";
import { buildPostGenerationPrompt, type PostGenerationParams } from "@/lib/prompts/post-generation";
import { demoItems } from "@/lib/demo-data";

// POST /api/ai/generate — AI文面生成（画像付きリクエスト対応）
export async function POST(request: Request) {
  const body = await request.json();
  const { item_id, tone, length, ng_words, images } = body;

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

  // images: Array<{ base64?: string; url?: string; mediaType?: string }>
  const imageInputs: ImageInput[] | undefined = images && images.length > 0
    ? images
    : undefined;

  try {
    const result = await provider.generateText(prompt, undefined, imageInputs);
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
    return NextResponse.json(
      { error: "AI generation failed", details: String(error) },
      { status: 500 }
    );
  }
}
