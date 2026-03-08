import { demoCandidates } from "@/lib/demo-data";
import { CandidateList } from "@/components/candidates/candidate-list";

export default function CandidatesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            AIが選んだ今日の投稿候補 · {demoCandidates.filter((c) => c.status === "pending").length}件が承認待ち
          </p>
        </div>
      </div>
      <CandidateList candidates={demoCandidates} />
    </div>
  );
}
