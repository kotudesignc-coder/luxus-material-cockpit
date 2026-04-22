import { CockpitLayout } from "./cockpit-layout";
import { PageNav } from "./page-nav";
import { getPageByHref } from "@/lib/pages";

type Props = {
  href: string;
  /** Day X 預計做（顯示在 placeholder 上） */
  plannedDay: string;
  /** 一兩句話描述這頁會做什麼，講師版用 */
  blurb?: string;
};

/**
 * 所有還沒完工的頁都用這個 placeholder。
 * 排程到該 Day 時換成真內容。
 */
export function PlaceholderPage({ href, plannedDay, blurb }: Props) {
  const page = getPageByHref(href);
  if (!page) {
    return (
      <CockpitLayout>
        <div className="flex-1 flex items-center justify-center p-12 text-[#8a7f72]">
          Unknown route: {href}
        </div>
      </CockpitLayout>
    );
  }

  return (
    <CockpitLayout currentHref={href}>
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-24 text-center">
        <div className="text-xs tracking-[0.4em] uppercase text-[#8a7f72] mb-6">
          {page.pdfPage} · {page.tag}
        </div>
        <h1 className="font-[family-name:var(--font-serif-tc)] text-5xl md:text-6xl font-medium tracking-tight mb-6 max-w-3xl">
          {page.title}
          {page.hero && (
            <span className="inline-block ml-3 align-middle text-xs tracking-widest uppercase text-[#8a6b3f] border border-[#8a6b3f] rounded-full px-3 py-1">
              核心
            </span>
          )}
        </h1>
        {blurb && (
          <p className="text-[#4a463f] max-w-lg leading-relaxed mb-10">
            {blurb}
          </p>
        )}
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#1b1a17]/5 text-xs tracking-widest uppercase text-[#8a7f72]">
          <span className="w-2 h-2 rounded-full bg-[#8a6b3f] animate-pulse" />
          {plannedDay} 上線
        </div>
      </div>
      <PageNav currentHref={href} />
    </CockpitLayout>
  );
}
