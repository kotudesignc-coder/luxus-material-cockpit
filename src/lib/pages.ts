/**
 * 說明會版 MVP 10 頁清單（對應 LUXUS PDF 頁碼）
 * 改這裡就會自動更新所有頁面的上一步/下一步 + 目錄。
 */
export type CockpitPage = {
  /** route path，首頁是 "/" */
  href: string;
  /** 頁面主標題 */
  title: string;
  /** 副標題 / 導覽用短描述 */
  tag: string;
  /** 對應 PDF 原頁碼 */
  pdfPage: string;
  /** 是否為「核心 wow 頁」— 會加強調 */
  hero?: boolean;
};

export const PAGES: CockpitPage[] = [
  {
    href: "/",
    title: "AI 選材",
    tag: "封面",
    pdfPage: "new",
  },
  {
    href: "/pain",
    title: "你是不是也這樣？",
    tag: "痛點共鳴",
    pdfPage: "p.03",
  },
  {
    href: "/compare",
    title: "傳統 vs AI",
    tag: "拉桿對比",
    pdfPage: "p.05",
  },
  {
    href: "/photo-guide",
    title: "怎麼拍好一張空間照",
    tag: "拍攝指引",
    pdfPage: "p.09+10+11",
  },
  {
    href: "/colors",
    title: "LUXUS 色票",
    tag: "核心體驗",
    pdfPage: "p.14",
    hero: true,
  },
  {
    href: "/ab",
    title: "比較模式",
    tag: "殺手鐧",
    pdfPage: "p.21",
    hero: true,
  },
  {
    href: "/flow",
    title: "三步驟把顏色貼上你家",
    tag: "系統操作 · 實機 demo",
    pdfPage: "p.16",
  },
  {
    href: "/recommend",
    title: "AI 幫你推薦",
    tag: "進階體驗",
    pdfPage: "p.24",
  },
  {
    href: "/faq",
    title: "常見問題",
    tag: "FAQ",
    pdfPage: "p.29",
  },
  {
    href: "/end",
    title: "繼續一起玩",
    tag: "結尾 / LINE QR",
    pdfPage: "p.31",
  },
];

export function getPageByHref(href: string): CockpitPage | undefined {
  return PAGES.find((p) => p.href === href);
}

export function getNeighbors(href: string): {
  prev?: CockpitPage;
  next?: CockpitPage;
  index: number;
} {
  const index = PAGES.findIndex((p) => p.href === href);
  return {
    prev: index > 0 ? PAGES[index - 1] : undefined,
    next: index >= 0 && index < PAGES.length - 1 ? PAGES[index + 1] : undefined,
    index,
  };
}
