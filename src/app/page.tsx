import { demoDashboardStats, demoWorkflowLogs } from "@/lib/demo-data";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SystemStatus } from "@/components/dashboard/system-status";

export default function DashboardPage() {
  const stats = demoDashboardStats;
  const workflows = demoWorkflowLogs;

  return (
    <div className="space-y-6">
      <DashboardGrid stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity approvals={stats.recent_approvals} />
        <SystemStatus workflows={workflows} status={stats.system_status} errors={stats.recent_errors} />
      </div>
    </div>
  );
}
