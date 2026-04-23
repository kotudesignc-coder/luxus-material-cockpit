"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
} from "react-compare-slider";
import { motion, AnimatePresence } from "framer-motion";
import { CockpitLayout } from "@/components/cockpit-layout";
import { PageNav } from "@/components/page-nav";
import { getPageByHref } from "@/lib/pages";

const HREF = "/ab";

/**
 * 兩張同構圖、同傢俱、只有主牆色不同的 LUXUS 實拍照。
 * 作為拉桿的 itemOne / itemTwo — 讓觀眾直接比對真實空間感受。
 */
type WallOption = {
  src: string;
  alt: string;
  code: string;
  nameZh: string;
  nameEn: string;
  mood: string;
};

const LEFT: WallOption = {
  src: "/custom/ab-wall-green.jpg",
  alt: "LUXUS 深綠松石色主牆搭配灰色沙發",
  code: "PETHRA·森綠",
  nameZh: "墨林青",
  nameEn: "Forest Ink",
  mood: "沉穩、內斂、有自然氣息",
};

const RIGHT: WallOption = {
  src: "/custom/ab-wall-terracotta.jpg",
  alt: "LUXUS 赤陶紅褐色主牆搭配灰色沙發",
  code: "TACTO·赤陶",
  nameZh: "侘寂橘",
  nameEn: "Wabi Apricot",
  mood: "溫暖、踏實、有土地氣息",
};

function WallPanel({
  wall,
  label,
  labelPosition,
}: {
  wall: WallOption;
  label: "A" | "B";
  labelPosition: "left" | "right";
}) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={wall.src}
        alt={wall.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />

      {/* big A / B watermark */}
      <div
        className={`absolute top-4 md:top-6 ${
          labelPosition === "left" ? "left-4 md:left-6" : "right-4 md:right-6"
        } font-[family-name:var(--font-serif-tc)] text-[6rem] md:text-[8rem] leading-none text-white/40 select-none drop-shadow-lg`}
      >
        {label}
      </div>

      {/* color chip */}
      <div
        className={`absolute bottom-4 md:bottom-5 ${
          labelPosition === "left" ? "left-4 md:left-5" : "right-4 md:right-5"
        } flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur shadow-lg`}
      >
        <span className="text-xs font-medium tracking-wider">{wall.code}</span>
        <span className="text-xs text-[#8a7f72]">{wall.nameZh}</span>
      </div>
    </div>
  );
}

export default function ABPage() {
  const page = getPageByHref(HREF)!;

  // 「拖拖看」浮動提示：4 秒後消失，或觀眾一碰就消失
  const [hintVisible, setHintVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <CockpitLayout currentHref={HREF}>
      <section className="flex-1 px-6 md:px-12 py-16 md:py-20 max-w-[1400px] mx-auto w-full">
        <div className="mb-10 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs tracking-[0.4em] uppercase text-[#8a7f72]">
              {page.pdfPage} · {page.tag}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#8a6b3f] border border-[#8a6b3f] rounded-full px-2.5 py-0.5">
              核心
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-serif-tc)] text-[clamp(2rem,4vw,3.75rem)] leading-[1.2] font-medium tracking-tight max-w-3xl">
            同一個空間，
            <span className="text-[#8a6b3f]">兩種表情。</span>
          </h1>
          <p className="mt-6 text-lg text-[#4a463f] max-w-2xl leading-[1.9]">
            A 是墨林青的沉，B 是侘寂橘的暖。
            客戶講不清楚的差別，拉一下就懂 — 選色不是講道理，是看感覺。
          </p>
        </div>

        {/* A/B slider */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl overflow-hidden shadow-2xl shadow-[#8a6b3f]/15 border border-[#1b1a17]/5"
        >
          <div
            className="relative aspect-[16/9] w-full"
            onPointerDown={() => setHintVisible(false)}
          >
            <ReactCompareSlider
              itemOne={<WallPanel wall={LEFT} label="A" labelPosition="left" />}
              itemTwo={
                <WallPanel wall={RIGHT} label="B" labelPosition="right" />
              }
              handle={
                <ReactCompareSliderHandle
                  buttonStyle={{
                    backdropFilter: "blur(8px)",
                    background: "rgba(255,255,255,0.95)",
                    border: "0",
                    color: "#8a6b3f",
                    boxShadow: "0 2px 16px rgba(27,26,23,0.25)",
                  }}
                  linesStyle={{ background: "rgba(255,255,255,0.9)" }}
                />
              }
              style={{
                position: "absolute",
                inset: 0,
                height: "100%",
                width: "100%",
              }}
            />

            {/* 「拖拖看」浮動提示 */}
            <AnimatePresence>
              {hintVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-x-0 top-1/2 -translate-y-[calc(50%+3rem)] flex justify-center pointer-events-none z-20"
                >
                  <motion.div
                    animate={{ x: [0, 14, -14, 14, -14, 0] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1b1a17]/85 text-[#f7f3ee] text-sm backdrop-blur shadow-lg"
                  >
                    <span className="text-base">←</span>
                    <span className="tracking-wider">拖拖看</span>
                    <span className="text-base">→</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 兩色介紹卡（取代原本的色票網格） */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {[
            { wall: LEFT, label: "A" },
            { wall: RIGHT, label: "B" },
          ].map(({ wall, label }) => (
            <div
              key={label}
              className="flex items-start gap-5 p-6 rounded-2xl bg-white/70 border border-[#1b1a17]/10"
            >
              <div className="font-[family-name:var(--font-serif-tc)] text-5xl font-medium text-[#8a6b3f] leading-none flex-shrink-0">
                {label}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-[family-name:var(--font-serif-tc)] text-xl font-medium">
                    {wall.nameZh}
                  </span>
                  <span className="text-sm text-[#8a7f72]">
                    {wall.nameEn}
                  </span>
                </div>
                <div className="mt-1.5 text-xs text-[#8a7f72] tracking-widest uppercase">
                  {wall.code}
                </div>
                <div className="mt-3 text-sm text-[#4a463f] leading-relaxed">
                  {wall.mood}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* presenter talk-track */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-10 md:mt-12 p-6 md:p-8 rounded-2xl bg-[#1b1a17] text-[#f7f3ee]"
        >
          <div className="text-xs tracking-[0.4em] uppercase text-[#c9a882] mb-3">
            現場話術
          </div>
          <p className="font-[family-name:var(--font-serif-tc)] text-xl md:text-2xl leading-relaxed">
            「A 是
            <span className="text-[#c9a882]">{LEFT.nameZh}</span>，森林的那種沉；
            B 是
            <span className="text-[#c9a882]">{RIGHT.nameZh}</span>，土地的那種暖。
            <br />
            您的家，想要哪一種氛圍？」
          </p>
        </motion.div>

        {/* footnote about limitation */}
        <p className="mt-6 text-xs text-[#8a7f72] leading-relaxed">
          說明會展示版本採兩張固定空間照對照；實際產品可由 RoomDreaming
          即時生成任意 LUXUS 色號在您提供的空間照上。
        </p>
      </section>

      <PageNav currentHref={HREF} />
    </CockpitLayout>
  );
}
