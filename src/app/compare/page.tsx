"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
} from "react-compare-slider";
import Image from "next/image";
import { motion } from "framer-motion";
import { CockpitLayout } from "@/components/cockpit-layout";
import { PageNav } from "@/components/page-nav";
import { getPageByHref } from "@/lib/pages";

const HREF = "/compare";

function TraditionalPanel() {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* real photo of scattered swatches */}
      <Image
        src="/pdf-assets/pain-traditional-swatches.png"
        alt="桌上散落的紙色卡與樣品 — 傳統選色方式"
        fill
        className="object-cover grayscale-[0.1]"
        sizes="50vw"
      />
      {/* darken for readable label */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1b1a17]/45 via-[#1b1a17]/15 to-[#1b1a17]/5" />

      {/* overlay label */}
      <div className="relative z-10 text-center px-8">
        <div className="text-[10px] md:text-xs tracking-[0.45em] uppercase text-white/80 mb-3">
          Before
        </div>
        <h3 className="font-[family-name:var(--font-serif-tc)] text-4xl md:text-5xl font-medium text-white drop-shadow-lg">
          選樣
        </h3>
        <p className="mt-3 text-base md:text-lg text-white/90">
          翻樣品 · 看色卡 · 靠想像
        </p>
      </div>
      {/* bottom hint */}
      <div className="absolute bottom-5 left-0 right-0 text-center text-[11px] tracking-widest uppercase text-white/70">
        「大概就是這個顏色吧⋯⋯」
      </div>
    </div>
  );
}

function AIPanel() {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#e8dfd1]">
      {/* LUXUS PETHRA 月亮雕塑牆案場 — 設計師夢寐以求的渲圖效果 */}
      <Image
        src="/luxus/compare-after-pethra.jpg"
        alt="LUXUS PETHRA 案場：米色塗料牆面 + 月亮雕塑 + 曲面沙發"
        fill
        className="object-cover"
        sizes="50vw"
      />
      {/* subtle overlay for label readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

      {/* label pill */}
      <div className="absolute top-8 right-8 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur text-[11px] tracking-widest uppercase text-[#1b1a17] shadow-lg">
        After · 感受空間
      </div>

      <div className="absolute bottom-5 left-0 right-0 text-center text-[11px] tracking-widest uppercase text-white drop-shadow">
        「就是這個感覺」
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
            選樣，還是
            <span className="text-[#8a6b3f]">選空間！</span>
          </h1>
          <p className="mt-6 text-lg text-[#4a463f] max-w-2xl leading-[1.9]">
            拉動中間 — 左邊是客戶手上那疊樣品，
            右邊是過去設計師拚命渲圖才能給客戶看到的空間感。
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
              // 預設拉桿偏右（85%）→「選樣」黑白樣品佔畫面 85%，
              // 右側露 15% 彩色空間當鉤子，引導觀眾拖動揭示完整空間。
              defaultPosition={85}
              style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
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
            { k: "出圖時間", a: "渲圖 1–3 天", b: "AI 30 秒", highlight: "×8640" },
            { k: "客戶信心", a: "靠口才說服", b: "眼見為憑", highlight: "直接" },
            { k: "改色成本", a: "重新渲染", b: "點一下", highlight: "零摩擦" },
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
