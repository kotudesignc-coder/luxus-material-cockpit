"use client";

import { useState } from "react";

type Props = {
  /** YouTube video ID（11 字元）或完整網址。與 src 擇一。 */
  youtube?: string;
  /** 直接 mp4 路徑（相對 /public）。與 youtube 擇一。 */
  src?: string;
  /** 標題（顯示在影片上方） */
  title?: string;
  /** 副標（小字、灰色） */
  subtitle?: string;
  /** 圓角尺寸 */
  rounded?: "xl" | "2xl" | "3xl";
  /** 點擊封面才載入 iframe / mp4；對首頁 LCP 友善。預設 true */
  lazy?: boolean;
  /** 封面圖（可選；未給時 YouTube 會用自動縮圖，mp4 則純黑底 + 播放鈕） */
  poster?: string;
  className?: string;
};

/** 從 URL 或 ID 解出 11 字元 video id */
function parseYoutubeId(input: string): string {
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
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
  return input;
}

const ROUNDED: Record<NonNullable<Props["rounded"]>, string> = {
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

/**
 * 支援兩種影片來源：
 *   <VideoEmbed youtube="xxx" ... />  使用 YouTube iframe
 *   <VideoEmbed src="/video/demo.mp4" ... />  使用原生 <video>
 *
 * Lazy：預設先顯示黑底 + 大播放鈕，點了才開始載，LCP 友善。
 */
export function VideoEmbed({
  youtube,
  src,
  title,
  subtitle,
  rounded = "2xl",
  lazy = true,
  poster,
  className = "",
}: Props) {
  const [loaded, setLoaded] = useState(!lazy);
  const ytId = youtube ? parseYoutubeId(youtube) : null;
  const coverSrc =
    poster ?? (ytId ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg` : null);

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
          ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              title={title ?? "影片"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : src ? (
            <video
              src={src}
              autoPlay
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-contain bg-black"
            >
              Your browser does not support video playback.
            </video>
          ) : null
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label={`播放 ${title ?? "影片"}`}
          >
            {coverSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverSrc}
                alt={title ?? "影片封面"}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  if (ytId) {
                    (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
                  }
                }}
              />
            ) : (
              // mp4 無 poster：漂亮漸層底
              <div className="absolute inset-0 bg-gradient-to-br from-[#2a2723] via-[#1b1a17] to-[#0e0d0b]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/60 transition" />
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
