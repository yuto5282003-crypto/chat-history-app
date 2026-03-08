import { NextResponse } from "next/server";
import { demoScheduled } from "@/lib/demo-data";

// GET /api/schedule — 予約一覧取得
export async function GET() {
  return NextResponse.json({ scheduled: demoScheduled });
}

// POST /api/schedule — 予約登録
export async function POST(request: Request) {
  const body = await request.json();
  const { candidate_id, variant_id, scheduled_at } = body;

  if (!candidate_id || !variant_id || !scheduled_at) {
    return NextResponse.json(
      { error: "candidate_id, variant_id, scheduled_at required" },
      { status: 400 }
    );
  }

  // TODO: Supabase連携後に実DB挿入
  return NextResponse.json({
    success: true,
    scheduled_post: {
      id: `sched-${Date.now()}`,
      candidate_id,
      variant_id,
      scheduled_at,
      status: "scheduled",
      created_at: new Date().toISOString(),
    },
  });
}
