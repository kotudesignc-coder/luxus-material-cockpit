"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CockpitLayout } from "@/components/cockpit-layout";
import { PageNav } from "@/components/page-nav";
import { getPageByHref } from "@/lib/pages";
import { COLORS } from "@/lib/colors";

const HREF = "/recommend";

/**
 * 5 大氛圍合集 — 對齊 LUXUS 官網實際介面（溫暖舒適 / 冷靜沉穩 / 奢華精緻 / 質樸自然 / 明亮清爽）
 * 每個合集內部對應到 colors.ts 裡多個 mood tag，勾了就收斂相關色票。
 */
type MoodGroup = {
  id: string;
  label: string;
  /** 圓點顏色（chip 視覺 hint） */
  dotColor: string;
  /** 內部對應的 mood tags（colors.ts 的 mood 欄位） */
  moods: string[];
};

const MOOD_GROUPS: MoodGroup[] = [
  {
    id: "warm",
    label: "溫暖舒適",
    dotColor: "#C49073",
    moods: ["溫暖", "溫潤", "柔和"],
  },
  {
    id: "cool",
    label: "冷靜沉穩",
    dotColor: "#8A9299",
    moods: ["冷色", "沉穩", "低彩度", "都會"],
  },
  {
    id: "luxe",
    label: "奢華精緻",
    dotColor: "#C9A882",
    moods: ["奢華", "優雅", "金屬", "珠光", "紅金"],
  },
  {
    id: "natural",
    label: "質樸自然",
    dotColor: "#7E8B6D",
    moods: ["質樸", "土地", "侘寂", "石材", "鐵鏽"],
  },
  {
    id: "bright",
    label: "明亮清爽",
    dotColor: "#E8C9C0",
    moods: ["明亮", "北歐", "現代", "日系"],
  },
];

export default function RecommendPage() {
  const page = getPageByHref(HREF)!;

  /** 勾選的氛圍合集 id */
  const [picked, setPicked] = useState<Set<string>>(new Set());

  // 初次載入時從 URL ?mood=xxx 預先勾選（從 Hero / 其他入口跳進來時）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mood = params.get("mood");
    if (mood && MOOD_GROUPS.some((g) => g.id === mood)) {
      setPicked(new Set([mood]));
    }
  }, []);

  function toggle(groupId: string) {
    const next = new Set(picked);
    if (next.has(groupId)) next.delete(groupId);
    else next.add(groupId);
    setPicked(next);
  }

  /** 把勾選的合集展開成所有 mood tags 的聯集 */
  const activeMoods = useMemo(() => {
    const set = new Set<string>();
    MOOD_GROUPS.forEach((g) => {
      if (picked.has(g.id)) g.moods.forEach((m) => set.add(m));
    });
    return set;
  }, [picked]);

  /** 依照展開後的 mood 過濾色票，按命中數排序 */
  const ranked = useMemo(() => {
    if (activeMoods.size === 0) return [];
    return COLORS
      .map((c) => {
        const hits = c.mood.filter((m) => activeMoods.has(m)).length;
        return { color: c, hits };
      })
      .filter((x) => x.hits > 0)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 3);
  }, [activeMoods]);

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
            勾幾個氛圍，AI 從 LUXUS 200+ 色票裡直接篩給你 3 個最貼的。
          </p>
        </div>

        {/* Mood picker — 5 大氛圍合集（對齊 LUXUS 官網介面） */}
        <div className="flex flex-wrap gap-3 md:gap-4">
          {MOOD_GROUPS.map((g) => {
            const isPicked = picked.has(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggle(g.id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm md:text-base transition border ${
                  isPicked
                    ? "bg-[#1b1a17] text-[#f7f3ee] border-[#1b1a17] scale-105 shadow-lg"
                    : "bg-white/70 text-[#1b1a17] border-[#1b1a17]/15 hover:bg-white hover:border-[#8a6b3f]"
                }`}
                aria-pressed={isPicked}
              >
                <span
                  className={`w-3 h-3 rounded-full flex-shrink-0 ring-1 ${
                    isPicked ? "ring-white/30" : "ring-black/5"
                  }`}
                  style={{ background: g.dotColor }}
                />
                {g.label}
              </button>
            );
          })}
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
            {/* top dots — 用各 group 的色點 */}
            {MOOD_GROUPS.flatMap((g, gi) =>
              [0, 1].map((j) => (
                <circle
                  key={`${g.id}-${j}`}
                  cx={32 + gi * 36 + j * 12}
                  cy={20 + (j % 2) * 8}
                  r="5"
                  fill={g.dotColor}
                  opacity={picked.has(g.id) ? 1 : 0.4}
                />
              )),
            )}
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
              ? "勾幾個氛圍，漏斗就會幫你篩色"
              : `已選 ${picked.size} 個氛圍 · 收斂到 ${ranked.length} 個推薦色`}
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
                              activeMoods.has(m)
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
                  ? "從上方勾氛圍，漏斗就會開始幫你篩色"
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
