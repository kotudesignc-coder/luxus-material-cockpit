/**
 * 南部 LUXUS 經銷夥伴 — 給 /dealers 頁用。
 * 每家有獨立的 RoomDreaming AI 選材入口 QR。
 * QR 掃進去 → 到該經銷的個人選材頁 → 客戶選色後業務在 LINE 收到單。
 */
export type Dealer = {
  /** 對應 QR 檔名前綴 */
  id: string;
  /** 經銷商名稱 */
  name: string;
  /** 城市 */
  city: "台南" | "高雄";
  /** QR 圖路徑 */
  qrSrc: string;
  /** 一句話標籤（可選） */
  tagline?: string;
};

export const SOUTH_DEALERS: Dealer[] = [
  {
    id: "heya",
    name: "禾亞藝術塗裝",
    city: "台南",
    qrSrc: "/qr/dealers/heya.png",
  },
  {
    id: "zhengchang",
    name: "正昌塗料",
    city: "台南",
    qrSrc: "/qr/dealers/zhengchang.png",
  },
  {
    id: "caige",
    name: "采格室內裝修",
    city: "高雄",
    qrSrc: "/qr/dealers/caige.png",
  },
  {
    id: "qingshanhong",
    name: "青山紅藝術工坊",
    city: "高雄",
    qrSrc: "/qr/dealers/qingshanhong.png",
  },
];
