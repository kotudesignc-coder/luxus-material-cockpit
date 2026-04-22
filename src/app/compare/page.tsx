"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
} from "react-compare-slider";
import { motion } from "framer-motion";
import { CockpitLayout } from "@/components/cockpit-layout";
import { PageNav } from "@/components/page-nav";
import { getPageByHref } from "@/lib/pages";

const HREF = "/compare";

function TraditionalPanel() {
  return (
    <div className="relative w-full h-full bg-[#e9e1d3] overflow-hidden flex items-center justify-center">
      {/* scattered color swatches */}
      <div className="absolute inset-0 opacity-90">
        <div className="absolute top-[12%] left-[10%] w-28 h-40 bg-[#c9a882] rotate-[-12deg] shadow-lg" />
        <div className="absolute top-[20%] left-[28%] w-24 h-36 bg-[#8a7f72] rotate-[6deg] shadow-lg" />
        <div className="absolute top-[8%] right-[22%] w-32 h-44 bg-[#d9c9b3] rotate-[14deg] shadow-lg" />
        <div className="absolute bottom-[18%] left-[15%] w-28 h-40 bg-[#6e5233] rotate-[8deg] shadow-lg" />
        <div className="absolute bottom-[14%] right-[10%] w-32 h-44 bg-[#8a6b3f] rotate-[-10deg] shadow-lg" />
        <div className="absolute bottom-[28%] right-[34%] w-24 h-36 bg-[#4a463f] rotate-[3deg] shadow-lg" />
      </div>
      {/* overlay label */}
      <div className="relative z-10 text-center px-8">
        <div className="text-[10px] md:text-xs tracking-[0.45em] uppercase text-[#1b1a17]/60 mb-3">
          Before
        </div>
        <h3 className="font-[family-name:var(--font-serif-tc)] text-4xl md:text-5xl font-medium text-[#1b1a17]">
          傳統模式
        </h3>
        <p className="mt-3 text-base md:text-lg text-[#4a463f]">
          翻樣品 · 看色卡 · 靠想像
        </p>
      </div>
      {/* bottom hint */}
      <div className="absolute bottom-5 left-0 right-0 text-center text-[11px] tracking-widest uppercase text-[#1b1a17]/50">
        「大概就是這個顏色吧⋯⋯」
      </div>
    </div>
  );
}

function AIPanel() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#8a6b3f] via-[#c9a882] to-[#e9dcc5] overflow-hidden flex items-center justify-center">
      {/* stylized iPad mockup in the warmed space */}
      <div className="absolute inset-0 opacity-85">
        {/* warm wall wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#8a6b3f]/20 to-[#c9a882]/30" />
      </div>

      <div className="relative z-10 w-[62%] max-w-[340px] aspect-[3/4] bg-[#1b1a17] rounded-[28px] p-2 shadow-2xl shadow-black/30">
        <div className="w-full h-full rounded-[22px] bg-[#f7f3ee] overflow-hidden flex flex-col">
          {/* preview top: space */}
          <div className="flex-1 bg-gradient-to-br from-[#c9a882] via-[#8a6b3f] to-[#6e5233] relative">
            <div className="absolute top-3 left-3 right-3 h-2 rounded-full bg-white/30" />
            <div className="absolute inset-x-6 bottom-6 top-12 rounded-lg bg-gradient-to-t from-black/10 to-transparent" />
          </div>
          {/* palette row */}
          <div className="flex gap-1.5 p-3">
            <div className="flex-1 h-8 rounded bg-[#d9c9b3]" />
            <div className="flex-1 h-8 rounded bg-[#c9a882] ring-2 ring-[#1b1a17]" />
            <div className="flex-1 h-8 rounded bg-[#8a6b3f]" />
            <div className="flex-1 h-8 rounded bg-[#6e5233]" />
          </div>
        </div>
      </div>

      {/* label pill */}
      <div className="absolute top-8 right-8 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur text-[11px] tracking-widest uppercase text-[#1b1a17]">
        After · AI 選材
      </div>

      <div className="absolute bottom-5 left-0 right-0 text-center text-[11px] tracking-widest uppercase text-[#f7f3ee]/90">
        「這個顏色鋪上去，就是這樣」
      </div>
    </div>
  );
}

export default function ComparePage() {
  const page = getPageByHref(HREF)!;

  return (
    <CockpitLayout currentHref={HREF}>
      <section className="flex-1 px-6 md:px-12 py-16 md:py-20 max-w-[1400px] mx-auto w-full">
        <div className="mb-10 md:mb-14">
          <div className="text-xs tracking-[0.4em] uppercase text-[#8a7f72] mb-4">
            {page.pdfPage} · {page.tag}
          </div>
          <h1 className="font-[family-name:var(--font-serif-tc)] text-[clamp(2rem,4vw,3.75rem)] leading-[1.2] font-medium tracking-tight max-w-3xl">
            看樣品，還是
            <span className="text-[#8a6b3f]">看真的？</span>
          </h1>
          <p className="mt-6 text-lg text-[#4a463f] max-w-2xl leading-[1.9]">
            把中間的拉桿左右滑動 — 同樣一個客戶、同樣一面牆、同樣一個想要的「溫暖米色」，
            兩種選材流程走出來，差距就在這。
          </p>
        </div>

        {/* The compare slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-3xl overflow-hidden shadow-2xl shadow-[#8a6b3f]/15 border border-[#1b1a17]/5"
        >
          <div className="relative aspect-[16/9] w-full">
            <ReactCompareSlider
              itemOne={<TraditionalPanel />}
              itemTwo={<AIPanel />}
              handle={
                <ReactCompareSliderHandle
                  buttonStyle={{
                    backdropFilter: "blur(8px)",
                    background: "rgba(255,255,255,0.95)",
                    border: "0",
                    color: "#8a6b3f",
                    boxShadow: "0 2px 16px rgba(27,26,23,0.25)",
                  }}
                  linesStyle={{ background: "rgba(255,255,255,0.85)" }}
                />
              }
            />
          </div>
        </motion.div>

        {/* diff table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1b1a17]/10 rounded-2xl overflow-hidden border border-[#1b1a17]/10"
        >
          {[
            { k: "決策時間", a: "1–3 週", b: "30 秒", highlight: "×180" },
            { k: "客戶信心", a: "靠口才", b: "眼見為憑", highlight: "直接" },
            { k: "改色成本", a: "重新提案", b: "再點一下", highlight: "零摩擦" },
          ].map((row) => (
            <div key={row.k} className="bg-[#f7f3ee] p-6 md:p-7 flex flex-col gap-3">
              <div className="text-xs tracking-widest uppercase text-[#8a7f72]">
                {row.k}
              </div>
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#8a7f72] mb-1">
                    傳統
                  </div>
                  <div className="text-lg md:text-xl font-medium text-[#4a463f] line-through decoration-[#8a6b3f]/30">
                    {row.a}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#8a6b3f] mb-1">
                    AI
                  </div>
                  <div className="font-[family-name:var(--font-serif-tc)] text-2xl md:text-3xl font-medium text-[#1b1a17]">
                    {row.b}
                  </div>
                </div>
              </div>
              <div className="mt-2 self-start px-2.5 py-1 rounded-full bg-[#8a6b3f]/10 text-[11px] tracking-wider uppercase text-[#8a6b3f]">
                {row.highlight}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      <PageNav currentHref={HREF} />
    </CockpitLayout>
  );
}
