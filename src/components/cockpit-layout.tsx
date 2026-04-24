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
  const [isProjector, setIsProjector] = useState(false); // 投影幕模式：跟隨但不鎖、不顯示 overlay
  const [adminVisible, setAdminVisible] = useState(false);
  const [debugVisible, setDebugVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // dev-only log，production 靜音
  const isDev = process.env.NODE_ENV !== "production";
  const devLog = (...args: unknown[]) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  };

  // ----- 初始化：讀 URL query + localStorage 備援判斷身份 -----
  //
  // 為什麼要備援？
  // 網站內很多 <Link>（頁目錄、下一步、CTA）只帶 href 不帶 query，
  // 點了之後 URL 會丟掉 ?mode=lecture&session=xxx 或 ?join=xxx。
  // 每次 page 切換 → CockpitLayout 新 instance → 若只靠 URL 判身份就會掉。
  // 解法：身份寫 localStorage，URL 沒帶時用 localStorage 還原。
  //
  // localStorage key：
  //   cockpit-role   : 'lecturer' | 'student'
  //   cockpit-session: 6 位 session id
  //   cockpit-admin  : '1' = 顯示講師模式按鈕
  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode");
      const session = params.get("session");
      const join = params.get("join");
      const projector = params.get("projector");

      // admin 後門
      if (params.get("admin") === "1") {
        try {
          localStorage.setItem("cockpit-admin", "1");
        } catch {}
      }
      // reset 後門：?reset=1 清除所有身份（投影 / 學員 / 講師）回到自由模式
      if (params.get("reset") === "1") {
        try {
          localStorage.removeItem("cockpit-role");
          localStorage.removeItem("cockpit-session");
        } catch {}
      }
      try {
        setAdminVisible(localStorage.getItem("cockpit-admin") === "1");
      } catch {}
      // debug HUD 開關：URL ?debug=1 喚出，存 localStorage 這裝置以後常顯示
      if (params.get("debug") === "1") {
        try {
          localStorage.setItem("cockpit-debug", "1");
        } catch {}
      }
      if (params.get("debug") === "0") {
        try {
          localStorage.removeItem("cockpit-debug");
        } catch {}
      }
      try {
        setDebugVisible(localStorage.getItem("cockpit-debug") === "1");
      } catch {}

      // --- 決定身份，URL 優先，localStorage 備援 ---
      let ls = { role: "", id: "" };
      try {
        ls = {
          role: localStorage.getItem("cockpit-role") ?? "",
          id: localStorage.getItem("cockpit-session") ?? "",
        };
      } catch {}

      // 0. URL 有 projector=xxx → 投影幕模式（跟隨但不鎖、畫面乾淨）
      if (projector && isValidSessionId(projector)) {
        devLog("[sync] → projector", projector);
        setStudentJoinId(projector);
        setIsProjector(true);
        setIsLecture(false);
        setSessionId(null);
        try {
          localStorage.setItem("cockpit-role", "projector");
          localStorage.setItem("cockpit-session", projector);
        } catch {}
        return;
      }
      // 1. URL 有 join → 學員
      if (join && isValidSessionId(join)) {
        devLog("[sync] → student (url join)", join);
        setStudentJoinId(join);
        setIsProjector(false);
        setIsLecture(false);
        setSessionId(null);
        try {
          localStorage.setItem("cockpit-role", "student");
          localStorage.setItem("cockpit-session", join);
        } catch {}
        return;
      }
      // 2. URL 有 mode=lecture → 講師
      if (mode === "lecture") {
        const id =
          session && isValidSessionId(session)
            ? session
            : ls.role === "lecturer" && isValidSessionId(ls.id)
              ? ls.id
              : generateSessionId();
        setIsLecture(true);
        setSessionId(id);
        setStudentJoinId(null);
        try {
          localStorage.setItem("cockpit-role", "lecturer");
          localStorage.setItem("cockpit-session", id);
        } catch {}
        // URL 沒帶 session 就補上（方便分享）
        if (!session || !isValidSessionId(session)) {
          const u = new URL(window.location.href);
          u.searchParams.set("mode", "lecture");
          u.searchParams.set("session", id);
          window.history.replaceState(null, "", u.toString());
        }
        return;
      }
      // 3. URL 沒 query → 用 localStorage 還原身份
      if (ls.role === "lecturer" && isValidSessionId(ls.id)) {
        devLog("[sync] → lecturer (from localStorage)", ls.id);
        setIsLecture(true);
        setSessionId(ls.id);
        setStudentJoinId(null);
        return;
      }
      if (ls.role === "student" && isValidSessionId(ls.id)) {
        devLog("[sync] → student (from localStorage)", ls.id);
        setStudentJoinId(ls.id);
        setIsProjector(false);
        setIsLecture(false);
        setSessionId(null);
        return;
      }
      if (ls.role === "projector" && isValidSessionId(ls.id)) {
        devLog("[sync] → projector (from localStorage)", ls.id);
        setStudentJoinId(ls.id);
        setIsProjector(true);
        setIsLecture(false);
        setSessionId(null);
        return;
      }
      // 4. 什麼都沒有 → 自由模式
      devLog("[sync] → free (no url query, no ls)", { ls });
      setIsProjector(false);
      setIsLecture(false);
      setSessionId(null);
      setStudentJoinId(null);
    };
    devLog("[sync] running, url=", window.location.href);
    sync();
    setMounted(true);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  // ----- 講師廣播：useEffect 觸發 + heartbeat 雙保險 -----
  const {
    broadcast,
    endSession,
    status: lecturerStatus,
  } = useLecturerSync(sessionId);

  // (1) currentHref / sessionId 變化時立刻廣播一次
  useEffect(() => {
    if (!isLecture || !sessionId || !currentHref) return;
    devLog("[broadcast useEffect] trigger", {
      isLecture,
      sessionId,
      currentHref,
    });
    broadcast(currentHref);
  }, [isLecture, sessionId, currentHref, broadcast]);

  // (2) Heartbeat：講師模式下每 1.5 秒自動補發一次，避免狀態轉換時機 miss
  useEffect(() => {
    if (!isLecture || !sessionId || !currentHref) return;
    const iv = setInterval(() => {
      broadcast(currentHref);
    }, 1500);
    return () => clearInterval(iv);
  }, [isLecture, sessionId, currentHref, broadcast]);

  // ----- 學員訂閱：polling Redis，講師翻頁時跟著 router.push -----
  const {
    state: studentState,
    error: studentError,
    status: studentStatus,
  } = useStudentSync(studentJoinId);
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
      // 🔴 關鍵：toggleMode 路徑要**自己寫 localStorage**，不靠 sync useEffect
      // （因為 router.push 同 pathname 時不會重 mount，sync 不會再跑）
      try {
        localStorage.setItem("cockpit-role", "lecturer");
        localStorage.setItem("cockpit-session", newId);
      } catch {}
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
      try {
        localStorage.removeItem("cockpit-role");
        localStorage.removeItem("cockpit-session");
      } catch {}
      router.push(currentHref || "/");
    }
  }, [isLecture, currentHref, router, sessionId, endSession]);

  const currentIndex = currentHref
    ? PAGES.findIndex((p) => p.href === currentHref)
    : -1;
  const progress =
    currentIndex >= 0 ? ((currentIndex + 1) / PAGES.length) * 100 : 0;

  // 四種角色：lecturer / student / projector / free
  const role: "lecturer" | "student" | "projector" | "free" = !mounted
    ? "free"
    : isLecture
      ? "lecturer"
      : isProjector && studentJoinId
        ? "projector"
        : studentJoinId
          ? "student"
          : "free";

  const showLectureHeader = role === "lecturer";
  const showStudentOverlay = role === "student";

  // ----- 全域：Ctrl/Cmd + Shift + L 切換講師模式（隱藏入口） -----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        toggleMode();
        // 按過一次後常駐開啟按鈕，這台裝置以後都看得到
        try {
          localStorage.setItem("cockpit-admin", "1");
          setAdminVisible(true);
        } catch {}
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleMode]);

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

  // 學員端收到 ended 訊號：顯示「課程結束」toast + 清 localStorage 解除綁定
  const [showEndedToast, setShowEndedToast] = useState(false);
  useEffect(() => {
    if (role === "student" && studentState?.status === "ended") {
      setShowEndedToast(true);
      // 清 localStorage 讓學員刷新或切頁後恢復自由模式
      try {
        localStorage.removeItem("cockpit-role");
        localStorage.removeItem("cockpit-session");
      } catch {}
      const t = setTimeout(() => setShowEndedToast(false), 6000);
      return () => clearTimeout(t);
    }
  }, [role, studentState?.status]);

  // 判斷當前頁是否為互動頁（學員可自己玩）
  const currentPage = currentHref ? PAGES.find((p) => p.href === currentHref) : undefined;
  const isInteractivePage = !!currentPage?.interactive;

  // 判斷學員是否已解鎖（課程結束後可自由點；互動頁也解鎖讓學員自己玩）
  const studentLocked =
    role === "student" &&
    studentState?.status !== "ended" &&
    studentError !== "not-found" &&
    !isInteractivePage;

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
          {adminVisible ? (
            <button
              type="button"
              onClick={toggleMode}
              className="rounded-full border border-[#1b1a17] px-4 py-1.5 text-sm text-[#1b1a17] hover:bg-[#1b1a17] hover:text-[#f7f3ee] transition"
              title="切換為講師主講模式（Ctrl+Shift+L）"
            >
              講師模式
            </button>
          ) : (
            // 無按鈕時，右側放一個不顯眼的佔位確保 justify-between 結構正常
            <span />
          )}
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
                : isInteractivePage
                  ? "這頁自己玩 · 老師翻頁會帶你走"
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


      {/* 🔬 同步 debug HUD — 需要 ?debug=1 開啟（localStorage 記住），預設隱藏 */}
      {debugVisible && (role === "lecturer" || role === "student") && (
        <div className="fixed bottom-5 right-5 z-50 pointer-events-none select-none max-w-[280px]">
          <div className="px-3 py-2 rounded-lg bg-black/80 text-white text-[10px] font-mono leading-tight backdrop-blur shadow-lg space-y-1">
            <div className="text-[#c9a882] tracking-widest uppercase text-[9px]">
              SYNC · {role}
            </div>
            {role === "lecturer" && (
              <>
                <div>session: {sessionId ?? "—"}</div>
                <div>current: {currentHref ?? "—"}</div>
                <div>
                  broadcast: {lecturerStatus.count}× ·{" "}
                  {lecturerStatus.lastAt
                    ? `${Math.round((Date.now() - lecturerStatus.lastAt) / 1000)}s ago`
                    : "—"}
                </div>
                <div className="text-[#8a7f72]">
                  last: {lecturerStatus.lastHref ?? "—"}
                </div>
                {lecturerStatus.lastError && (
                  <div className="text-red-400">
                    err: {lecturerStatus.lastError}
                  </div>
                )}
              </>
            )}
            {role === "student" && (
              <>
                <div>join: {studentJoinId ?? "—"}</div>
                <div>pageHref: {currentHref ?? "—"}</div>
                <div>
                  poll: {studentStatus.count}× ·{" "}
                  {studentStatus.lastPollAt
                    ? `${Math.round((Date.now() - studentStatus.lastPollAt) / 1000)}s ago`
                    : "—"}
                </div>
                <div className="text-[#8a7f72]">
                  serverHref: {studentStatus.lastServerHref ?? "—"}
                </div>
                <div>
                  state: {studentState?.status ?? "—"}
                  {studentError && ` · err=${studentError}`}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
