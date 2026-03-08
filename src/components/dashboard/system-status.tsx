import type { WorkflowLog, ErrorLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusLabel, getStatusColor } from "@/lib/utils";
import { Activity, AlertTriangle } from "lucide-react";

interface Props {
  workflows: WorkflowLog[];
  status: "healthy" | "warning" | "error";
  errors: ErrorLog[];
}

const workflowLabels: Record<string, string> = {
  collect: "素材収集",
  score: "スコアリング",
  generate: "文面生成",
  post: "投稿実行",
  analyze: "成績分析",
};

export function SystemStatus({ workflows, status, errors }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <CardTitle>システム稼働状況</CardTitle>
          </div>
          <Badge
            variant={status === "healthy" ? "success" : status === "warning" ? "warning" : "destructive"}
          >
            {getStatusLabel(status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {workflows.map((wf) => (
            <div key={wf.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{workflowLabels[wf.workflow_type] || wf.workflow_type}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(wf.status)}`}>
                  {getStatusLabel(wf.status)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {wf.items_processed}件処理 · {formatDate(wf.started_at)}
              </div>
            </div>
          ))}
        </div>

        {errors.length > 0 && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex items-center gap-1 text-sm font-medium text-destructive">
              <AlertTriangle className="w-4 h-4" />
              エラー通知
            </div>
            {errors.map((err) => (
              <div key={err.id} className="text-xs text-muted-foreground">
                [{err.source}] {err.message}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
