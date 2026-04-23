"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { PAGES, getNeighbors } from "@/lib/pages";
import { generateSessionId, isValidSessionId } from "@/lib/session";
import { useLecturerSync, useStudentSync } from "@/hooks/use-session-sync";
import { StudentLinkButton } from "./student-link-button";

type Props = {
  children: ReactNode;
  /** 當前頁 href；用來高亮目錄、決定 progress */
  currentHref?: string;
  /** true = 首頁樣式（無頂部進度、無底部導航） */
  isHome?: boolean;
};

/**
 * 三種運作模式：
 * 1. 自由模式（預設）：有完整 header + footer，散會後觀眾自己玩
 * 2. 講師模式（?mode=lecture&session=xxx）：沉浸 header、鍵盤翻頁、
 *    廣播當前頁到 Redis，可分享學員連結
 * 3. 學員模式（?join=xxx）：畫面鎖定、跟隨講師翻頁、課程結束後解鎖
 */
export function CockpitLayout({ children, currentHref, isHome = false }: Props) {
  const router = useRouter();
  const [isLecture, setIsLecture] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [studentJoinId, setStudentJoinId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // ----- 初始化：讀 URL query 判斷身份 -----
  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode");
      const session = params.get("session");
      const join = params.get("join");

      // 學員模式優先（join param 存在就是學員）
      if (join && isValidSessionId(join)) {
        setStudentJoinId(join);
        setIsLecture(false);
        setSessionId(null);
      } else if (mode === "lecture") {
        // 講師：若 URL 有帶 session id 就沿用；否則產新的
        const id =
          session && isValidSessionId(session) ? session : generateSessionId();
        setIsLecture(true);
        setSessionId(id);
        setStudentJoinId(null);
        // 如果 URL 沒帶 session，補上（讓分享 URL 同步）
        if (!session || !isValidSessionId(session)) {
          const u = new URL(window.location.href);
          u.searchParams.set("mode", "lecture");
          u.searchParams.set("session", id);
          window.history.replaceState(null, "", u.toString());
        }
      } else {
        setIsLecture(false);
        setSessionId(null);
        setStudentJoinId(null);
      }
    };
    sync();
    setMounted(true);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  // ----- 講師廣播：每次 currentHref 變化就 POST 到 Redis -----
  const { broadcast, endSession } = useLecturerSync(sessionId);
  useEffect(() => {
    if (!isLecture || !sessionId || !currentHref) return;
    broadcast(currentHref);
    // broadcast 是 async；fire and forget，錯誤會被 hook 內 console.warn
  }, [isLecture, sessionId, currentHref, broadcast]);

  // ----- 學員訂閱：polling Redis，講師翻頁時跟著 router.push -----
  const { state: studentState, error: studentError } = useStudentSync(
    studentJoinId,
  );
  useEffect(() => {
    if (!studentJoinId || !studentState) return;
    // 跟隨講師翻頁（只在路徑不同時推，避免無限迴圈）
    if (
      studentState.currentHref &&
      studentState.currentHref !== currentHref &&
      studentState.status === "live"
    ) {
      router.push(`${studentState.currentHref}?join=${studentJoinId}`);
    }
  }, [studentJoinId, studentState, currentHref, router]);

  // ----- toggleMode：講師模式 on/off -----
  const toggleMode = useCallback(async () => {
    const nextLecture = !isLecture;
    if (nextLecture) {
      // 進入講師模式：產生 session + 立刻 bootstrap 寫一次 Redis（避免學員搶先進來撞 404）
      const newId = generateSessionId();
      const base = currentHref || "/";
      try {
        await fetch(`/api/session/${newId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentHref: base, status: "live" }),
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[session bootstrap failed]", err);
      }
      setIsLecture(true);
      setSessionId(newId);
      router.push(`${base}?mode=lecture&session=${newId}`);
    } else {
      // 退出講師模式：結束 session 通知學員解鎖
      if (sessionId) {
        await endSession();
      }
      setIsLecture(false);
      setSessionId(null);
      router.push(currentHref || "/");
    }
  }, [isLecture, currentHref, router, sessionId, endSession]);

  const currentIndex = currentHref
    ? PAGES.findIndex((p) => p.href === currentHref)
    : -1;
  const progress =
    currentIndex >= 0 ? ((currentIndex + 1) / PAGES.length) * 100 : 0;

  // 三種角色：lecturer / student / free
  const role: "lecturer" | "student" | "free" = !mounted
    ? "free"
    : isLecture
      ? "lecturer"
      : studentJoinId
        ? "student"
        : "free";

  const showLectureHeader = role === "lecturer";
  const showStudentOverlay = role === "student";

  // ----- 講師模式：鍵盤翻頁 -----
  useEffect(() => {
    if (role !== "lecturer" || !currentHref) return;
    const { prev, next } = getNeighbors(currentHref);
    const makeUrl = (href: string) =>
      `${href}?mode=lecture${sessionId ? `&session=${sessionId}` : ""}`;

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.isContentEditable
      ) {
        return;
      }
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        if (next) {
          e.preventDefault();
          router.push(makeUrl(next.href));
        }
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        if (prev) {
          e.preventDefault();
          router.push(makeUrl(prev.href));
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        router.push(makeUrl("/"));
      } else if (e.key === "End") {
        e.preventDefault();
        router.push(makeUrl(PAGES[PAGES.length - 1].href));
      } else if (e.key === "Escape") {
        e.preventDefault();
        toggleMode();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [role, currentHref, sessionId, router, toggleMode]);

  // ----- 講師模式：滑鼠靜止 2.5 秒自動隱藏游標 -----
  const [cursorHidden, setCursorHidden] = useState(false);
  useEffect(() => {
    if (role !== "lecturer") {
      setCursorHidden(false);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      setCursorHidden(false);
      clearTimeout(timer);
      timer = setTimeout(() => setCursorHidden(true), 2500);
    };
    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("keydown", resetTimer);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [role]);

  const { prev, next } = currentHref
    ? getNeighbors(currentHref)
    : { prev: undefined, next: undefined };

  // 學員端收到 ended 訊號：顯示「課程結束」toast 3 秒後淡出
  const [showEndedToast, setShowEndedToast] = useState(false);
  useEffect(() => {
    if (role === "student" && studentState?.status === "ended") {
      setShowEndedToast(true);
      const t = setTimeout(() => setShowEndedToast(false), 6000);
      return () => clearTimeout(t);
    }
  }, [role, studentState?.status]);

  // 判斷學員是否已解鎖（課程結束後可自由點）
  const studentLocked =
    role === "student" &&
    studentState?.status !== "ended" &&
    studentError !== "not-found";

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#f7f3ee] text-[#1b1a17] ${
        cursorHidden ? "cursor-none" : ""
      }`}
      data-mode={role}
    >
      {/* Top nav */}
      {role === "free" && (
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
            title="切換為講師主講模式"
          >
            講師模式
          </button>
        </header>
      )}

      {role === "lecturer" && (
        <header className="flex items-center justify-between px-6 md:px-12 py-3 border-b border-[#1b1a17]/10 bg-[#1b1a17] text-[#f7f3ee]">
          <span className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#c9a882] animate-pulse" />
            講師模式 · Lecture
            {sessionId && (
              <span className="ml-2 text-[#8a7f72] font-mono">{sessionId}</span>
            )}
          </span>
          <div className="flex items-center gap-3">
            {sessionId && <StudentLinkButton sessionId={sessionId} />}
            <button
              type="button"
              onClick={toggleMode}
              className="text-[10px] tracking-[0.3em] uppercase text-[#c9a882] hover:text-white transition"
            >
              退出 ↗
            </button>
          </div>
        </header>
      )}

      {role === "student" && (
        <header
          className={`flex items-center justify-between px-6 md:px-12 py-3 border-b border-[#1b1a17]/10 text-[#f7f3ee] ${
            studentError === "not-found"
              ? "bg-[#8a7f72]"
              : studentState?.status === "ended"
                ? "bg-[#3f7a3f]"
                : "bg-[#8a6b3f]"
          }`}
        >
          <span className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase">
            <span
              className={`w-2 h-2 rounded-full bg-white ${
                studentError === "not-found" ? "" : "animate-pulse"
              }`}
            />
            {studentError === "not-found"
              ? "等待老師開始 · 可先自由瀏覽"
              : studentState?.status === "ended"
                ? "課程已結束 · 現在可自由瀏覽"
                : "跟隨講師中 · 畫面自動同步"}
            {studentJoinId && (
              <span className="ml-2 text-white/60 font-mono">
                {studentJoinId}
              </span>
            )}
          </span>
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

      {/* Main content — 學員鎖定時禁止點擊 */}
      <main
        className={`flex-1 flex flex-col ${
          studentLocked ? "pointer-events-none select-none" : ""
        }`}
        aria-disabled={studentLocked || undefined}
      >
        {children}
      </main>

      {/* Footer — lecturer / student 模式下隱藏 */}
      {role === "free" && (
        <footer className="px-6 md:px-12 py-6 text-[11px] tracking-widest uppercase text-[#8a7f72] flex flex-wrap gap-3 justify-between border-t border-[#1b1a17]/5">
          <span>© 2026 可塗設計．與 LUXUS × RoomDreaming 合作出品</span>
          <span>v0.1.0 · 說明會版</span>
        </footer>
      )}

      {/* 講師模式：左下頁碼 + 鍵盤提示 */}
      {role === "lecturer" && currentIndex >= 0 && (
        <div className="fixed bottom-5 left-5 z-40 flex flex-col gap-2 text-[10px] tracking-[0.3em] uppercase text-[#8a7f72] pointer-events-none select-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1b1a17]/85 text-[#c9a882] backdrop-blur shadow-lg">
            <span>{String(currentIndex + 1).padStart(2, "0")}</span>
            <span className="opacity-50">/</span>
            <span>{String(PAGES.length).padStart(2, "0")}</span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-[#1b1a17]/60 text-[#f7f3ee]/70 backdrop-blur text-[9px]">
            {prev && "← "}
            {prev ? "上一頁" : "首頁"}
            <span className="mx-2 opacity-40">·</span>
            {next ? "下一頁 " : "最末頁"}
            {next && "→"}
            <span className="mx-2 opacity-40">·</span>
            ESC 退出
          </div>
        </div>
      )}

      {/* 學員模式：「課程結束」toast */}
      {role === "student" && showEndedToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl bg-[#1b1a17] text-[#f7f3ee] shadow-2xl animate-[fadeIn_0.3s_ease-out]">
          <div className="text-xs tracking-[0.3em] uppercase text-[#c9a882] mb-1">
            課程結束
          </div>
          <div className="text-sm">
            老師已退出主講，你現在可以自由點擊、翻頁探索了。
          </div>
        </div>
      )}

    </div>
  );
}
