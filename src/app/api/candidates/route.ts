import { NextResponse } from "next/server";
import { demoCandidates } from "@/lib/demo-data";

// GET /api/candidates — 候補一覧取得
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let candidates = [...demoCandidates];

  if (status && status !== "all") {
    candidates = candidates.filter((c) => c.status === status);
  }

  // スコア順にソート
  candidates.sort((a, b) => b.total_score - a.total_score);

  return NextResponse.json({ candidates });
}

// POST /api/candidates — 候補のステータス更新
export async function POST(request: Request) {
  const body = await request.json();
  const { id, action, note } = body;

  if (!id || !action) {
    return NextResponse.json({ error: "id and action required" }, { status: 400 });
  }

  const validActions = ["approved", "rejected", "alternative_requested", "regenerate_requested"];
  if (!validActions.includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // TODO: Supabase連携後に実DB更新
  return NextResponse.json({
    success: true,
    candidate_id: id,
    action,
    note,
    timestamp: new Date().toISOString(),
  });
}
