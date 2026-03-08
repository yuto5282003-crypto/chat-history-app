import { NextResponse } from "next/server";
import {
  demoDailyAnalytics,
  demoCategoryAnalytics,
  demoHourlyAnalytics,
  demoToneAnalytics,
} from "@/lib/demo-data";

// GET /api/analytics — 分析データ取得
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";

  switch (type) {
    case "daily":
      return NextResponse.json({ daily: demoDailyAnalytics });
    case "category":
      return NextResponse.json({ categories: demoCategoryAnalytics });
    case "hourly":
      return NextResponse.json({ hourly: demoHourlyAnalytics });
    case "tone":
      return NextResponse.json({ tones: demoToneAnalytics });
    default:
      return NextResponse.json({
        daily: demoDailyAnalytics,
        categories: demoCategoryAnalytics,
        hourly: demoHourlyAnalytics,
        tones: demoToneAnalytics,
      });
  }
}
