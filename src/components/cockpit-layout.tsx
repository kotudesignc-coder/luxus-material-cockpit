"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
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
 * - header 換成極簡 pill「講師模式 · Lecture / 退出 ↗」
 * - 隱藏 footer、progress 細條保留
 * - 主講投影時用，沉浸感更強
 * 自由模式（預設）：
 * - 完整 header 含品牌列 + 講師模式 toggle + footer
 *
 * 實作：URL query 是 source of truth（可分享連結），
 * 用 useState + 初始讀 URL + 點擊時同步 router.push + setState
 * 避開 Next.js Link 在 query-only 變化不觸發 re-render 的問題。
 */
export function CockpitLayout({ children, currentHref, isHome = false }: Props) {
  const router = useRouter();
  const [isLecture, setIsLecture] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 初次 mount 時讀 URL，之後監聽 popstate（上一頁/下一頁）
  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      setIsLecture(params.get("mode") === "lecture");
    };
    sync();
    setMounted(true);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const toggleMode = () => {
    const nextLecture = !isLecture;
    setIsLecture(nextLecture);
    const base = currentHref || "/";
    const url = nextLecture ? `${base}?mode=lecture` : base;
    router.push(url);
  };

  const currentIndex = currentHref
    ? PAGES.findIndex((p) => p.href === currentHref)
    : -1;
  const progress =
    currentIndex >= 0 ? ((currentIndex + 1) / PAGES.length) * 100 : 0;

  // 未 mount 時固定走自由模式，避免 SSR/CSR 不一致閃爍
  const showLectureHeader = mounted && isLecture;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ee] text-[#1b1a17]">
      {/* Top nav — lecture 模式下極簡化 */}
      {!showLectureHeader ? (
        <header className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#1b1a17]/5">
          <Link
            href="/"
            className="text-xs tracking-[0.3em] uppercase text-[#8a7f72] hover:text-[#1b1a17] transition"
          >
            LUXUS × RoomDreaming × 可塗設計
          </Link>
          <button
            type="button"
            onClick={toggleMode}
            className="rounded-full border border-[#1b1a17] px-4 py-1.5 text-sm text-[#1b1a17] hover:bg-[#1b1a17] hover:text-[#f7f3ee] transition"
            title="切換為講師主講模式（隱藏導覽，沉浸感）"
          >
            講師模式
          </button>
        </header>
      ) : (
        // lecture 模式：極細頂列 + 紅點 LIVE 印章 + 退出
        <header className="flex items-center justify-between px-6 md:px-12 py-3 border-b border-[#1b1a17]/10 bg-[#1b1a17] text-[#f7f3ee]">
          <span className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#c9a882] animate-pulse" />
            講師模式 · Lecture
          </span>
          <button
            type="button"
            onClick={toggleMode}
            className="text-[10px] tracking-[0.3em] uppercase text-[#c9a882] hover:text-white transition"
          >
            退出 ↗
          </button>
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
      {!showLectureHeader && (
        <footer className="px-6 md:px-12 py-6 text-[11px] tracking-widest uppercase text-[#8a7f72] flex flex-wrap gap-3 justify-between border-t border-[#1b1a17]/5">
          <span>© 2026 可塗設計．與 LUXUS × RoomDreaming 合作出品</span>
          <span>v0.1.0 · 說明會版</span>
        </footer>
      )}
    </div>
  );
}
