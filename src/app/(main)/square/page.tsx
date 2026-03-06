"use client";

import { useState, useEffect } from "react";
import SquareCard from "@/components/square/SquareCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPosts, getTicketBalance } from "@/lib/demo-store";
import type { DemoPost } from "@/lib/demo-store";

export default function SquarePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<DemoPost[]>([]);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const p = getPosts();
    setPosts(p);
    setLikeCounts(Object.fromEntries(p.map((x) => [x.id, x.likeCount])));
  }, []);

  const toggleLike = (postId: string) => {
    const wasLiked = likes[postId] ?? false;
    setLikes((prev) => ({ ...prev, [postId]: !wasLiked }));
    setLikeCounts((prev) => ({ ...prev, [postId]: (prev[postId] ?? 0) + (wasLiked ? -1 : 1) }));
  };

  return (
    <div className="px-5 pt-3 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">広場</h1>
        <Link
          href="/square/new"
          className="flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold"
          style={{ background: "var(--gradient-main)", color: "#fff", boxShadow: "0 2px 12px rgba(155, 138, 251, 0.25)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          投稿 <span className="opacity-70">2🎫</span>
        </Link>
      </div>

      <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
        気になる人を見つけて、時間共有を依頼しよう
      </p>

      <div className="mt-5 space-y-4">
        {posts.map((post) => (
          <SquareCard
            key={post.id}
            {...post}
            photos={post.photos ?? []}
            likeCount={likeCounts[post.id] ?? post.likeCount}
            isLiked={likes[post.id] ?? false}
            onLike={toggleLike}
            onRequest={(postId) => router.push(`/square/request/${postId}`)}
            onTap={(postId) => router.push(`/square/post/${postId}`)}
          />
        ))}
      </div>
    </div>
  );
}
