"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type Props = {
  /** 講師 session id */
  sessionId: string;
};

/**
 * 講師模式下顯示的「學員連結」按鈕。
 * 點了 popup 出連結 + QR code，學員可掃 / 可複製。
 * 學員版網址格式：`<origin>/<pathOfCurrentPage>?join=<id>`，
 * 但實際路徑由講師當下在哪頁動態決定；為了分享簡單，統一指首頁。
 */
export function StudentLinkButton({ sessionId }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    // 學員 URL：首頁 + ?join=sessionId（進來後會自動被帶到講師當前頁）
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    setUrl(`${origin}/?join=${sessionId}`);
  }, [sessionId]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard 失敗 fallback — 選取 input 讓使用者手動 copy
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[10px] tracking-[0.3em] uppercase text-[#c9a882] hover:text-white border border-[#c9a882]/50 rounded-full px-3 py-1 transition"
        title="取得給學員的連結"
      >
        學員連結
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#f7f3ee] rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-xs tracking-[0.3em] uppercase text-[#8a6b3f]">
                  學員同步連結
                </div>
                <h2 className="font-[family-name:var(--font-serif-tc)] text-2xl font-medium mt-1">
                  請學員掃這個 QR
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#8a7f72] hover:text-[#1b1a17] text-xl leading-none"
                aria-label="關閉"
              >
                ×
              </button>
            </div>

            <div className="flex justify-center mb-5">
              <div className="p-4 bg-white rounded-2xl shadow-inner">
                <QRCodeSVG
                  value={url}
                  size={220}
                  fgColor="#1b1a17"
                  bgColor="#ffffff"
                  level="M"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="text-[10px] tracking-widest uppercase text-[#8a7f72] mb-2">
                或複製連結分享
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={url}
                  onFocus={(e) => e.currentTarget.select()}
                  className="flex-1 text-sm bg-white border border-[#1b1a17]/10 rounded-lg px-3 py-2 font-mono text-[#4a463f]"
                />
                <button
                  onClick={copy}
                  className="px-4 py-2 rounded-lg bg-[#1b1a17] text-[#f7f3ee] text-sm hover:bg-[#8a6b3f] transition flex-shrink-0"
                >
                  {copied ? "已複製" : "複製"}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#8a6b3f]/10 text-xs text-[#4a463f] leading-relaxed">
              <strong className="text-[#8a6b3f]">運作方式：</strong>
              學員掃了之後進入「跟隨模式」
              — 你翻到哪頁，他們畫面就跟到哪頁，並鎖住不能點。
              你退出講師模式 → 所有學員自動解鎖、可自由瀏覽。
            </div>

            <div className="mt-4 text-[10px] tracking-widest uppercase text-[#8a7f72] text-center">
              Session · {sessionId}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
