/**
 * 講師 / 學員同步 session 的型別與工具。
 *
 * 資料流：
 *   講師按「講師模式」→ 產生 session id → 寫入 Redis
 *   講師每次翻頁 → POST /api/session/:id { currentHref }
 *   學員進 ?join=xxx → polling GET /api/session/:id 每秒一次
 *   講師退出 → POST status = 'ended' → 學員收到後解鎖
 */

/** Redis 裡存的 session state */
export type SessionState = {
  /** 講師當前停在哪頁（route 路徑，例：/colors） */
  currentHref: string;
  /** 啟動時間 (ms) */
  startedAt: number;
  /** 最後一次更新時間 (ms) */
  updatedAt: number;
  /** 狀態：live = 課程進行中、ended = 已結束，學員端要解鎖 */
  status: "live" | "ended";
};

/** TTL：4 小時（Redis 自動過期，避免殘留） */
export const SESSION_TTL_SECONDS = 4 * 60 * 60;

/** Redis key 命名 */
export const sessionKey = (id: string) => `session:${id}`;

/**
 * 產生 6 位隨機 session id（a-z0-9）。
 * 約 36^6 = 21 億組合，同時課堂內重撞機率趨近 0。
 * 不用 uuid 是為了好口傳、QR code 短、URL 短。
 */
export function generateSessionId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/** 驗證 session id 格式（避免亂輸入） */
export function isValidSessionId(id: string | null | undefined): boolean {
  return !!id && /^[a-z0-9]{6}$/.test(id);
}
