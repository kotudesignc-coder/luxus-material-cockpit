"use client";

import { motion } from "framer-motion";
import { CockpitLayout } from "@/components/cockpit-layout";
import { PageNav } from "@/components/page-nav";
import { SpacePhoto } from "@/components/space-photo";
import { getPageByHref } from "@/lib/pages";

const HREF = "/pain";

type PainCard = {
  num: string;
  title: string;
  desc: string;
  /** 真實照片 src（優先） */
  photo?: string;
  photoAlt?: string;
  /** 備用漸層 */
  tint: string;
  /** 情境對白，讓觀眾秒有感 */
  quote: string;
};

const CARDS: PainCard[] = [
  {
    num: "01",
    title: "色卡想像 ≠ 真實空間",
    desc: "指甲大的樣品，看不出 5 米牆面鋪上去的壓迫或溫度。客戶只好靠想像，決定完又後悔。",
    photo: "/pdf-assets/pain-traditional-swatches.png",
    photoAlt: "傳統方式：桌上散落一堆紙色卡與樣品",
    tint: "linear-gradient(135deg, #d9c9b3, #8a6b3f)",
    quote: "「我以為會更淡一點……」",
  },
  {
    num: "02",
    title: "光線會騙人",
    desc: "門市的投射燈下漂亮，回到客戶家的自然光完全不一樣。黃光、日光、夜裡的暖燈，顏色會變三次。",
    photo: "/pdf-assets/space-bedroom-lamp.png",
    photoAlt: "臥室床邊燈具下的暖光與陰影",
    tint: "linear-gradient(135deg, #c9a882, #4a463f)",
    quote: "「怎麼晚上看起來變灰綠？」",
  },
  {
    num: "03",
    title: "家人意見吵不完",
    desc: "太太、先生、媽媽、孩子，每個人想像的「莫蘭迪」都不同。一場討論，三個禮拜就沒了。",
    photo: "/custom/family-argument.jpg",
    photoAlt: "一家人圍著餐桌上的色卡與雜誌爭論不休，小孩摀耳朵、先生抱頭、奶奶在旁邊別過臉",
    tint: "linear-gradient(135deg, #8a7f72, #1b1a17)",
    quote: "「等我問一下家人再回你……」",
  },
];

export default function PainPage() {
  const page = getPageByHref(HREF)!;

  return (
    <CockpitLayout currentHref={HREF}>
      <section className="flex-1 px-6 md:px-12 py-16 md:py-24 max-w-[1400px] mx-auto w-full">
        <div className="mb-12 md:mb-16">
          <div className="text-xs tracking-[0.4em] uppercase text-[#8a7f72] mb-4">
            {page.pdfPage} · {page.tag}
          </div>
          <h1 className="font-[family-name:var(--font-serif-tc)] text-[clamp(2rem,4vw,3.75rem)] leading-[1.2] font-medium tracking-tight max-w-3xl">
            你是不是也這樣
            <span className="text-[#8a6b3f]">？</span>
          </h1>
          <p className="mt-6 text-lg text-[#4a463f] max-w-2xl leading-[1.9]">
            選色從來不是選色的問題 — 是「我怎麼讓對方看到我想像的那個樣子」的問題。
            做了十幾年設計的人都知道，真正卡客戶的是這三件事。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {CARDS.map((c, i) => (
            <motion.article
              key={c.num}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-[#1b1a17]/10 bg-white/60 backdrop-blur-sm p-7 md:p-8 flex flex-col gap-5 hover:border-[#8a6b3f]/40 transition"
            >
              {/* photo or decorative swatch */}
              <SpacePhoto
                src={c.photo}
                alt={c.photoAlt ?? c.title}
                aspect="16/9"
                rounded="xl"
                fallback={c.tint}
                className="!shadow-inner"
              />

              <div className="flex items-baseline gap-3">
                <span className="text-xs tracking-[0.3em] uppercase text-[#8a6b3f]">
                  {c.num}
                </span>
                <div className="h-px flex-1 bg-[#1b1a17]/10" />
              </div>

              <h2 className="font-[family-name:var(--font-serif-tc)] text-2xl md:text-[1.65rem] font-medium leading-snug tracking-tight">
                {c.title}
              </h2>

              <p className="text-[15px] leading-[1.9] text-[#4a463f]">
                {c.desc}
              </p>

              <div className="mt-auto pt-4 border-t border-[#1b1a17]/5 text-sm italic text-[#8a7f72]">
                {c.quote}
              </div>
            </motion.article>
          ))}
        </div>

        {/* bridge to next page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-16 md:mt-20 text-center"
        >
          <p className="text-[#4a463f] text-lg">
            這三件事 — <strong className="text-[#1b1a17]">30 秒，就能全部解決</strong>。
          </p>
          <p className="mt-2 text-sm text-[#8a7f72] tracking-wider">
            繼續往下，看傳統做法 vs AI 選材的差異 ↓
          </p>
        </motion.div>
      </section>

      <PageNav currentHref={HREF} />
    </CockpitLayout>
  );
}
