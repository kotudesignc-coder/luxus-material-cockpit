import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f3ee] text-[#1b1a17]">
      {/* Top nav */}
      <header className="flex items-center justify-between px-8 md:px-16 py-6">
        <div className="text-sm tracking-[0.3em] uppercase text-[#8a7f72]">
          LUXUS × RoomDreaming × 可塗設計
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/?mode=free"
            className="text-[#1b1a17] hover:text-[#8a7f72] transition"
          >
            自由探索
          </Link>
          <Link
            href="/?mode=lecture"
            className="rounded-full border border-[#1b1a17] px-4 py-1.5 text-[#1b1a17] hover:bg-[#1b1a17] hover:text-[#f7f3ee] transition"
          >
            講師模式
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-8 md:px-16 py-16 lg:py-24 max-w-[1400px] mx-auto w-full">
        {/* Left: copy */}
        <section className="flex flex-col gap-8">
          <span className="text-xs tracking-[0.4em] uppercase text-[#8a7f72]">
            AI Material Cockpit
          </span>
          <h1
            className="font-[family-name:var(--font-serif-tc)] text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.15] font-medium tracking-tight"
          >
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
              href="/start"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#1b1a17] text-[#f7f3ee] text-base font-medium hover:bg-[#8a6b3f] transition"
            >
              開始體驗
            </Link>
            <Link
              href="/why"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-[#1b1a17]/30 text-[#1b1a17] text-base font-medium hover:border-[#1b1a17] transition"
            >
              為什麼要用 AI 選材？
            </Link>
          </div>
        </section>

        {/* Right: visual placeholder (to be replaced by room preview) */}
        <section className="relative aspect-[4/5] w-full max-w-[520px] mx-auto lg:mx-0 lg:ml-auto">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#d9c9b3] via-[#c9a882] to-[#6e5233] shadow-2xl shadow-[#8a6b3f]/20" />
          <div className="absolute inset-0 rounded-3xl flex items-end p-8">
            <div className="bg-[#f7f3ee]/95 backdrop-blur rounded-2xl px-6 py-5 w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8a6b3f]" />
                <div className="w-10 h-10 rounded-full bg-[#c9a882]" />
                <div className="w-10 h-10 rounded-full bg-[#d9c9b3]" />
                <div className="w-10 h-10 rounded-full bg-[#6e5233]" />
                <div className="ml-auto text-xs tracking-widest uppercase text-[#8a7f72]">
                  LUXUS
                </div>
              </div>
              <div className="mt-3 text-sm text-[#4a463f]">
                點一下色票，整個空間立刻換色。
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-8 md:px-16 py-8 text-xs tracking-widest uppercase text-[#8a7f72] flex flex-wrap gap-4 justify-between">
        <span>© 2026 可塗設計．與 LUXUS × RoomDreaming 合作出品</span>
        <span>v0.1.0 · Day 1</span>
      </footer>
    </div>
  );
}
