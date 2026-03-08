// ========================================
// AI Provider Adapter
// プロバイダーを切り替え可能な抽象インターフェース
// ========================================

export interface AIGenerationResult {
  text: string;
  input_tokens: number;
  output_tokens: number;
  duration_ms: number;
  model: string;
  provider: string;
}

export class AIRateLimitError extends Error {
  readonly retryAfterMs: number | null;
  readonly statusCode: number;

  constructor(statusCode: number, retryAfterMs: number | null, message?: string) {
    super(message || `レート制限に達しました (HTTP ${statusCode})`);
    this.name = "AIRateLimitError";
    this.statusCode = statusCode;
    this.retryAfterMs = retryAfterMs;
  }
}

export class AIOverloadedError extends Error {
  constructor(message?: string) {
    super(message || "APIサーバーが過負荷状態です。しばらく待ってから再試行してください");
    this.name = "AIOverloadedError";
  }
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function parseRetryAfter(res: Response): number | null {
  const header = res.headers.get("retry-after");
  if (!header) return null;
  const seconds = Number(header);
  return isNaN(seconds) ? null : seconds * 1000;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  providerName: string
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.log(`[${providerName}] リトライ ${attempt}/${MAX_RETRIES} (${delay}ms後)`);
      await sleep(delay);
    }

    const res = await fetch(url, options);

    if (res.ok) return res;

    if (res.status === 429) {
      const retryAfter = parseRetryAfter(res);
      if (attempt === MAX_RETRIES) {
        throw new AIRateLimitError(429, retryAfter);
      }
      if (retryAfter && retryAfter < 60000) {
        console.log(`[${providerName}] レート制限: ${retryAfter}ms後にリトライ`);
        await sleep(retryAfter);
        attempt--; // retry-after指定の場合はリトライ回数を消費しない
        continue;
      }
      lastError = new AIRateLimitError(429, retryAfter);
      continue;
    }

    if (res.status === 529 || res.status === 503) {
      if (attempt === MAX_RETRIES) {
        throw new AIOverloadedError();
      }
      lastError = new AIOverloadedError();
      continue;
    }

    // リトライ不要なエラーはそのまま返す
    return res;
  }

  throw lastError || new Error(`${providerName} APIリクエストに失敗しました`);
}

export interface AIProvider {
  readonly name: string;
  generateText(prompt: string, systemPrompt?: string): Promise<AIGenerationResult>;
}

// ---------- Claude Provider ----------
export class ClaudeProvider implements AIProvider {
  readonly name = "claude";

  async generateText(prompt: string, systemPrompt?: string): Promise<AIGenerationResult> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return this.mockGenerate(prompt);
    }

    const start = Date.now();
    const body = JSON.stringify({
      model: process.env.AI_MODEL || "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt || "",
      messages: [{ role: "user", content: prompt }],
    });

    const res = await fetchWithRetry(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body,
      },
      "Claude"
    );

    const data = await res.json();

    if (data.error) {
      throw new Error(`Claude API: ${data.error.message || JSON.stringify(data.error)}`);
    }

    return {
      text: data.content?.[0]?.text || "",
      input_tokens: data.usage?.input_tokens || 0,
      output_tokens: data.usage?.output_tokens || 0,
      duration_ms: Date.now() - start,
      model: data.model || "claude-sonnet-4-6",
      provider: "claude",
    };
  }

  private async mockGenerate(prompt: string): Promise<AIGenerationResult> {
    // デモモード用のモック
    await new Promise((r) => setTimeout(r, 100));
    return {
      text: `[デモ] AIが生成した文面です。プロンプト: ${prompt.slice(0, 50)}...`,
      input_tokens: prompt.length,
      output_tokens: 50,
      duration_ms: 100,
      model: "demo-mock",
      provider: "claude",
    };
  }
}

// ---------- OpenAI Provider ----------
export class OpenAIProvider implements AIProvider {
  readonly name = "openai";

  async generateText(prompt: string, systemPrompt?: string): Promise<AIGenerationResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return this.mockGenerate(prompt);
    }

    const start = Date.now();
    const messages = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });

    const res = await fetchWithRetry(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages,
          max_tokens: 1024,
        }),
      },
      "OpenAI"
    );

    const data = await res.json();

    if (data.error) {
      throw new Error(`OpenAI API: ${data.error.message || JSON.stringify(data.error)}`);
    }

    return {
      text: data.choices?.[0]?.message?.content || "",
      input_tokens: data.usage?.prompt_tokens || 0,
      output_tokens: data.usage?.completion_tokens || 0,
      duration_ms: Date.now() - start,
      model: data.model || "gpt-4o",
      provider: "openai",
    };
  }

  private async mockGenerate(prompt: string): Promise<AIGenerationResult> {
    await new Promise((r) => setTimeout(r, 100));
    return {
      text: `[デモ] OpenAI生成文面。プロンプト: ${prompt.slice(0, 50)}...`,
      input_tokens: prompt.length,
      output_tokens: 50,
      duration_ms: 100,
      model: "demo-mock",
      provider: "openai",
    };
  }
}

// ---------- Factory ----------
export function createAIProvider(provider?: string): AIProvider {
  const p = provider || process.env.AI_PROVIDER || "claude";
  switch (p) {
    case "openai":
      return new OpenAIProvider();
    case "claude":
    default:
      return new ClaudeProvider();
  }
}
