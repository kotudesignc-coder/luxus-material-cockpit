"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SessionState } from "@/lib/session";

type Options = {
  /** 學員端輪詢間隔 ms，預設 1000（一秒） */
  pollInterval?: number;
};

export type LecturerStatus = {
  /** 最後一次廣播成功的頁 */
  lastHref: string | null;
  /** 最後一次廣播成功的時間 */
  lastAt: number | null;
  /** 最近一次錯誤訊息 */
  lastError: string | null;
  /** 廣播次數（累計） */
  count: number;
};

/**
 * 講師端：提供 broadcast / endSession，把當前頁面廣播到 Redis。
 * 呼叫者在每次 router 變化後呼叫 broadcast(newHref) 即可。
 * 回傳 status 供 debug HUD 顯示。
 */
export function useLecturerSync(sessionId: string | null) {
  const [status, setStatus] = useState<LecturerStatus>({
    lastHref: null,
    lastAt: null,
    lastError: null,
    count: 0,
  });

  const broadcast = useCallback(
    async (currentHref: string) => {
      if (!sessionId) return;
      try {
        const res = await fetch(`/api/session/${sessionId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentHref, status: "live" }),
        });
        if (!res.ok) {
          const msg = `HTTP ${res.status}`;
          // eslint-disable-next-line no-console
          console.warn("[broadcast failed]", msg);
          setStatus((s) => ({ ...s, lastError: msg }));
          return;
        }
        // eslint-disable-next-line no-console
        console.log("[broadcast ok]", currentHref, sessionId);
        setStatus((s) => ({
          lastHref: currentHref,
          lastAt: Date.now(),
          lastError: null,
          count: s.count + 1,
        }));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[broadcast error]", err);
        setStatus((s) => ({ ...s, lastError: String(err) }));
      }
    },
    [sessionId],
  );

  const endSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      await fetch(`/api/session/${sessionId}`, { method: "DELETE" });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[session end failed]", err);
    }
  }, [sessionId]);

  return { broadcast, endSession, status };
}

/**
 * 學員端：每秒 polling 一次 session state。
 * 回傳當前 state + 連線狀態。呼叫者 (CockpitLayout) 依 currentHref 做 router.push。
 */
export type StudentStatus = {
  /** 最後一次成功 poll 到的時間 */
  lastPollAt: number | null;
  /** 最後讀到的 href（server 端的 currentHref） */
  lastServerHref: string | null;
  /** Polling 累計次數 */
  count: number;
};

export function useStudentSync(
  sessionId: string | null,
  { pollInterval = 1000 }: Options = {},
) {
  const [state, setState] = useState<SessionState | null>(null);
  const [error, setError] = useState<"not-found" | "network" | null>(null);
  const [status, setStatus] = useState<StudentStatus>({
    lastPollAt: null,
    lastServerHref: null,
    count: 0,
  });
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
          setStatus((s) => ({ ...s, lastPollAt: Date.now(), count: s.count + 1 }));
        } else if (!res.ok) {
          setError("network");
          setStatus((s) => ({ ...s, lastPollAt: Date.now(), count: s.count + 1 }));
        } else {
          const data = (await res.json()) as SessionState;
          setError(null);
          setState(data);
          setStatus((s) => ({
            lastPollAt: Date.now(),
            lastServerHref: data.currentHref,
            count: s.count + 1,
          }));
          // eslint-disable-next-line no-console
          console.log("[poll ok]", data.currentHref, data.status);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, pollInterval]);

  return { state, error, status };
}
