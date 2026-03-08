"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/": "ダッシュボード",
  "/candidates": "投稿候補一覧",
  "/queue": "予約一覧",
  "/analytics": "成績分析",
  "/settings": "設定",
};

export function Header() {
  const pathname = usePathname();
  const title =
    pageTitles[pathname] ||
    (pathname.startsWith("/candidates/") ? "投稿候補詳細" : "Affi OS");

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 border-b bg-card/80 backdrop-blur-sm">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
            3
          </span>
        </Button>
      </div>
    </header>
  );
}
