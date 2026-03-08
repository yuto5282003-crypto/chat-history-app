"use client";

import Link from "next/link";
import type { CandidatePost } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getScoreColor,
  getStatusLabel,
  getStatusColor,
  getToneLabel,
  getRiskSeverityColor,
  formatPercent,
} from "@/lib/utils";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  Clock,
  Star,
} from "lucide-react";

interface Props {
  candidate: CandidatePost;
  onAction: (id: string, action: "approved" | "rejected" | "regenerate_requested") => void;
}

export function CandidateCard({ candidate, onAction }: Props) {
  const selectedVariant = candidate.variants.find((v) => v.is_selected) || candidate.variants[0];

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-[10px]">
                {candidate.item.category}
              </Badge>
              {candidate.item.is_free_trial && (
                <Badge variant="success" className="text-[10px]">無料</Badge>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(candidate.status)}`}>
                {getStatusLabel(candidate.status)}
              </span>
            </div>
            <h3 className="text-sm font-semibold leading-tight truncate">
              {candidate.item.title}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className={`text-lg font-bold ${getScoreColor(candidate.total_score)}`}>
              {candidate.total_score}
            </div>
            <span className="text-[10px] text-muted-foreground">AIスコア</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        {/* Recommendation reason */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {candidate.recommendation_reason}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span>CTR {formatPercent(candidate.estimated_ctr)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-500" />
            <span>{candidate.recommended_time}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            {candidate.variants.length}案
          </div>
        </div>

        {/* Selected variant preview */}
        {selectedVariant && (
          <div className="p-2 rounded-md bg-secondary/50 border">
            <div className="flex items-center gap-1 mb-1">
              <Badge variant="outline" className="text-[10px]">
                案{selectedVariant.variant_label}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                {getToneLabel(selectedVariant.tone)}
              </span>
            </div>
            <p className="text-xs leading-relaxed line-clamp-3 whitespace-pre-line">
              {selectedVariant.body_text}
            </p>
          </div>
        )}

        {/* Risk flags */}
        {candidate.risk_flags.length > 0 && (
          <div className="space-y-1">
            {candidate.risk_flags.map((flag, i) => (
              <div
                key={i}
                className={`flex items-center gap-1.5 text-[11px] px-2 py-1 rounded border ${getRiskSeverityColor(flag.severity)}`}
              >
                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                {flag.message}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {candidate.item.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t">
          {candidate.status === "pending" && (
            <>
              <Button
                size="sm"
                variant="success"
                className="flex-1"
                onClick={() => onAction(candidate.id, "approved")}
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                採用
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onAction(candidate.id, "rejected")}
              >
                <XCircle className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction(candidate.id, "regenerate_requested")}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
          <Link href={`/candidates/${candidate.id}`} className="ml-auto">
            <Button size="sm" variant="ghost">
              詳細 <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
