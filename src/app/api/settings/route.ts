import { NextResponse } from "next/server";
import { demoSystemSettings, demoAccountSettings, demoContentRules } from "@/lib/demo-data";

// GET /api/settings — 設定取得
export async function GET() {
  return NextResponse.json({
    system: demoSystemSettings,
    account: demoAccountSettings,
    rules: demoContentRules,
  });
}

// PUT /api/settings — 設定更新
export async function PUT(request: Request) {
  const body = await request.json();

  // TODO: Supabase連携後に実DB更新
  return NextResponse.json({
    success: true,
    updated: body,
    timestamp: new Date().toISOString(),
  });
}
