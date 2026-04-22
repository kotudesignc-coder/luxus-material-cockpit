/**
 * Mock LUXUS 色票資料 — Day 5 的 /colors 頁用這份佔位。
 * LUXUS 官網真資料抓完後會用 colors.ts 取代此檔。
 * 色名 / 色號為便於開發而命名，不代表 LUXUS 真實產品。
 */

export type Color = {
  /** 唯一 id，對應檔名用 */
  id: string;
  /** 色號（LUXUS 風格） */
  code: string;
  /** 中文色名 */
  nameZh: string;
  /** 英文色名 */
  nameEn: string;
  /** HEX */
  hex: string;
  /** 色系分類 */
  family: "neutral" | "warm" | "cool" | "earth" | "mute" | "deep";
  /** 氛圍關鍵字（AI 推薦頁用） */
  mood: string[];
};

export const COLORS: Color[] = [
  // neutral 中性系
  { id: "n1", code: "N-01", nameZh: "米白雲",      nameEn: "Cloud Cream",      hex: "#F5EFE6", family: "neutral", mood: ["明亮", "乾淨", "北歐"] },
  { id: "n2", code: "N-02", nameZh: "亞麻",        nameEn: "Linen",            hex: "#EADFCD", family: "neutral", mood: ["溫潤", "自然"] },
  { id: "n3", code: "N-03", nameZh: "原木米",      nameEn: "Oakwood",          hex: "#D9C9B3", family: "neutral", mood: ["溫暖", "日系"] },
  { id: "n4", code: "N-04", nameZh: "淺灰磨石",    nameEn: "Soft Terrazzo",    hex: "#C8C2B6", family: "neutral", mood: ["沉穩", "現代"] },

  // warm 暖色系
  { id: "w1", code: "W-01", nameZh: "侘寂橘",      nameEn: "Wabi Apricot",     hex: "#C49073", family: "warm",    mood: ["溫暖", "侘寂"] },
  { id: "w2", code: "W-02", nameZh: "暮光橘",      nameEn: "Dusk Amber",       hex: "#A06A48", family: "warm",    mood: ["沉穩", "溫暖"] },
  { id: "w3", code: "W-03", nameZh: "磚土",        nameEn: "Terracotta",       hex: "#9A5B3E", family: "warm",    mood: ["土地", "質樸"] },

  // earth 土系
  { id: "e1", code: "E-01", nameZh: "駱駝棕",      nameEn: "Camel",            hex: "#8A6B3F", family: "earth",   mood: ["質樸", "經典"] },
  { id: "e2", code: "E-02", nameZh: "深煙熏",      nameEn: "Smoked Oak",       hex: "#6E5233", family: "earth",   mood: ["沉穩", "深邃"] },
  { id: "e3", code: "E-03", nameZh: "可可",        nameEn: "Cocoa",            hex: "#5A3F27", family: "earth",   mood: ["深邃", "奢華"] },

  // cool 冷色系
  { id: "c1", code: "C-01", nameZh: "薄霧綠",      nameEn: "Mist Sage",        hex: "#BFC7B7", family: "cool",    mood: ["冷色", "療癒"] },
  { id: "c2", code: "C-02", nameZh: "雨後石",      nameEn: "Wet Stone",        hex: "#8A9299", family: "cool",    mood: ["冷色", "都會"] },
  { id: "c3", code: "C-03", nameZh: "墨林青",      nameEn: "Forest Ink",       hex: "#3E5348", family: "cool",    mood: ["深邃", "冷色"] },

  // mute 灰調
  { id: "m1", code: "M-01", nameZh: "侘寂灰",      nameEn: "Wabi Grey",        hex: "#9B958C", family: "mute",    mood: ["侘寂", "沉穩"] },
  { id: "m2", code: "M-02", nameZh: "霧霾",        nameEn: "Haze",             hex: "#7E7974", family: "mute",    mood: ["低彩度", "侘寂"] },

  // deep 深色
  { id: "d1", code: "D-01", nameZh: "深夜炭",      nameEn: "Midnight Coal",    hex: "#2E2B28", family: "deep",    mood: ["深邃", "戲劇"] },
];

export const FAMILIES = {
  neutral: "中性",
  warm: "暖調",
  earth: "土系",
  cool: "冷調",
  mute: "灰調",
  deep: "深色",
} as const;

/** Mock 預設空間（沒刷色的底圖）— 真實照片進來會換檔名 */
export type RoomScene = {
  id: string;
  nameZh: string;
  /** 主牆底色 — 沒有空間照時用純色合成 */
  baseColor: string;
  /** 空間照路徑（優先）— 未來 agent 會填 */
  photoSrc?: string;
};

export const ROOMS: RoomScene[] = [
  { id: "livingroom", nameZh: "客廳", baseColor: "#E8DFCE" },
  { id: "bedroom",    nameZh: "臥室", baseColor: "#EADED1" },
  { id: "kitchen",    nameZh: "廚房", baseColor: "#D8D4C8" },
  { id: "bathroom",   nameZh: "衛浴", baseColor: "#DDE2DC" },
  { id: "diningroom", nameZh: "餐廳", baseColor: "#E4DED0" },
  { id: "foyer",      nameZh: "玄關", baseColor: "#DFD9CC" },
];
