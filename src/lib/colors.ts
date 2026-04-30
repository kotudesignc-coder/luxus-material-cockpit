/**
 * LUXUS 色票資料 — 取自 luxuspainttaiwan.com.tw 產品頁與案場說明。
 *
 * ⚠️ 重要：官網沒有公開 HEX 色值，下列 hex 為**視覺近似估算**，
 *     正式上線前須從 LUXUS 官方色卡 PDF 取色校正。
 *     色號 / 中文名 / 英文名 / 產品系列 均為 LUXUS 官方命名。
 *
 * 色卡 PDF 清單參考 `專案/AI選材教學駕駛艙 — LUXUS 素材清單.md`
 */

export type Color = {
  id: string;
  /** LUXUS 色號（系列-編號） */
  code: string;
  /** 中文名（品牌命名） */
  nameZh: string;
  /** 英文名（義大利原名） */
  nameEn: string;
  /** 近似 HEX（待色卡校正） */
  hex: string;
  /** 色系分類（for UI tab） */
  family: "neutral" | "warm" | "earth" | "cool" | "mute" | "deep" | "metallic";
  /** 產品系列（漆類/土類/CLAY/地坪/外牆） */
  series: string;
  /** 氛圍關鍵字 */
  mood: string[];
};

/**
 * 精選 18 色，涵蓋 LUXUS 七大系列，給說明會展示用。
 * 完整 200+ 色後續可再擴。
 */
export const COLORS: Color[] = [
  // ===== TACTO MATT（麂皮消光，侘寂美學） =====
  { id: "tacto-01", code: "TACTO·01", nameZh: "塔圖米雲", nameEn: "Tacto Cloud",
    hex: "#EFE8DB", family: "neutral", series: "TACTO MATT", mood: ["侘寂", "溫潤", "北歐"] },
  { id: "tacto-02", code: "TACTO·12", nameZh: "塔圖原木", nameEn: "Tacto Oak",
    hex: "#D9C9B3", family: "neutral", series: "TACTO MATT", mood: ["溫暖", "日系", "侘寂"] },
  { id: "tacto-03", code: "TACTO·34", nameZh: "塔圖麂皮", nameEn: "Tacto Suede",
    hex: "#B89B7E", family: "warm", series: "TACTO MATT", mood: ["溫暖", "優雅"] },

  // ===== PETHRA（礦物石材感） =====
  { id: "pethra-base", code: "PETHRA·Base", nameZh: "佩特拉石灰", nameEn: "Pethra Base",
    hex: "#C8C2B6", family: "neutral", series: "PETHRA", mood: ["質樸", "石材"] },
  { id: "pethra-matt", code: "PETHRA·Matt", nameZh: "佩特拉消光", nameEn: "Pethra Matt",
    hex: "#9B958C", family: "mute", series: "PETHRA", mood: ["侘寂", "沉穩"] },
  { id: "pethra-a1", code: "PETHRA·A-1", nameZh: "佩特拉紅金", nameEn: "Pethra Matt A-1",
    hex: "#A0664A", family: "warm", series: "PETHRA", mood: ["奢華", "紅金"] },
  { id: "pethra-r3", code: "PETHRA·R-3", nameZh: "佩特拉珠光", nameEn: "Pethra Perlata R-3",
    hex: "#E6D9C4", family: "metallic", series: "PETHRA", mood: ["珠光", "優雅"] },

  // ===== SMOOTH（CLAY 新系列，米灰細緻） =====
  { id: "smooth-166a03", code: "SMOOTH·166A03", nameZh: "史姆米灰", nameEn: "Smooth 166A03",
    hex: "#B3ACA0", family: "mute", series: "SMOOTH", mood: ["現代", "低彩度"] },

  // ===== LIMEWASH（石灰洗） =====
  { id: "limewash-01", code: "LIMEWASH·01", nameZh: "萊納瓦雪", nameEn: "Limewash Snow",
    hex: "#F1ECE3", family: "neutral", series: "LIMEWASH", mood: ["北歐", "明亮"] },
  { id: "limewash-02", code: "LIMEWASH·02", nameZh: "萊納瓦霧", nameEn: "Limewash Haze",
    hex: "#C4BDB2", family: "mute", series: "LIMEWASH", mood: ["侘寂", "低彩度"] },

  // ===== RUSTIC（土黃土系） =====
  { id: "rustic-01", code: "RUSTIC·01", nameZh: "洛司堤土黃", nameEn: "Rustic Ochre",
    hex: "#B6895D", family: "earth", series: "RUSTIC", mood: ["質樸", "土地"] },
  { id: "rustic-02", code: "RUSTIC·02", nameZh: "洛司堤磚紅", nameEn: "Rustic Terracotta",
    hex: "#9A5B3E", family: "earth", series: "RUSTIC", mood: ["溫暖", "侘寂"] },

  // ===== SOFT（絲絨金屬） =====
  { id: "soft-s123", code: "SOFT·S-123", nameZh: "莎芙銀", nameEn: "Soft Silver S-123",
    hex: "#C2C4C1", family: "metallic", series: "SOFT", mood: ["金屬", "奢華"] },

  // ===== OPALIASETA（珠光） =====
  { id: "opalia-f1", code: "OPALIA·F-1", nameZh: "奧帕利亞暗金", nameEn: "Opalia Dark Gold F-1",
    hex: "#8A6B3F", family: "metallic", series: "OPALIASETA", mood: ["奢華", "金屬"] },

  // ===== LE RUGGINI（鐵鏽感） =====
  { id: "ruggini-t2", code: "RUGGINI·T-2", nameZh: "露琴鏽褐", nameEn: "Ruggine Opaca T-2",
    hex: "#7A5239", family: "earth", series: "LE RUGGINI", mood: ["鐵鏽", "質樸"] },

  // ===== FLOOR CEMENTO（微水泥地坪） =====
  { id: "cemento-2500", code: "CEMENTO·2500", nameZh: "聖馬托冷灰", nameEn: "Floor Cemento 2500",
    hex: "#8A8882", family: "cool", series: "FLOOR CEMENTO", mood: ["現代", "都會"] },
  { id: "cemento-2501", code: "CEMENTO·2501", nameZh: "聖馬托暖灰", nameEn: "Floor Cemento 2501",
    hex: "#A09B90", family: "mute", series: "FLOOR CEMENTO", mood: ["侘寂", "溫潤"] },

  // ===== LUXUSQUARTZ（外牆石英） =====
  { id: "quartz-2572", code: "QUARTZ·2572", nameZh: "路克蜜桃", nameEn: "Luxusquartz Peach 2572",
    hex: "#D9A88D", family: "warm", series: "LUXUSQUARTZ", mood: ["溫暖", "柔和"] },
];

