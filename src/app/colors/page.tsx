"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CockpitLayout } from "@/components/cockpit-layout";
import { PageNav } from "@/components/page-nav";
import { getPageByHref } from "@/lib/pages";
import { COLORS, FAMILIES, ROOMS, type Color } from "@/lib/colors-mock";

const HREF = "/colors";

/**
 * 空間預覽 — 目前用「主牆純色 + 地板漸層 + 傢俱剪影」mock 出 AI 貼色的效果。
 * 真空間照到位後，把 room.photoSrc 填進來，這個組件會切成照片 + 色彩疊加模式。
 */
function RoomPreview({
  color,
  room,
}: {
  color: Color;
  room: (typeof ROOMS)[number];
}) {
  return (
    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl shadow-[#8a6b3f]/15 border border-[#1b1a17]/5">
      {/* main wall — receives the selected color */}
      <motion.div
        key={color.hex}
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0"
        style={{ background: color.hex }}
      />

      {/* top natural light wash */}
      <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/25 to-transparent" />

      {/* window */}
      <div className="absolute top-[14%] right-[10%] w-[28%] h-[34%] bg-white/30 rounded-sm ring-8 ring-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent" />
      </div>

      {/* baseboard line */}
      <div className="absolute bottom-[24%] left-0 right-0 h-[1.5px] bg-black/10" />

      {/* floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[24%] bg-gradient-to-b from-[#8a6b3f]/25 to-[#4a463f]/45" />

      {/* sofa (living), bed (bed), island (kitchen) silhouette */}
      <div className="absolute bottom-[22%] left-[14%] right-[18%] h-[32%]">
        <div className="absolute bottom-0 inset-x-0 h-[55%] bg-black/20 rounded-xl backdrop-blur-sm" />
        <div className="absolute bottom-[55%] inset-x-4 h-[45%] bg-black/15 rounded-t-xl" />
      </div>

      {/* room label */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/85 backdrop-blur text-[11px] tracking-widest uppercase text-[#1b1a17]">
        {room.nameZh}
      </div>

      {/* color stamp */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur shadow-lg">
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

export default function ColorsPage() {
  const page = getPageByHref(HREF)!;

  const [activeFamily, setActiveFamily] = useState<Color["family"] | "all">(
    "all",
  );
  const [activeColorId, setActiveColorId] = useState<string>(COLORS[2].id); // N-03 原木米
  const [activeRoomId, setActiveRoomId] = useState<string>(ROOMS[0].id);

  const activeColor = useMemo(
    () => COLORS.find((c) => c.id === activeColorId) ?? COLORS[0],
    [activeColorId],
  );
  const activeRoom = useMemo(
    () => ROOMS.find((r) => r.id === activeRoomId) ?? ROOMS[0],
    [activeRoomId],
  );

  const visibleColors = useMemo(
    () =>
      activeFamily === "all"
        ? COLORS
        : COLORS.filter((c) => c.family === activeFamily),
    [activeFamily],
  );

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
            點一下色票，
            <span className="text-[#8a6b3f]">整個空間立刻換色。</span>
          </h1>
          <p className="mt-6 text-lg text-[#4a463f] max-w-2xl leading-[1.9]">
            從 LUXUS 色票牆直接選，右邊空間預覽即時跟著變。換房間、換色系、換氛圍 — 都只要 1 秒。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 md:gap-10 items-start">
          {/* LEFT: palette */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-6">
            {/* family tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFamily("all")}
                className={`px-4 py-1.5 rounded-full text-sm transition ${
                  activeFamily === "all"
                    ? "bg-[#1b1a17] text-[#f7f3ee]"
                    : "bg-white/60 text-[#4a463f] hover:bg-white"
                }`}
              >
                全部
              </button>
              {(Object.keys(FAMILIES) as (keyof typeof FAMILIES)[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFamily(f)}
                  className={`px-4 py-1.5 rounded-full text-sm transition ${
                    activeFamily === f
                      ? "bg-[#1b1a17] text-[#f7f3ee]"
                      : "bg-white/60 text-[#4a463f] hover:bg-white"
                  }`}
                >
                  {FAMILIES[f]}
                </button>
              ))}
            </div>

            {/* color grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
              {visibleColors.map((c) => {
                const isActive = c.id === activeColorId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveColorId(c.id)}
                    className={`group relative aspect-square rounded-lg transition outline-none ${
                      isActive
                        ? "ring-2 ring-[#1b1a17] ring-offset-2 ring-offset-[#f7f3ee] scale-105"
                        : "hover:scale-105"
                    }`}
                    style={{ background: c.hex }}
                    aria-label={`${c.nameZh} ${c.code}`}
                  >
                    <span className="sr-only">{c.nameZh}</span>
                  </button>
                );
              })}
            </div>

            {/* active color detail */}
            <motion.div
              key={activeColor.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-5 rounded-2xl bg-white/70 border border-[#1b1a17]/5"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 ring-1 ring-black/10"
                  style={{ background: activeColor.hex }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-[family-name:var(--font-serif-tc)] text-xl font-medium">
                      {activeColor.nameZh}
                    </span>
                    <span className="text-sm text-[#8a7f72]">
                      {activeColor.nameEn}
                    </span>
                  </div>
                  <div className="mt-1.5 text-xs text-[#8a7f72] tracking-widest uppercase">
                    {activeColor.code} · {activeColor.hex.toUpperCase()}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {activeColor.mood.map((m) => (
                      <span
                        key={m}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-[#8a6b3f]/10 text-[#8a6b3f]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: preview + room switcher */}
          <div className="flex flex-col gap-5">
            <RoomPreview color={activeColor} room={activeRoom} />

            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-[#8a7f72] mb-3">
                換個空間看看
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ROOMS.map((r) => {
                  const isActive = r.id === activeRoomId;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setActiveRoomId(r.id)}
                      className={`py-2 rounded-lg text-xs transition ${
                        isActive
                          ? "bg-[#1b1a17] text-[#f7f3ee]"
                          : "bg-white/60 text-[#4a463f] hover:bg-white"
                      }`}
                    >
                      {r.nameZh}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* talk-track for the presenter */}
            <div className="mt-3 p-4 rounded-xl bg-[#1b1a17]/5 text-sm text-[#4a463f] leading-relaxed">
              <span className="text-xs tracking-widest uppercase text-[#8a6b3f] mr-2">
                現場話術
              </span>
              「您看這個顏色鋪在{activeRoom.nameZh}裡，整體是不是比單看色票的時候更有感覺了？」
            </div>
          </div>
        </div>
      </section>

      <PageNav currentHref={HREF} />
    </CockpitLayout>
  );
}
