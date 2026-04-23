import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import {
  isValidSessionId,
  sessionKey,
  SESSION_TTL_SECONDS,
  type SessionState,
} from "@/lib/session";

/**
 * /api/session/[id]
 *
 * GET   學員 / 任何人讀 session 狀態（polling 每秒呼叫）
 * POST  講師寫入新狀態 { currentHref?, status? } — 會合併已存資料
 * DELETE 講師結束課程（status=ended）
 *
 * 目前無 auth — session id 夠隨機就是唯一保護。
 * 說明會 60-90 分鐘、在場講師自己控制、風險可接受。
 * 正式版可加 writerSecret 防止 ID 被猜。
 */

export const dynamic = "force-dynamic"; // 不要快取

// Upstash Redis 自動讀 KV_REST_API_URL / KV_REST_API_TOKEN env vars
const redis = Redis.fromEnv();

type Params = { params: Promise<{ id: string }> };

async function getId(ctx: Params): Promise<string | null> {
  const { id } = await ctx.params;
  return isValidSessionId(id) ? id : null;
}

export async function GET(_req: Request, ctx: Params) {
  const id = await getId(ctx);
  if (!id) {
    return NextResponse.json({ error: "invalid session id" }, { status: 400 });
  }

  const state = await redis.get<SessionState>(sessionKey(id));
  if (!state) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(state, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request, ctx: Params) {
  const id = await getId(ctx);
  if (!id) {
    return NextResponse.json({ error: "invalid session id" }, { status: 400 });
  }

  let body: Partial<SessionState>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const existing =
    (await redis.get<SessionState>(sessionKey(id))) ?? null;

  const now = Date.now();
  const state: SessionState = {
    currentHref: body.currentHref ?? existing?.currentHref ?? "/",
    startedAt: existing?.startedAt ?? now,
    updatedAt: now,
    status: body.status ?? existing?.status ?? "live",
  };

  await redis.set(sessionKey(id), state, { ex: SESSION_TTL_SECONDS });

  return NextResponse.json(state);
}

export async function DELETE(_req: Request, ctx: Params) {
  const id = await getId(ctx);
  if (!id) {
    return NextResponse.json({ error: "invalid session id" }, { status: 400 });
  }

  const existing = await redis.get<SessionState>(sessionKey(id));
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const ended: SessionState = {
    ...existing,
    status: "ended",
    updatedAt: Date.now(),
  };

  // 結束後再保留 15 分鐘給學員端收到通知就好
  await redis.set(sessionKey(id), ended, { ex: 15 * 60 });

  return NextResponse.json(ended);
}
