"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CockpitLayout } from "@/components/cockpit-layout";
import { PageNav } from "@/components/page-nav";
import { getPageByHref } from "@/lib/pages";
import { SOUTH_DEALERS } from "@/lib/dealers";

const HREF = "/dealers";

const CITY_TINT: Record<"台南" | "高雄", string> = {
  台南: "bg-[#8a6b3f]/10 text-[#8a6b3f]",
  高雄: "bg-[#3f5d7a]/10 text-[#3f5d7a]",
};

export default function DealersPage() {
  const page = getPageByHref(HREF)!;

  return (
    <CockpitLayout currentHref={HREF}>
      <section className="flex-1 px-6 md:px-12 py-16 md:py-20 max-w-[1400px] mx-auto w-full">
        <div className="mb-10 md:mb-14 text-center md:text-left">
          <div className="text-xs tracking-[0.4em] uppercase text-[#8a7f72] mb-4">
            {page.pdfPage} · {page.tag}
          </div>
          <h1 className="font-[family-name:var(--font-serif-tc)] text-[clamp(2rem,4vw,3.75rem)] leading-[1.2] font-medium tracking-tight max-w-3xl">
            南部選材夥伴，
            <br className="hidden md:block" />
            <span className="text-[#8a6b3f]">在你身邊。</span>
          </h1>
          <p className="mt-6 text-lg text-[#4a463f] max-w-2xl leading-[1.9]">
            掃下面任一張 QR，進入該經銷的 LUXUS AI 選材入口。
            選好顏色，他們會在 LINE 收到你的選材結果，立刻接手。
          </p>
        </div>

        {/* 4 張 QR 卡 — 2x2 grid（手機單欄） */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-3xl mx-auto">
          {SOUTH_DEALERS.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="group flex flex-col gap-4 p-5 md:p-6 rounded-3xl bg-white/70 border border-[#1b1a17]/10 hover:border-[#8a6b3f]/40 hover:shadow-xl hover:shadow-[#8a6b3f]/10 transition"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] tracking-[0.3em] uppercase px-2.5 py-1 rounded-full font-medium ${CITY_TINT[d.city]}`}
                >
                  {d.city}
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#8a7f72]">
                  LUXUS · 選材夥伴
                </span>
              </div>

              <div className="aspect-square w-full bg-white rounded-2xl flex items-center justify-center p-3 ring-1 ring-[#1b1a17]/5">
                <Image
                  src={d.qrSrc}
                  alt={`${d.name} LUXUS AI 選材 QR`}
                  width={400}
                  height={400}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-center">
                <div className="font-[family-name:var(--font-serif-tc)] text-xl md:text-2xl font-medium tracking-tight">
                  {d.name}
                </div>
                {d.tagline && (
                  <div className="mt-1 text-sm text-[#4a463f]">
                    {d.tagline}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-10 md:mt-12 text-center text-sm text-[#8a7f72] leading-relaxed"
        >
          QR 由 RoomDreaming 經銷後台產生，每家有獨立入口 ——
          <br className="hidden sm:block" />
          客戶選色完成後，業務手機 LINE 會直接收到完整選材紀錄。
        </motion.p>
      </section>

      <PageNav currentHref={HREF} />
    </CockpitLayout>
  );
}
