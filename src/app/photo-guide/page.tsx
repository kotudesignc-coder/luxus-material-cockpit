"use client";

import { motion } from "framer-motion";
import { CockpitLayout } from "@/components/cockpit-layout";
import { PageNav } from "@/components/page-nav";
import { getPageByHref } from "@/lib/pages";

const HREF = "/photo-guide";

const OK_POINTS = [
  { label: "光線充足", desc: "白天自然光或室內照明" },
  { label: "牆面完整", desc: "能看到完整牆面或地面" },
  { label: "相機水平", desc: "避免歪斜或魚眼效果" },
];

const NG_POINTS = [
  { label: "光線不足", desc: "過暗、過曝、背光" },
  { label: "雜物太多", desc: "家具填滿牆面" },
  { label: "空間太小", desc: "戶外、小於 1 坪空間" },
  { label: "結構不完整", desc: "只拍到一角" },
];

function OKFrame() {
  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#f5ecdf] via-[#e6d3b3] to-[#c9a882] shadow-lg">
      {/* warm sunlight stripe */}
      <div className="absolute top-0 left-0 right-0 h-[55%] bg-gradient-to-b from-white/30 to-transparent" />
      {/* floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-b from-[#8a6b3f]/15 to-[#6e5233]/25" />
      {/* baseboard */}
      <div className="absolute bottom-[25%] left-0 right-0 h-[2px] bg-[#8a6b3f]/30" />
      {/* sofa silhouette */}
      <div className="absolute bottom-[22%] left-[18%] right-[18%] h-[25%] bg-[#8a7f72]/30 rounded-xl" />
      <div className="absolute bottom-[22%] left-[18%] right-[18%] h-[35%] bg-[#8a7f72]/20 rounded-t-xl -translate-y-3" />
      {/* green OK badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#3f7a3f] text-white px-3 py-1.5 rounded-full text-xs tracking-widest uppercase shadow-lg">
        <span className="text-sm">✓</span> OK
      </div>
    </div>
  );
}

function NGFrame() {
  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a2723] via-[#1b1a17] to-[#0e0d0b] shadow-lg">
      {/* clutter hint */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-[20%] left-[10%] w-24 h-16 bg-[#4a463f] rotate-[-8deg]" />
        <div className="absolute top-[15%] right-[15%] w-32 h-20 bg-[#3a3732] rotate-[6deg]" />
        <div className="absolute bottom-[25%] left-[20%] w-28 h-20 bg-[#2e2b27]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/10" />
      {/* red X badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#a04040] text-white px-3 py-1.5 rounded-full text-xs tracking-widest uppercase shadow-lg">
        <span className="text-sm">✕</span> NG
      </div>
    </div>
  );
}

export default function PhotoGuidePage() {
  const page = getPageByHref(HREF)!;

  return (
    <CockpitLayout currentHref={HREF}>
      <section className="flex-1 px-6 md:px-12 py-16 md:py-20 max-w-[1400px] mx-auto w-full">
        <div className="mb-12 md:mb-14">
          <div className="text-xs tracking-[0.4em] uppercase text-[#8a7f72] mb-4">
            {page.pdfPage} · {page.tag}
          </div>
          <h1 className="font-[family-name:var(--font-serif-tc)] text-[clamp(2rem,4vw,3.75rem)] leading-[1.2] font-medium tracking-tight max-w-3xl">
            好照片 = 好選材體驗
          </h1>
          <p className="mt-6 text-lg text-[#4a463f] max-w-2xl leading-[1.9]">
            AI 再厲害，也得靠一張能看的空間照。這裡是讓 AI
            發揮出實力的三個簡單原則，順便看看什麼樣的照片會讓結果變味。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* OK side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6"
          >
            <OKFrame />
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-[#3f7a3f] text-white inline-flex items-center justify-center text-lg">
                  ✓
                </span>
                <h2 className="font-[family-name:var(--font-serif-tc)] text-3xl font-medium">
                  這樣拍就對
                </h2>
              </div>
              <ul className="space-y-3">
                {OK_POINTS.map((p) => (
                  <li
                    key={p.label}
                    className="flex items-start gap-3 pb-3 border-b border-[#1b1a17]/5 last:border-0"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3f7a3f] flex-shrink-0" />
                    <div>
                      <span className="font-medium text-[#1b1a17]">
                        {p.label}
                      </span>
                      <span className="mx-2 text-[#8a7f72]">·</span>
                      <span className="text-[#4a463f]">{p.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* NG side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <NGFrame />
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-[#a04040] text-white inline-flex items-center justify-center text-lg">
                  ✕
                </span>
                <h2 className="font-[family-name:var(--font-serif-tc)] text-3xl font-medium">
                  避開這四種
                </h2>
              </div>
              <ul className="space-y-3">
                {NG_POINTS.map((p) => (
                  <li
                    key={p.label}
                    className="flex items-start gap-3 pb-3 border-b border-[#1b1a17]/5 last:border-0"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#a04040] flex-shrink-0" />
                    <div>
                      <span className="font-medium text-[#1b1a17]">
                        {p.label}
                      </span>
                      <span className="mx-2 text-[#8a7f72]">·</span>
                      <span className="text-[#4a463f]">{p.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Spec strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-12 md:mt-16 p-6 md:p-8 rounded-2xl bg-white/70 border border-[#1b1a17]/5 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm">
            <span>
              <span className="text-[#8a7f72] mr-2">格式</span>
              <span className="font-medium">JPG · PNG · WEBP · HEIC</span>
            </span>
            <span>
              <span className="text-[#8a7f72] mr-2">建議解析度</span>
              <span className="font-medium">1920 × 1080 以上</span>
            </span>
            <span>
              <span className="text-[#8a7f72] mr-2">檔案大小</span>
              <span className="font-medium">10 MB 以內</span>
            </span>
          </div>
          <div className="text-xs tracking-widest uppercase text-[#8a6b3f]">
            輸入高品質照片 = 高品質銷售輔助
          </div>
        </motion.div>
      </section>

      <PageNav currentHref={HREF} />
    </CockpitLayout>
  );
}
