"use client";

import { useEffect, useRef, useState } from "react";
import type { SessionState } from "@/lib/session";

type Options = {
  /** 學員端輪詢間隔 ms，預設 1000（一秒） */
  pollInterval?: number;
};

/**
 * 講師端：提供 broadcast / endSession，把當前頁面廣播到 Redis。
 * 呼叫者在每次 router 變化後呼叫 broadcast(newHref) 即可。
 */
export function useLecturerSync(sessionId: string | null) {
  // 第一次 broadcast 會 create session；之後的都是 update
  const broadcast = async (currentHref: string) => {
    if (!sessionId) return;
    try {
      await fetch(`/api/session/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentHref, status: "live" }),
        // 講師端寫入寧可慢一點也要成功，不要 abort
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[session broadcast failed]", err);
    }
  };

  const endSession = async () => {
    if (!sessionId) return;
    try {
      await fetch(`/api/session/${sessionId}`, { method: "DELETE" });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[session end failed]", err);
    }
  };

  return { broadcast, endSession };
}

/**
 * 學員端：每秒 polling 一次 session state。
 * 回傳當前 state + 連線狀態。呼叫者 (CockpitLayout) 依 currentHref 做 router.push。
 */
export function useStudentSync(
  sessionId: string | null,
  { pollInterval = 1000 }: Options = {},
) {
  const [state, setState] = useState<SessionState | null>(null);
  const [error, setError] = useState<"not-found" | "network" | null>(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) return;
    stoppedRef.current = false;

    const tick = async () => {
      if (stoppedRef.current) return;
      try {
        const res = await fetch(`/api/session/${sessionId}`, {
          cache: "no-store",
        });
        if (res.status === 404) {
          setError("not-found");
          setState(null);
        } else if (!res.ok) {
          setError("network");
        } else {
          const data = (await res.json()) as SessionState;
          setError(null);
          setState(data);
          // 課程已結束 → 停止 polling，讓學員自由瀏覽
          if (data.status === "ended") {
            stoppedRef.current = true;
          }
        }
      } catch {
        setError("network");
      }
    };

    tick(); // 立刻取一次
    const iv = setInterval(tick, pollInterval);
    return () => {
      stoppedRef.current = true;
      clearInterval(iv);
    };
  }, [sessionId, pollInterval]);

  return { state, error };
}
