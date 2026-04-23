"use client";

import { useState } from "react";

type Props = {
  /** YouTube video ID（11 字元，例：`dQw4w9WgXcQ`）或完整網址 */
  youtube: string;
  /** 標題（顯示在影片上方） */
  title?: string;
  /** 副標（小字、灰色） */
  subtitle?: string;
  /** 圓角尺寸 */
  rounded?: "xl" | "2xl" | "3xl";
  /** 顯示 YouTube 自動生成的縮圖當封面；點擊才載入 iframe（不拖慢首頁效能） */
  lazy?: boolean;
  className?: string;
};

/** 從 URL 或 ID 解出 11 字元 video id */
function parseYoutubeId(input: string): string {
  // 已是 ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  // 常見幾種 URL
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m) return m[1];
  }
  return input; // fallback，讓 iframe 自己處理
}

const ROUNDED: Record<NonNullable<Props["rounded"]>, string> = {
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

/**
 * YouTube 影片嵌入。
 * 預設 lazy=true — 先顯示 YouTube 縮圖 + 大播放鈕，點擊才載入 iframe，
 * 對首頁 LCP / CLS 分數友善。
 */
export function VideoEmbed({
  youtube,
  title,
  subtitle,
  rounded = "2xl",
  lazy = true,
  className = "",
}: Props) {
  const id = parseYoutubeId(youtube);
  const [loaded, setLoaded] = useState(!lazy);

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-4">
          {subtitle && (
            <div className="text-xs tracking-[0.3em] uppercase text-[#8a7f72] mb-2">
              {subtitle}
            </div>
          )}
          {title && (
            <div className="font-[family-name:var(--font-serif-tc)] text-2xl md:text-3xl font-medium">
              {title}
            </div>
          )}
        </div>
      )}

      <div
        className={`relative aspect-video w-full overflow-hidden bg-[#1b1a17] shadow-2xl shadow-[#8a6b3f]/15 ${ROUNDED[rounded]}`}
      >
        {loaded ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
            title={title ?? "影片"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label={`播放 ${title ?? "影片"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
              alt={title ?? "影片封面"}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // maxres 有時候沒有，fallback 到 hqdefault
                (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
              }}
            />
            {/* dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/60 transition" />
            {/* play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="#1b1a17"
                  className="ml-1"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
