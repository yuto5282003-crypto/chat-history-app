import { demoCandidates } from "@/lib/demo-data";
import { CandidateDetail } from "@/components/candidates/candidate-detail";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CandidateDetailPage({ params }: Props) {
  const { id } = await params;
  const candidate = demoCandidates.find((c) => c.id === id);

  if (!candidate) {
    notFound();
  }

  return <CandidateDetail candidate={candidate} />;
}
