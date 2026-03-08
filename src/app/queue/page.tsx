import { demoScheduled, demoCandidates } from "@/lib/demo-data";
import { QueueList } from "@/components/queue/queue-list";

export default function QueuePage() {
  // Add some more demo scheduled items for a richer view
  const allScheduled = [
    ...demoScheduled,
    {
      id: "sched-2",
      candidate_id: "cand-1",
      account_id: "acc-1",
      variant_id: "cand-1-v-a",
      candidate: demoCandidates[0],
      variant: demoCandidates[0].variants[0],
      scheduled_at: new Date(Date.now() + 4 * 3600000).toISOString(),
      status: "pending_approval" as const,
      retry_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "sched-3",
      candidate_id: "cand-2",
      account_id: "acc-1",
      variant_id: "cand-2-v-b",
      candidate: demoCandidates[1],
      variant: demoCandidates[1].variants[1],
      scheduled_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      posted_at: new Date(Date.now() - 2 * 3600000 + 5000).toISOString(),
      status: "posted" as const,
      retry_count: 0,
      external_post_id: "1234567890",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        投稿の予約状況を管理します
      </p>
      <QueueList scheduled={allScheduled} />
    </div>
  );
}
