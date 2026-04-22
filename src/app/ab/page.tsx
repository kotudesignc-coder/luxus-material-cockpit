"use client";

import { useState, useMemo } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
} from "react-compare-slider";
import { motion } from "framer-motion";
import { CockpitLayout } from "@/components/cockpit-layout";
import { PageNav } from "@/components/page-nav";
import { getPageByHref } from "@/lib/pages";
import { COLORS, type Color } from "@/lib/colors";

const HREF = "/ab";

/**
 * 用純色 + 空間剪影 mock 的房間牆面（AB 用同一套結構，只換主牆色）
 */
function MockRoom({
  color,
  label,
  labelPosition = "left",
}: {
  color: Color;
  label: "A" | "B";
  labelPosition?: "left" | "right";
}) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: color.hex }}>
      {/* top natural light wash */}
      <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

      {/* window */}
      <div className="absolute top-[14%] right-[10%] w-[26%] h-[32%] bg-white/25 rounded-sm ring-8 ring-white/8">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
      </div>

      {/* baseboard */}
      <div className="absolute bottom-[24%] left-0 right-0 h-[1.5px] bg-black/10" />

      {/* floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[24%] bg-gradient-to-b from-[#8a6b3f]/25 to-[#4a463f]/45" />

      {/* sofa */}
      <div className="absolute bottom-[22%] left-[14%] right-[18%] h-[32%]">
        <div className="absolute bottom-0 inset-x-0 h-[55%] bg-black/20 rounded-xl backdrop-blur-sm" />
        <div className="absolute bottom-[55%] inset-x-4 h-[45%] bg-black/15 rounded-t-xl" />
      </div>

      {/* big A/B letter watermark */}
      <div
        className={`absolute top-6 ${labelPosition === "left" ? "left-6" : "right-6"} font-[family-name:var(--font-serif-tc)] text-[8rem] leading-none text-white/30 select-none`}
      >
        {label}
      </div>

      {/* color chip */}
      <div
        className={`absolute bottom-5 ${labelPosition === "left" ? "left-5" : "right-5"} flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur shadow-lg`}
      >
        <span
          className="w-4 h-4 rounded-full ring-1 ring-black/10"
          style={{ background: color.hex }}
        />
        <span className="text-xs font-medium">{color.code}</span>
        <span className="text-xs text-[#8a7f72]">{color.nameZh}</span>
      </div>
    </div>
  );
}

export default function ABPage() {
  const page = getPageByHref(HREF)!;

  // 預設 A / B：暖調 vs 冷調對比
  const [colorAId, setColorAId] = useState<string>("pethra-a1"); // 佩特拉紅金
  const [colorBId, setColorBId] = useState<string>("cemento-2500"); // 聖馬托冷灰
  const [picking, setPicking] = useState<"A" | "B">("A");

  const colorA = useMemo(
    () => COLORS.find((c) => c.id === colorAId) ?? COLORS[0],
    [colorAId],
  );
  const colorB = useMemo(
    () => COLORS.find((c) => c.id === colorBId) ?? COLORS[1],
    [colorBId],
  );

  function selectColor(id: string) {
    if (picking === "A") setColorAId(id);
    else setColorBId(id);
  }

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
            <span className="text-[#8a6b3f]">兩個顏色</span>放在同一個空間，
            <br className="hidden md:block" />
            拉一下就知道哪個對。
          </h1>
          <p className="mt-6 text-lg text-[#4a463f] max-w-2xl leading-[1.9]">
            客戶猶豫時的殺手鐧。不用請他腦內模擬 —
            左右兩色同步呈現，拉桿滑過去，決定 3 秒內下。
          </p>
        </div>

        {/* A/B slider */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl overflow-hidden shadow-2xl shadow-[#8a6b3f]/15 border border-[#1b1a17]/5"
        >
          <div className="relative aspect-[16/9] w-full">
            <ReactCompareSlider
              itemOne={<MockRoom color={colorA} label="A" labelPosition="left" />}
              itemTwo={<MockRoom color={colorB} label="B" labelPosition="right" />}
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
          </div>
        </motion.div>

        {/* Color picker row */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 md:gap-8">
          {/* A / B toggle */}
          <div className="flex flex-col gap-3">
            <div className="text-xs tracking-[0.4em] uppercase text-[#8a7f72]">
              正在挑
            </div>
            <div className="flex gap-2">
              {(["A", "B"] as const).map((k) => {
                const isActive = picking === k;
                const c = k === "A" ? colorA : colorB;
                return (
                  <button
                    key={k}
                    onClick={() => setPicking(k)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition ${
                      isActive
                        ? "border-[#1b1a17] bg-white"
                        : "border-[#1b1a17]/10 bg-white/40 hover:bg-white/70"
                    }`}
                  >
                    <span className="font-[family-name:var(--font-serif-tc)] text-2xl font-medium">
                      {k}
                    </span>
                    <span
                      className="w-8 h-8 rounded-lg ring-1 ring-black/10"
                      style={{ background: c.hex }}
                    />
                    <span className="flex flex-col items-start">
                      <span className="text-xs text-[#8a7f72] tracking-widest uppercase">
                        {c.code}
                      </span>
                      <span className="text-sm font-medium">{c.nameZh}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* palette grid */}
          <div className="flex flex-col gap-3">
            <div className="text-xs tracking-[0.4em] uppercase text-[#8a7f72]">
              點色票換{picking}色
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {COLORS.map((c) => {
                const isAActive = c.id === colorAId;
                const isBActive = c.id === colorBId;
                const isActive =
                  (picking === "A" && isAActive) ||
                  (picking === "B" && isBActive);
                return (
                  <button
                    key={c.id}
                    onClick={() => selectColor(c.id)}
                    className={`relative aspect-square rounded-lg transition outline-none ${
                      isActive
                        ? "ring-2 ring-[#1b1a17] ring-offset-2 ring-offset-[#f7f3ee] scale-105"
                        : "hover:scale-105"
                    }`}
                    style={{ background: c.hex }}
                    aria-label={`${c.nameZh} ${c.code}`}
                  >
                    {/* show A or B marker if it's the current selection of the other slot */}
                    {(isAActive || isBActive) && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1b1a17] text-white text-[10px] font-bold flex items-center justify-center shadow">
                        {isAActive ? "A" : "B"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* presenter talk-track */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-12 p-6 md:p-8 rounded-2xl bg-[#1b1a17] text-[#f7f3ee]"
        >
          <div className="text-xs tracking-[0.4em] uppercase text-[#c9a882] mb-3">
            現場話術
          </div>
          <p className="font-[family-name:var(--font-serif-tc)] text-xl md:text-2xl leading-relaxed">
            「您看這兩個顏色，<span className="text-[#c9a882]">{colorA.nameZh}</span>{" "}
            比較{" "}
            {colorA.mood[0] ?? "沉穩"}，
            <span className="text-[#c9a882]">{colorB.nameZh}</span> 比較{" "}
            {colorB.mood[0] ?? "明亮"}。
            <br />
            您覺得哪個更像您想要的家的感覺？」
          </p>
        </motion.div>
      </section>

      <PageNav currentHref={HREF} />
    </CockpitLayout>
  );
}
