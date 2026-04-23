"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CockpitLayout } from "@/components/cockpit-layout";
import { PageNav } from "@/components/page-nav";
import { getPageByHref } from "@/lib/pages";
import { VideoEmbed } from "@/components/video-embed";

const HREF = "/flow";

type Step = {
  num: "1" | "2" | "3";
  en: string;
  zh: string;
  desc: string;
  bullets: string[];
  jumpHref?: string;
  jumpLabel?: string;
  tint: string;
};

const STEPS: Step[] = [
  {
    num: "1",
    en: "Input",
    zh: "輸入",
    desc: "選一張空間照",
    bullets: [
      "客戶現場自拍 / 自家手機",
      "門市建議預設空間照",
      "拍攝指引看過就能拍對",
    ],
    jumpHref: "/photo-guide",
    jumpLabel: "看拍攝指引",
    tint: "from-[#d9c9b3] to-[#c9a882]",
  },
  {
    num: "2",
    en: "Design",
    zh: "設計",
    desc: "選色、比較、AI 推薦",
    bullets: [
      "LUXUS 色票牆直接點",
      "A / B 兩色拉桿對比",
      "AI 依關鍵字推薦",
    ],
    jumpHref: "/colors",
    jumpLabel: "進色票",
    tint: "from-[#c9a882] to-[#8a6b3f]",
  },
  {
    num: "3",
    en: "Output",
    zh: "輸出",
    desc: "存檔、分享、收名單",
    bullets: [
      "存高解析空間圖",
      "一鍵分享到客戶 LINE",
      "自動收集聯絡資訊",
    ],
    jumpHref: "/end",
    jumpLabel: "看結尾",
    tint: "from-[#8a6b3f] to-[#4a463f]",
  },
];

export default function FlowPage() {
  const page = getPageByHref(HREF)!;

  return (
    <CockpitLayout currentHref={HREF}>
      <section className="flex-1 px-6 md:px-12 py-16 md:py-20 max-w-[1400px] mx-auto w-full">
        <div className="mb-10 md:mb-14 text-center md:text-left">
          <div className="text-xs tracking-[0.4em] uppercase text-[#8a7f72] mb-4">
            {page.pdfPage} · {page.tag}
          </div>
          <h1 className="font-[family-name:var(--font-serif-tc)] text-[clamp(2rem,4vw,3.75rem)] leading-[1.2] font-medium tracking-tight max-w-4xl">
            AI 的出現，
            <span className="text-[#8a6b3f]">讓夢想工具成真。</span>
          </h1>
          <p className="mt-6 text-lg text-[#4a463f] max-w-2xl leading-[1.9]">
            下面是示範影片。
          </p>
        </div>

        {/* 影片先登場（證據） */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 md:mb-20"
        >
          <VideoEmbed src="/video/roomdreaming-demo.mp4" />
        </motion.div>

        {/* 三步驟 — 影片底下 */}
        <div className="mb-8 md:mb-10 text-center md:text-left">
          <div className="text-xs tracking-[0.4em] uppercase text-[#8a7f72] mb-3">
            影片下面
          </div>
          <h2 className="font-[family-name:var(--font-serif-tc)] text-3xl md:text-4xl font-medium tracking-tight">
            三步驟，
            <span className="text-[#8a6b3f]">顏色隨你貼。</span>
          </h2>
        </div>

        {/* Flow timeline */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3">
          {/* connecting line (desktop) */}
          <div
            className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-[#d9c9b3] via-[#8a6b3f] to-[#4a463f] -z-0"
            aria-hidden
          />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center px-3 md:px-6"
            >
              {/* circular step */}
              <div
                className={`w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br ${s.tint} flex flex-col items-center justify-center shadow-xl shadow-[#8a6b3f]/20 mb-6 ring-8 ring-[#f7f3ee]`}
              >
                <div className="text-[11px] tracking-[0.3em] uppercase text-white/80">
                  Step {s.num}
                </div>
                <div className="font-[family-name:var(--font-serif-tc)] text-3xl md:text-4xl font-medium text-white mt-1">
                  {s.zh}
                </div>
                <div className="text-xs uppercase tracking-widest text-white/70 mt-0.5">
                  {s.en}
                </div>
              </div>

              <h3 className="text-xl font-medium mb-3">{s.desc}</h3>

              <ul className="space-y-2 text-sm text-[#4a463f] mb-6">
                {s.bullets.map((b) => (
                  <li key={b} className="leading-relaxed">
                    {b}
                  </li>
                ))}
              </ul>

              {s.jumpHref && (
                <Link
                  href={s.jumpHref}
                  className="inline-flex items-center gap-2 text-sm text-[#8a6b3f] hover:text-[#1b1a17] transition group"
                >
                  {s.jumpLabel}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* 30s promise banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-12 md:mt-16 p-8 md:p-10 rounded-3xl bg-gradient-to-r from-[#1b1a17] to-[#4a463f] text-center"
        >
          <div className="text-xs tracking-[0.4em] uppercase text-[#c9a882] mb-3">
            Total
          </div>
          <div className="font-[family-name:var(--font-serif-tc)] text-4xl md:text-5xl font-medium text-[#f7f3ee]">
            30 秒 · 從選色到成交
          </div>
          <p className="mt-4 text-[#d9c9b3] text-sm md:text-base max-w-xl mx-auto">
            不是「看色卡 → 想 → 再看 → 還是不確定」的那種三週流程。
          </p>
        </motion.div>
      </section>

      <PageNav currentHref={HREF} />
    </CockpitLayout>
  );
}
