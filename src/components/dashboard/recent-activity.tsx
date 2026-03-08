import type { ApprovalLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusLabel } from "@/lib/utils";
import { History, CheckCircle, XCircle, RefreshCw, ArrowRightLeft } from "lucide-react";

interface Props {
  approvals: ApprovalLog[];
}

const actionIcons: Record<string, typeof CheckCircle> = {
  approved: CheckCircle,
  rejected: XCircle,
  regenerate: RefreshCw,
  alternative: ArrowRightLeft,
};

const actionVariants: Record<string, "success" | "destructive" | "warning" | "secondary"> = {
  approved: "success",
  rejected: "destructive",
  regenerate: "warning",
  alternative: "secondary",
};

export function RecentActivity({ approvals }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-muted-foreground" />
          <CardTitle>最近の承認履歴</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {approvals.length === 0 ? (
          <p className="text-sm text-muted-foreground">まだ承認履歴はありません</p>
        ) : (
          <div className="space-y-3">
            {approvals.map((log) => {
              const Icon = actionIcons[log.action] || CheckCircle;
              return (
                <div key={log.id} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {log.candidate_id}
                      </span>
                      <Badge variant={actionVariants[log.action] || "secondary"}>
                        {getStatusLabel(log.action)}
                      </Badge>
                    </div>
                    {log.note && (
                      <p className="text-xs text-muted-foreground">{log.note}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDate(log.created_at)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
