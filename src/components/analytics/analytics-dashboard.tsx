"use client";

import type {
  DailyAnalytics,
  CategoryAnalytics,
  HourlyAnalytics,
  ToneAnalytics,
} from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getToneLabel, formatPercent } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Layers,
  MessageSquare,
  Trophy,
} from "lucide-react";

interface Props {
  daily: DailyAnalytics[];
  categories: CategoryAnalytics[];
  hourly: HourlyAnalytics[];
  tones: ToneAnalytics[];
}

export function AnalyticsDashboard({ daily, categories, hourly, tones }: Props) {
  const totalClicks = daily.reduce((s, d) => s + d.clicks, 0);
  const avgCtr = daily.reduce((s, d) => s + d.ctr, 0) / daily.length;
  const totalPosts = daily.reduce((s, d) => s + d.posts_count, 0);
  const totalApproved = daily.reduce((s, d) => s + d.approved_count, 0);
  const totalRejected = daily.reduce((s, d) => s + d.rejected_count, 0);
  const approvalRate = totalApproved / (totalApproved + totalRejected) * 100;

  // Find best hour
  const bestHour = hourly.reduce((best, h) => (h.avg_ctr > best.avg_ctr ? h : best), hourly[0]);

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">期間内クリック合計</div>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">平均CTR</div>
            <div className="text-2xl font-bold">{formatPercent(avgCtr)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">投稿数</div>
            <div className="text-2xl font-bold">{totalPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">承認率</div>
            <div className="text-2xl font-bold">{formatPercent(approvalRate)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily clicks chart (simplified bar chart) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <CardTitle>日別クリック数</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {daily.map((d) => {
                const maxClicks = Math.max(...daily.map((x) => x.clicks));
                const height = (d.clicks / maxClicks) * 100;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-muted-foreground">{d.clicks}</span>
                    <div
                      className="w-full bg-primary/80 rounded-t hover:bg-primary transition-colors"
                      style={{ height: `${height}%` }}
                      title={`${d.date}: ${d.clicks}クリック`}
                    />
                    <span className="text-[8px] text-muted-foreground">
                      {d.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Daily CTR */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <CardTitle>日別CTR推移</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {daily.map((d) => {
                const maxCtr = Math.max(...daily.map((x) => x.ctr));
                const height = (d.ctr / maxCtr) * 100;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-muted-foreground">
                      {d.ctr.toFixed(1)}
                    </span>
                    <div
                      className="w-full bg-green-500/80 rounded-t hover:bg-green-500 transition-colors"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[8px] text-muted-foreground">
                      {d.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Category performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <CardTitle>カテゴリ別成績</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories
                .sort((a, b) => b.avg_ctr - a.avg_ctr)
                .map((cat, i) => (
                  <div key={cat.category} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-4 text-muted-foreground">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{cat.category}</span>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{cat.total_posts}投稿</span>
                          <span>{cat.total_clicks}クリック</span>
                          <Badge variant="secondary">{formatPercent(cat.avg_ctr)}</Badge>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${(cat.avg_ctr / Math.max(...categories.map((c) => c.avg_ctr))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <CardTitle>時間帯別成績</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-1">
              {hourly
                .filter((h) => h.hour >= 6 && h.hour <= 23)
                .map((h) => {
                  const intensity = h.avg_ctr / (bestHour?.avg_ctr || 1);
                  return (
                    <div key={h.hour} className="flex flex-col items-center gap-1">
                      <div
                        className="w-full aspect-square rounded-sm transition-colors"
                        style={{
                          backgroundColor: `hsl(142, 76%, ${36 + (1 - intensity) * 50}%)`,
                          opacity: 0.3 + intensity * 0.7,
                        }}
                        title={`${h.hour}時: CTR ${h.avg_ctr.toFixed(1)}%`}
                      />
                      <span className="text-[8px] text-muted-foreground">{h.hour}</span>
                    </div>
                  );
                })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              最も成績の良い時間帯: {bestHour?.hour}時 (CTR {bestHour?.avg_ctr.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        {/* Tone performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <CardTitle>文体別成績</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tones
                .sort((a, b) => b.avg_ctr - a.avg_ctr)
                .map((tone, i) => (
                  <div key={tone.tone} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {i === 0 && <Trophy className="w-3.5 h-3.5 text-yellow-500" />}
                      <span className="text-sm">{getToneLabel(tone.tone)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground">{tone.total_posts}投稿</span>
                      <span className="text-muted-foreground">avg {tone.avg_clicks}クリック</span>
                      <Badge variant={i === 0 ? "success" : "secondary"}>
                        {formatPercent(tone.avg_ctr)}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Top posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <CardTitle>成績上位投稿</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {daily
                .sort((a, b) => b.clicks - a.clicks)
                .slice(0, 5)
                .map((d, i) => (
                  <div key={d.date} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-5 text-center">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm">{d.date}</div>
                      <div className="text-xs text-muted-foreground">
                        {d.posts_count}投稿 · {d.clicks}クリック
                      </div>
                    </div>
                    <Badge variant="secondary">{formatPercent(d.ctr)}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
