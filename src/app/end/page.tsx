"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { CockpitLayout } from "@/components/cockpit-layout";
import { PageNav } from "@/components/page-nav";
import { getPageByHref } from "@/lib/pages";

const HREF = "/end";

type Contact = {
  brand: string;
  slogan: string;
  /** LINE 官方連結（目前用 placeholder，你實際拿到換掉） */
  lineUrl: string;
  /** QR 圖路徑（之後放 /public/qr/ 下） */
  qrSrc?: string;
  /** 沒 QR 圖時用的 SVG 佔位 tint */
  tint: string;
  /** 頂部小標籤 */
  label: string;
};

const CONTACTS: Contact[] = [
  {
    brand: "LUXUS PAINT",
    slogan: "義大利米蘭藝術塗料 · 台灣總代理",
    lineUrl: "https://lin.ee/8sKKok1",
    qrSrc: "/qr/luxus.png",
    tint: "from-[#1b1a17] to-[#4a463f]",
    label: "品牌方",
  },
  // 可塗設計 QR 暫不對外，等真實 QR + LINE URL 到位再加回
];

/**
 * 還沒拿到實體 QR 圖之前的佔位圖 — 看起來像 QR 但不能掃
 */
function FakeQR({ tint }: { tint: string }) {
  return (
    <div
      className={`relative w-full aspect-square rounded-2xl bg-gradient-to-br ${tint} flex items-center justify-center overflow-hidden`}
    >
      <div
        className="w-[78%] h-[78%] bg-white rounded-xl p-3 grid grid-cols-11 gap-0.5"
        aria-hidden
      >
        {Array.from({ length: 121 }).map((_, i) => (
          <div
            key={i}
            className={
              // 三個角落做大方塊 (QR finder patterns)
              (i < 3 || (i < 14 && i > 10) || (i < 25 && i > 21)) ||
              (i > 95 && i < 99) ||
              i === 7 || i === 8 || i === 84 || i === 85
                ? "bg-[#1b1a17] rounded-[1px]"
                : Math.random() > 0.55
                ? "bg-[#1b1a17] rounded-[1px]"
                : ""
            }
          />
        ))}
      </div>
      <div className="absolute bottom-2 text-[9px] tracking-widest uppercase text-white/70">
        QR 佔位 · 待換真圖
      </div>
    </div>
  );
}

export default function EndPage() {
  const page = getPageByHref(HREF)!;

  // 教材本身的入口網址（這個網站）— 散會後讓觀眾掃 QR 帶回家
  const [siteUrl, setSiteUrl] = useState<string>(
    "https://ai-material-cockpit.vercel.app",
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSiteUrl(window.location.origin);
    }
  }, []);

  return (
    <CockpitLayout currentHref={HREF}>
      <section className="flex-1 px-6 md:px-12 py-16 md:py-20 max-w-[1200px] mx-auto w-full">
        <div className="mb-12 md:mb-16 text-center">
          <div className="text-xs tracking-[0.4em] uppercase text-[#8a7f72] mb-4">
            {page.pdfPage} · {page.tag}
          </div>
          <h1 className="font-[family-name:var(--font-serif-tc)] text-[clamp(2rem,4.5vw,4rem)] leading-[1.2] font-medium tracking-tight">
            換你來操作！
          </h1>
          <p className="mt-6 text-lg text-[#4a463f] max-w-2xl mx-auto leading-[1.9]">
            <strong className="text-[#1b1a17]">AI 工具</strong>在 <span className="text-[#1b1a17] font-medium">LUXUS PAINT 官網</span>，下一位客戶就用它開場。
            <br />
            <strong className="text-[#1b1a17]">這份教材</strong>留給你，掃下方 QR 隨時回來複習。
          </p>
        </div>

        {/* 兩張 QR 並排，同尺寸 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* LUXUS LINE QR */}
          {CONTACTS.map((c, i) => (
            <motion.a
              key={c.brand}
              href={c.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="group flex flex-col gap-5 p-6 md:p-8 rounded-3xl bg-white/70 border border-[#1b1a17]/10 hover:border-[#8a6b3f]/40 hover:shadow-2xl hover:shadow-[#8a6b3f]/10 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#8a6b3f]">
                  {c.label}
                </span>
                <span className="text-xs text-[#8a7f72] group-hover:text-[#8a6b3f] transition">
                  加 LINE →
                </span>
              </div>

              <div className="aspect-square w-full bg-white rounded-2xl flex items-center justify-center p-3">
                {c.qrSrc ? (
                  <Image
                    src={c.qrSrc}
                    alt={`${c.brand} LINE QR`}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <FakeQR tint={c.tint} />
                )}
              </div>

              <div className="text-center">
                <div className="font-[family-name:var(--font-serif-tc)] text-2xl font-medium">
                  {c.brand}
                </div>
                <div className="mt-1.5 text-sm text-[#4a463f]">{c.slogan}</div>
              </div>
            </motion.a>
          ))}

          {/* 教材入口 QR — 跟 LUXUS 卡同尺寸並排 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="flex flex-col gap-5 p-6 md:p-8 rounded-3xl bg-[#1b1a17] text-[#f7f3ee] shadow-2xl shadow-[#1b1a17]/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#c9a882]">
                教材入口
              </span>
              <span className="text-xs text-[#8a7f72]">隨時回來複習 ↗</span>
            </div>

            <div className="aspect-square w-full bg-white rounded-2xl flex items-center justify-center p-3">
              <QRCodeSVG
                value={siteUrl}
                size={400}
                fgColor="#1b1a17"
                bgColor="#ffffff"
                level="M"
                className="w-full h-full"
              />
            </div>

            <div className="text-center">
              <div className="font-[family-name:var(--font-serif-tc)] text-2xl font-medium">
                掃這裡，帶回家繼續玩
              </div>
              <div className="mt-1.5 text-sm text-[#8a7f72] font-mono break-all">
                {siteUrl.replace(/^https?:\/\//, "")}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Credits */}
        <div className="mt-16 md:mt-20 text-center text-xs tracking-widest uppercase text-[#8a7f72] space-y-1.5">
          <div>LUXUS PAINT × RoomDreaming × 可塗設計</div>
          <div>共同出品 · 2026 · 說明會版 v0.1</div>
        </div>
      </section>

      <PageNav currentHref={HREF} />
    </CockpitLayout>
  );
}
