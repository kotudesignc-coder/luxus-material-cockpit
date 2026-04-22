import Image from "next/image";

type Props = {
  /** 相對 /public 的路徑，例如 "/pdf-assets/space-living-warm.png" */
  src?: string;
  /** 圖片描述（a11y 用） */
  alt: string;
  /** 容器寬高比，預設 4/3 */
  aspect?: "4/3" | "4/5" | "16/9" | "1/1";
  /** 圓角尺寸 */
  rounded?: "xl" | "2xl" | "3xl";
  /** 沒有 src 時顯示的 fallback 漸層（tailwind class 或 css gradient 值） */
  fallback?: string;
  /** 右上角 tint / NG / OK 角標 */
  badge?: {
    text: string;
    tone: "ok" | "ng" | "neutral" | "amber";
  };
  /** 是否優先載入（Hero 用） */
  priority?: boolean;
  className?: string;
};

const ASPECT_CLASS: Record<NonNullable<Props["aspect"]>, string> = {
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "16/9": "aspect-[16/9]",
  "1/1": "aspect-square",
};

const ROUNDED_CLASS: Record<NonNullable<Props["rounded"]>, string> = {
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

const BADGE_TONE: Record<NonNullable<Props["badge"]>["tone"], string> = {
  ok: "bg-[#3f7a3f] text-white",
  ng: "bg-[#a04040] text-white",
  neutral: "bg-white/90 text-[#1b1a17]",
  amber: "bg-[#8a6b3f] text-white",
};

/**
 * 共用「空間照 / 照片位」組件。
 * 有 src → 用 next/image；沒 src → fallback 漸層（開發期 placeholder）。
 */
export function SpacePhoto({
  src,
  alt,
  aspect = "4/3",
  rounded = "2xl",
  fallback = "linear-gradient(135deg, #d9c9b3, #8a6b3f)",
  badge,
  priority,
  className = "",
}: Props) {
  return (
    <div
      className={`relative overflow-hidden shadow-lg ${ASPECT_CLASS[aspect]} ${ROUNDED_CLASS[rounded]} ${className}`}
      style={src ? undefined : { background: fallback }}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
        />
      )}
      {badge && (
        <div
          className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs tracking-widest uppercase shadow-lg ${BADGE_TONE[badge.tone]}`}
        >
          {badge.text}
        </div>
      )}
    </div>
  );
}
