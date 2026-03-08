"use client";

import { useState } from "react";
import type { CandidatePost } from "@/types";
import { CandidateCard } from "./candidate-card";

interface Props {
  candidates: CandidatePost[];
}

type FilterStatus = "all" | "pending" | "approved" | "rejected";

export function CandidateList({ candidates: initial }: Props) {
  const [candidates, setCandidates] = useState(initial);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filtered =
    filter === "all" ? candidates : candidates.filter((c) => c.status === filter);

  const counts = {
    all: candidates.length,
    pending: candidates.filter((c) => c.status === "pending").length,
    approved: candidates.filter((c) => c.status === "approved").length,
    rejected: candidates.filter((c) => c.status === "rejected").length,
  };

  function handleAction(id: string, action: "approved" | "rejected" | "regenerate_requested") {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: action } : c))
    );
  }

  const filters: { key: FilterStatus; label: string }[] = [
    { key: "all", label: `すべて (${counts.all})` },
    { key: "pending", label: `承認待ち (${counts.pending})` },
    { key: "approved", label: `採用済み (${counts.approved})` },
    { key: "rejected", label: `却下 (${counts.rejected})` },
  ];

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-lg w-fit">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === f.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onAction={handleAction}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          該当する候補はありません
        </div>
      )}
    </div>
  );
}
