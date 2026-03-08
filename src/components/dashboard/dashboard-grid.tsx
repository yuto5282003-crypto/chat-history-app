import type { DashboardStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  CheckCircle,
  MousePointerClick,
  TrendingUp,
  Layers,
  Timer,
} from "lucide-react";

interface Props {
  stats: DashboardStats;
}

export function DashboardGrid({ stats }: Props) {
  const kpiCards = [
    {
      title: "推奨投稿数",
      value: stats.recommended_post_count,
      unit: "件",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "承認待ち",
      value: stats.pending_approval_count,
      unit: "件",
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "本日の予約",
      value: stats.scheduled_today_count,
      unit: "件",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "直近クリック数",
      value: stats.recent_clicks,
      unit: "",
      icon: MousePointerClick,
      color: "text-purple-500",
    },
    {
      title: "直近CTR",
      value: `${stats.recent_ctr}%`,
      unit: "",
      icon: TrendingUp,
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="pb-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {kpi.value}
                  {kpi.unit && (
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {kpi.unit}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Secondary Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <CardTitle>反応の良いカテゴリ</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.top_categories.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <span className="text-sm">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {cat.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Hours */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-muted-foreground" />
              <CardTitle>おすすめ投稿時間帯</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.recommended_hours.map((hour) => (
                <Badge key={hour} variant="secondary" className="text-sm px-3 py-1">
                  {hour}:00
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              過去の成績データに基づく最適時間帯
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
