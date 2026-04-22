"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CockpitLayout } from "@/components/cockpit-layout";
import { PageNav } from "@/components/page-nav";
import { getPageByHref } from "@/lib/pages";
import { COLORS } from "@/lib/colors";

const HREF = "/recommend";

/** 從 COLORS.mood 聚出的關鍵字集合（去重） */
const ALL_MOODS = Array.from(new Set(COLORS.flatMap((c) => c.mood)));

/** 常見氛圍分組，讓 UI 不要散亂 */
const MOOD_GROUPS: { title: string; tags: string[] }[] = [
  { title: "溫度", tags: ["溫暖", "溫潤", "柔和", "冷色", "現代", "都會"] },
  { title: "風格", tags: ["侘寂", "日系", "北歐", "奢華", "質樸", "優雅", "戲劇"] },
  { title: "彩度", tags: ["明亮", "沉穩", "低彩度", "深邃"] },
  { title: "質感", tags: ["石材", "珠光", "金屬", "鐵鏽", "紅金", "土地", "星點"] },
];

export default function RecommendPage() {
  const page = getPageByHref(HREF)!;

  const [picked, setPicked] = useState<Set<string>>(new Set());

  function toggle(tag: string) {
    const next = new Set(picked);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setPicked(next);
  }

  /** 依照勾選關鍵字過濾色票，按「命中數」排序 */
  const ranked = useMemo(() => {
    if (picked.size === 0) return [];
    return COLORS
      .map((c) => {
        const hits = c.mood.filter((m) => picked.has(m)).length;
        return { color: c, hits };
      })
      .filter((x) => x.hits > 0)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 3);
  }, [picked]);

  return (
    <CockpitLayout currentHref={HREF}>
      <section className="flex-1 px-6 md:px-12 py-16 md:py-20 max-w-[1400px] mx-auto w-full">
        <div className="mb-10 md:mb-14">
          <div className="text-xs tracking-[0.4em] uppercase text-[#8a7f72] mb-4">
            {page.pdfPage} · {page.tag}
          </div>
          <h1 className="font-[family-name:var(--font-serif-tc)] text-[clamp(2rem,4vw,3.75rem)] leading-[1.2] font-medium tracking-tight max-w-3xl">
            選不出來？
            <br className="hidden md:block" />
            <span className="text-[#8a6b3f]">告訴 AI 你想要的感覺。</span>
          </h1>
          <p className="mt-6 text-lg text-[#4a463f] max-w-2xl leading-[1.9]">
            客戶通常講不出色號，只會說「想要溫暖一點」「有點侘寂感」。
            勾幾個關鍵字，AI 從 LUXUS 200+ 色票裡直接篩給你 3 個最貼的。
          </p>
        </div>

        {/* Mood picker */}
        <div className="space-y-6">
          {MOOD_GROUPS.map((g) => (
            <div key={g.title}>
              <div className="text-xs tracking-[0.3em] uppercase text-[#8a7f72] mb-3">
                {g.title}
              </div>
              <div className="flex flex-wrap gap-2">
                {g.tags
                  .filter((t) => ALL_MOODS.includes(t))
                  .map((tag) => {
                    const isPicked = picked.has(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggle(tag)}
                        className={`px-4 py-2 rounded-full text-sm transition ${
                          isPicked
                            ? "bg-[#1b1a17] text-[#f7f3ee] scale-105"
                            : "bg-white/60 text-[#4a463f] hover:bg-white border border-[#1b1a17]/10"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Funnel visual */}
        <div className="mt-14 md:mt-16 flex flex-col items-center">
          <svg
            width="260"
            height="140"
            viewBox="0 0 260 140"
            className="text-[#8a6b3f]"
            aria-hidden
          >
            <defs>
              <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d9c9b3" />
                <stop offset="100%" stopColor="#6e5233" />
              </linearGradient>
            </defs>
            <path
              d="M 20 10 L 240 10 L 170 80 L 170 125 L 90 125 L 90 80 Z"
              fill="url(#fg)"
              opacity="0.85"
            />
            {/* top dots (many colors) */}
            {[...Array(12)].map((_, i) => (
              <circle
                key={i}
                cx={30 + i * 18}
                cy={22 + (i % 3) * 6}
                r="4"
                fill="#1b1a17"
                opacity={0.35 + (i % 3) * 0.15}
              />
            ))}
            {/* bottom → arrow */}
            <path
              d="M 130 128 L 130 138 M 120 133 L 130 140 L 140 133"
              stroke="#1b1a17"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <div className="mt-3 text-xs tracking-widest uppercase text-[#8a7f72]">
            {picked.size === 0
              ? "從上方勾幾個關鍵字開始"
              : `已選 ${picked.size} 個條件 · 收斂到 ${ranked.length} 個推薦色`}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-10 md:mt-12">
          <AnimatePresence mode="popLayout">
            {ranked.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                {ranked.map(({ color, hits }, i) => (
                  <motion.div
                    key={color.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative flex flex-col rounded-2xl overflow-hidden border border-[#1b1a17]/10 bg-white/70 backdrop-blur-sm"
                  >
                    <div
                      className="aspect-[4/3]"
                      style={{ background: color.hex }}
                    />
                    <div className="p-5 flex flex-col gap-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs tracking-widest uppercase text-[#8a6b3f]">
                          推薦 {i + 1} · 命中 {hits}
                        </span>
                        <span className="text-xs text-[#8a7f72]">
                          {color.series}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-[family-name:var(--font-serif-tc)] text-xl font-medium">
                          {color.nameZh}
                        </span>
                        <span className="text-sm text-[#8a7f72]">
                          {color.nameEn}
                        </span>
                      </div>
                      <div className="text-xs text-[#8a7f72] tracking-widest uppercase">
                        {color.code} · {color.hex.toUpperCase()}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {color.mood.map((m) => (
                          <span
                            key={m}
                            className={`text-[11px] px-2 py-0.5 rounded-full ${
                              picked.has(m)
                                ? "bg-[#1b1a17] text-[#f7f3ee]"
                                : "bg-[#8a6b3f]/10 text-[#8a6b3f]"
                            }`}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm text-[#8a7f72] py-8"
              >
                {picked.size === 0
                  ? "從上方勾關鍵字，漏斗就會開始幫你篩色"
                  : "目前勾選沒有完全命中的色 — 減少條件試試"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <PageNav currentHref={HREF} />
    </CockpitLayout>
  );
}
