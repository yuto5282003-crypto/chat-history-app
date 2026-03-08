import { NextResponse } from "next/server";
import { createPostingAdapter } from "@/lib/adapters/posting";

// GET /api/cron/post — 投稿実行ジョブ
// Vercel Cron: 15分ごとに実行
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const adapter = createPostingAdapter();

    // TODO: DBから「現在時刻を過ぎた scheduled ステータスの投稿」を取得
    // const duePostS = await db.scheduledPosts.findMany({
    //   where: { status: "scheduled", scheduled_at: { lte: now } }
    // });

    let postedCount = 0;
    let failedCount = 0;

    // デモモードでは何もしない
    // for (const post of duePosts) {
    //   const result = await adapter.post(post.variant.body_text);
    //   if (result.success) {
    //     postedCount++;
    //     // ステータス更新、ログ記録
    //   } else {
    //     failedCount++;
    //     // retry_count++、エラー記録
    //   }
    // }

    return NextResponse.json({
      success: true,
      workflow: "post",
      posted: postedCount,
      failed: failedCount,
      checked_at: now.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Post execution failed", details: String(error) },
      { status: 500 }
    );
  }
}