export const FAMILIES = {
  neutral: "中性",
  warm: "暖調",
  earth: "土系",
  cool: "冷調",
  mute: "灰調",
  deep: "深色",
  metallic: "金屬",
} as const;

/** LUXUS 案場空間（暫不放真實照片，使用底色 mock；待版權確認後填 photoSrc） */
export type RoomScene = {
  id: string;
  nameZh: string;
  nameEn: string;
  /** 代表色（mock 牆面） */
  baseColor: string;
  /** 案場情境描述 */
  caption?: string;
  /** 真實照片路徑（授權後再填） */
  photoSrc?: string;
};

// photoSrc 設 undefined → 自動 fallback 為剪影 mock（恢復路徑）
export const ROOMS: RoomScene[] = [
  { id: "livingroom", nameZh: "客廳", nameEn: "Living Room", baseColor: "#E8DFCE",
    caption: "家人聚集的主場域", photoSrc: "/luxus/rooms/livingroom.jpg" },
  { id: "bedroom",    nameZh: "臥室", nameEn: "Bedroom",     baseColor: "#EADED1",
    caption: "私密、放鬆、睡眠", photoSrc: "/luxus/rooms/bedroom.jpg" },
  { id: "kitchen",    nameZh: "廚房", nameEn: "Kitchen",     baseColor: "#D8D4C8",
    caption: "料理與交流" }, // 沒對應真照 → 用剪影
  { id: "bathroom",   nameZh: "衛浴", nameEn: "Bathroom",    baseColor: "#DDE2DC",
    caption: "清潔與獨處" }, // 沒對應真照 → 用剪影
  { id: "diningroom", nameZh: "餐廳", nameEn: "Dining",      baseColor: "#E4DED0",
    caption: "用餐與款待", photoSrc: "/luxus/rooms/diningroom.jpg" },
  { id: "foyer",      nameZh: "玄關", nameEn: "Foyer",       baseColor: "#DFD9CC",
    caption: "家的第一印象", photoSrc: "/luxus/rooms/foyer.jpg" },
];
