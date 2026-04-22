"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { PAGES } from "@/lib/pages";

type Props = {
  children: ReactNode;
  /** 當前頁 href；用來高亮目錄、決定 progress */
  currentHref?: string;
  /** true = 首頁樣式（無頂部進度、無底部導航） */
  isHome?: boolean;
};

/**
 * 講師模式 (`?mode=lecture`)：
 * - 隱藏頂部品牌列與自由/講師切換
 * - 頁面沉浸感更強，主講用
 * 自由模式（預設）：
 * - 顯示所有導覽（散會後觀眾自己玩）
 */
function CockpitLayoutInner({ children, currentHref, isHome = false }: Props) {
  const searchParams = useSearchParams();
  const isLecture = searchParams?.get("mode") === "lecture";

  const currentIndex = currentHref
    ? PAGES.findIndex((p) => p.href === currentHref)
    : -1;
  const progress =
    currentIndex >= 0 ? ((currentIndex + 1) / PAGES.length) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ee] text-[#1b1a17]">
      {/* Top nav — lecture 模式下極簡化 */}
      {!isLecture ? (
        <header className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#1b1a17]/5">
          <Link
            href="/"
            className="text-xs tracking-[0.3em] uppercase text-[#8a7f72] hover:text-[#1b1a17] transition"
          >
            LUXUS × RoomDreaming × 可塗設計
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link
              href={currentHref ? `${currentHref}?mode=free` : "/?mode=free"}
              className="text-[#1b1a17] hover:text-[#8a7f72] transition"
            >
              自由探索
            </Link>
            <Link
              href={currentHref ? `${currentHref}?mode=lecture` : "/?mode=lecture"}
              className="rounded-full border border-[#1b1a17] px-4 py-1.5 text-[#1b1a17] hover:bg-[#1b1a17] hover:text-[#f7f3ee] transition"
            >
              講師模式
            </Link>
          </nav>
        </header>
      ) : (
        // lecture 模式：只保留一個極細的離開入口
        <header className="flex items-center justify-between px-6 md:px-12 py-3 border-b border-[#1b1a17]/5">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#8a6b3f]">
            講師模式 · Lecture
          </span>
          <Link
            href={currentHref ? `${currentHref}?mode=free` : "/"}
            className="text-[10px] tracking-[0.3em] uppercase text-[#8a7f72] hover:text-[#1b1a17] transition"
          >
            退出 ↗
          </Link>
        </header>
      )}

      {/* Progress bar (非首頁才顯示) */}
      {!isHome && currentIndex > 0 && (
        <div className="h-0.5 bg-[#1b1a17]/5">
          <div
            className="h-full bg-[#8a6b3f] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer — lecture 模式下隱藏 */}
      {!isLecture && (
        <footer className="px-6 md:px-12 py-6 text-[11px] tracking-widest uppercase text-[#8a7f72] flex flex-wrap gap-3 justify-between border-t border-[#1b1a17]/5">
          <span>© 2026 可塗設計．與 LUXUS × RoomDreaming 合作出品</span>
          <span>v0.1.0 · 說明會版</span>
        </footer>
      )}
    </div>
  );
}

/**
 * 外層 Suspense 是 Next 16 用 useSearchParams 的要求。
 */
export function CockpitLayout(props: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f3ee]" />}>
      <CockpitLayoutInner {...props} />
    </Suspense>
  );
}
