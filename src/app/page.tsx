import Link from "next/link";
import { CockpitLayout } from "@/components/cockpit-layout";
import { SpacePhoto } from "@/components/space-photo";
import { PAGES } from "@/lib/pages";

export default function Home() {
  const firstContentPage = PAGES[1]; // /pain

  return (
    <CockpitLayout isHome>
      {/* Hero */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-8 md:px-16 py-16 lg:py-24 max-w-[1400px] mx-auto w-full">
        {/* Left: copy */}
        <div className="flex flex-col gap-8">
          <span className="text-xs tracking-[0.4em] uppercase text-[#8a7f72]">
            AI Material Cockpit
          </span>
          <h1 className="font-[family-name:var(--font-serif-tc)] text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.15] font-medium tracking-tight">
            30 秒把顏色
            <br />
            鋪到你家的牆上，
            <br />
            <span className="text-[#8a6b3f]">看過再決定。</span>
          </h1>
          <p className="text-lg leading-[1.9] text-[#4a463f] max-w-[28rem]">
            不再看著小色卡想像。上傳一張空間照，AI
            會用你家的光線、比例、傢俱，把每種色漆真的貼上去讓你看。
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href={firstContentPage.href}
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#1b1a17] text-[#f7f3ee] text-base font-medium hover:bg-[#8a6b3f] transition"
            >
              開始體驗 →
            </Link>
            <Link
              href="/colors"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-[#1b1a17]/30 text-[#1b1a17] text-base font-medium hover:border-[#1b1a17] transition"
            >
              直接看色票
            </Link>
          </div>
        </div>

        {/* Right: hero visual (real LUXUS space) */}
        <div className="relative aspect-[4/5] w-full max-w-[520px] mx-auto lg:mx-0 lg:ml-auto">
          <SpacePhoto
            src="/pdf-assets/hero-living-room.png"
            alt="LUXUS 選材後的客廳空間，溫潤米色牆面配上米色沙發與木紋傢俱"
            aspect="4/5"
            rounded="3xl"
            priority
            className="shadow-2xl shadow-[#8a6b3f]/20"
          />
          <div className="absolute inset-0 rounded-3xl pointer-events-none flex items-end p-6">
            <div className="bg-[#f7f3ee]/95 backdrop-blur rounded-2xl px-5 py-4 w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#8a6b3f]" />
                <div className="w-9 h-9 rounded-full bg-[#c9a882]" />
                <div className="w-9 h-9 rounded-full bg-[#d9c9b3]" />
                <div className="w-9 h-9 rounded-full bg-[#6e5233]" />
                <div className="ml-auto text-[10px] tracking-widest uppercase text-[#8a7f72]">
                  LUXUS
                </div>
              </div>
              <div className="mt-2 text-xs text-[#4a463f]">
                點一下色票，整個空間立刻換色。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 頁 目錄（散會後讓觀眾自由跳） */}
      <section className="bg-white/60 border-t border-[#1b1a17]/5">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-12">
          <div className="text-xs tracking-[0.4em] uppercase text-[#8a7f72] mb-6">
            今天會走這 10 頁
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {PAGES.slice(1).map((p, i) => (
              <Link
                key={p.href}
                href={p.href}
                className="group flex flex-col gap-1.5 p-4 rounded-xl border border-[#1b1a17]/10 hover:border-[#8a6b3f] hover:bg-white transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-widest uppercase text-[#8a7f72]">
                    {String(i + 1).padStart(2, "0")} · {p.pdfPage}
                  </span>
                  {p.hero && (
                    <span className="text-[9px] tracking-widest uppercase text-[#8a6b3f]">
                      核心
                    </span>
                  )}
                </div>
                <div className="font-medium text-[#1b1a17] group-hover:text-[#8a6b3f] transition">
                  {p.title}
                </div>
                <div className="text-xs text-[#8a7f72]">{p.tag}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </CockpitLayout>
  );
}
