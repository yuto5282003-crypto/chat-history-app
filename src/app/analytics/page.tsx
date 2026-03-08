import {
  demoDailyAnalytics,
  demoCategoryAnalytics,
  demoHourlyAnalytics,
  demoToneAnalytics,
} from "@/lib/demo-data";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">投稿の成績を分析します</p>
      <AnalyticsDashboard
        daily={demoDailyAnalytics}
        categories={demoCategoryAnalytics}
        hourly={demoHourlyAnalytics}
        tones={demoToneAnalytics}
      />
    </div>
  );
}
