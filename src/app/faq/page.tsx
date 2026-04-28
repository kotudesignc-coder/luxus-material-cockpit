"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CockpitLayout } from "@/components/cockpit-layout";
import { PageNav } from "@/components/page-nav";
import { getPageByHref } from "@/lib/pages";

const HREF = "/faq";

type QA = {
  q: string;
  a: string;
  /** 客群（設計師 / 師傅 / 客戶共通），做分類色用 */
  tag: "designer" | "painter" | "customer" | "all";
};

const FAQ: QA[] = [
  {
    q: "AI 看到的顏色會跟我家實際刷出來的一樣嗎？",
    a: "色相會很接近，但一定會有色差 — 不只 AI，電腦和手機不同品牌（蘋果 / 安卓）、不同螢幕（華碩 / 優派）都會有顯色差異。我們會持續用實體色卡比對校正；AI 預覽是幫你大幅降低「完全想不到」的風險、降低溝通成本，不是取代實體小樣。重要決策前建議仍請油漆師傅做實體測試。",
    tag: "all",
  },
  {
    q: "這個工具免費嗎？我要付什麼費用？",
    a: "說明會看到的版本是 LUXUS PAINT × 可塗設計 × 系統開發商合作的展示版，費用統一由 LUXUS PAINT 吸收，免費讓設計師 / 油漆師傅使用。",
    tag: "all",
  },
  {
    q: "我可以把 AI 做好的圖直接交給客戶嗎？",
    a: "可以，而且建議這樣做。客戶最怕「我以為會更淡」的後悔，把 AI 預覽圖用 LINE 傳給客戶看，成交率明顯提高。建議在圖上註明「AI 模擬預覽，實刷會有色差」保護彼此。",
    tag: "designer",
  },
  {
    q: "我是油漆師傅，不太會用電腦，這個難不難學？",
    a: "網頁版，手機就能開。流程就「拍照 → 選色 → 給客戶看」三步，跟你平常用 LINE 的操作差不多。說明會會現場一步一步帶著做，回去用手機隨時能玩。",
    tag: "painter",
  },
  {
    q: "你們的色票跟官方的一樣嗎？",
    a: "色號、色名、產品系列都是官方的。HEX 色值目前是從色卡視覺估算的近似值 — 說明會之後會取得官方對照表校正。重要選色仍請以實體色卡為準。",
    tag: "designer",
  },
  {
    q: "我可以保留客戶的選色紀錄嗎？",
    a: "目前沒有自動帳號紀錄功能。實務上，把選好的空間預覽圖**下載**或**截圖傳 LINE 給客戶**，這張圖本身就是最完整的「選色紀錄」 — 比起色號文字，圖片更不會看錯。後續正式版會考慮加業務帳號功能，自動歸檔每位客戶的選色歷程。",
    tag: "designer",
  },
];

const TAG_LABEL: Record<QA["tag"], { text: string; color: string }> = {
  all: { text: "共通", color: "bg-[#8a7f72]/15 text-[#4a463f]" },
  designer: { text: "設計師", color: "bg-[#8a6b3f]/15 text-[#8a6b3f]" },
  painter: { text: "師傅", color: "bg-[#6e5233]/15 text-[#6e5233]" },
  customer: { text: "客戶", color: "bg-[#3f7a3f]/15 text-[#3f7a3f]" },
};

export default function FAQPage() {
  const page = getPageByHref(HREF)!;
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <CockpitLayout currentHref={HREF}>
      <section className="flex-1 px-6 md:px-12 py-16 md:py-20 max-w-[900px] mx-auto w-full">
        <div className="mb-10 md:mb-14">
          <div className="text-xs tracking-[0.4em] uppercase text-[#8a7f72] mb-4">
            {page.pdfPage} · {page.tag}
          </div>
          <h1 className="font-[family-name:var(--font-serif-tc)] text-[clamp(2rem,4vw,3.75rem)] leading-[1.2] font-medium tracking-tight">
            常見問題
          </h1>
          <p className="mt-6 text-lg text-[#4a463f] max-w-2xl leading-[1.9]">
            設計師、油漆師傅、客戶最常問的 {FAQ.length} 題。現場沒空問的，點開看答案就好。
          </p>
        </div>

        <div className="flex flex-col divide-y divide-[#1b1a17]/10 border-t border-b border-[#1b1a17]/10">
          {FAQ.map((item, i) => {
            const isOpen = openIdx === i;
            const tag = TAG_LABEL[item.tag];
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-start gap-4 py-5 md:py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs tracking-widest uppercase text-[#8a7f72] mt-1 w-6 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 flex flex-col gap-2">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full ${tag.color}`}>
                        {tag.text}
                      </span>
                    </span>
                    <span className="font-[family-name:var(--font-serif-tc)] text-xl md:text-2xl font-medium leading-snug group-hover:text-[#8a6b3f] transition">
                      {item.q}
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-2xl text-[#8a6b3f] mt-1 flex-shrink-0"
                    aria-hidden
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pl-10 pb-5 md:pb-7 pr-10 text-[#4a463f] leading-[1.9]">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-5 rounded-2xl bg-white/60 border border-[#1b1a17]/5 text-sm text-[#4a463f]">
          <span className="text-xs tracking-widest uppercase text-[#8a6b3f] mr-2">
            還有問題？
          </span>
          往下一頁 <strong>換你來操作</strong> 掃 QR 加 LINE 直接問。
        </div>
      </section>

      <PageNav currentHref={HREF} />
    </CockpitLayout>
  );
}
