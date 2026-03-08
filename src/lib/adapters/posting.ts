// ========================================
// Posting Adapter
// 投稿先プラットフォームの抽象インターフェース
// ========================================

export interface PostResult {
  success: boolean;
  external_post_id?: string;
  error_message?: string;
  posted_at: string;
}

export interface PostingAdapter {
  readonly platform: string;
  post(text: string, options?: PostOptions): Promise<PostResult>;
  deletePost(externalId: string): Promise<boolean>;
}

export interface PostOptions {
  media_urls?: string[];
  scheduled_at?: string;
}

// ---------- Demo Adapter ----------
export class DemoPostingAdapter implements PostingAdapter {
  readonly platform = "demo";

  async post(text: string): Promise<PostResult> {
    // デモモードではモック投稿
    await new Promise((r) => setTimeout(r, 500));
    return {
      success: true,
      external_post_id: `demo-${Date.now()}`,
      posted_at: new Date().toISOString(),
    };
  }

  async deletePost(): Promise<boolean> {
    return true;
  }
}

// ---------- X (Twitter) Adapter ----------
export class XPostingAdapter implements PostingAdapter {
  readonly platform = "x";

  async post(text: string): Promise<PostResult> {
    const apiKey = process.env.X_API_KEY;
    if (!apiKey) {
      console.warn("X API key not configured, using demo mode");
      return new DemoPostingAdapter().post(text);
    }

    // TODO: X API v2 implementation
    // POST https://api.twitter.com/2/tweets
    return {
      success: false,
      error_message: "X API integration not yet implemented",
      posted_at: new Date().toISOString(),
    };
  }

  async deletePost(externalId: string): Promise<boolean> {
    // TODO: implement
    console.log("Delete post:", externalId);
    return false;
  }
}

// ---------- Factory ----------
export function createPostingAdapter(platform?: string): PostingAdapter {
  switch (platform) {
    case "x":
      return new XPostingAdapter();
    default:
      return new DemoPostingAdapter();
  }
}
