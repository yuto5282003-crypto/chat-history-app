// ========================================
// プロンプトテンプレート管理
// コード内直書きを避け、構造化して管理
// ========================================

import type { AffiliateItem } from "@/types";

export interface PostGenerationParams {
  item: AffiliateItem;
  tone: "click_bait" | "natural" | "informative" | "casual" | "urgent";
  length: "short" | "medium" | "long";
  ng_words: string[];
  past_good_examples?: string[];
}

const TONE_INSTRUCTIONS: Record<string, string> = {
  click_bait: "クリックしたくなるような訴求力のある文面。絵文字を適度に使用。",
  natural: "自然体で嫌味のない文面。友人に紹介するようなトーン。",
  informative: "情報を的確に伝える文面。特徴やメリットを明確に。",
  casual: "くだけた口調で親しみやすい文面。「〜だよ」「〜かも」等。",
  urgent: "期間限定感・希少性を強調する文面。",
};

const LENGTH_INSTRUCTIONS: Record<string, string> = {
  short: "50〜80文字程度の短い文面。",
  medium: "80〜140文字程度の文面。",
  long: "140〜200文字程度の詳しい文面。",
};

export function buildPostGenerationPrompt(params: PostGenerationParams): string {
  const ngWordsStr = params.ng_words.length > 0
    ? `以下のNGワードは絶対に使わないでください: ${params.ng_words.join(", ")}`
    : "";

  const pastExamples = params.past_good_examples?.length
    ? `\n\n過去に反応が良かった投稿例:\n${params.past_good_examples.map((e, i) => `${i + 1}. ${e}`).join("\n")}`
    : "";

  return `以下の商品/コンテンツを紹介するSNS投稿文を1つ生成してください。

## 商品情報
- タイトル: ${params.item.title}
- 説明: ${params.item.description}
- カテゴリ: ${params.item.category}
- タグ: ${params.item.tags.join(", ")}
- 無料体験: ${params.item.is_free_trial ? "あり" : "なし"}

## トーン指示
${TONE_INSTRUCTIONS[params.tone]}

## 長さ指示
${LENGTH_INSTRUCTIONS[params.length]}

## 制約
- 投稿文のみを出力してください（説明や前置き不要）
- アフィリエイトリンクは含めないでください（後から自動追加されます）
- ハッシュタグは含めないでください（別途指定されます）
- 規約違反になる表現は避けてください
- 誇大表現・虚偽の表現は避けてください
${ngWordsStr}
${pastExamples}`;
}

export function buildRecommendationReasonPrompt(item: AffiliateItem, scores: Record<string, number>): string {
  return `以下の商品を投稿候補として推薦する理由を1〜2文で簡潔に説明してください。

商品: ${item.title}
カテゴリ: ${item.category}
無料体験: ${item.is_free_trial ? "あり" : "なし"}
人気度: ${item.popularity_score}/100
新着度: ${item.freshness_score}/100
合計スコア: ${scores.total}/100

推薦理由のみを出力してください。`;
}

export function buildHashtagPrompt(item: AffiliateItem, maxCount: number = 3): string {
  return `以下の商品に適したハッシュタグを${maxCount}個以内で提案してください。

商品: ${item.title}
カテゴリ: ${item.category}
タグ: ${item.tags.join(", ")}

ハッシュタグのみを1行ずつ出力してください（#付き）。`;
}
