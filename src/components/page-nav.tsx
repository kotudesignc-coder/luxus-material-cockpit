import Link from "next/link";
import { getNeighbors } from "@/lib/pages";

type Props = {
  currentHref: string;
};

export function PageNav({ currentHref }: Props) {
  const { prev, next } = getNeighbors(currentHref);

  return (
    <nav className="flex items-center justify-between gap-4 px-6 md:px-12 py-6 border-t border-[#1b1a17]/5 mt-auto">
      {prev ? (
        <Link
          href={prev.href}
          className="flex items-center gap-3 text-sm text-[#4a463f] hover:text-[#8a6b3f] transition group"
        >
          <span className="text-[#8a7f72] group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          <span className="flex flex-col items-start">
            <span className="text-[10px] tracking-widest uppercase text-[#8a7f72]">
              上一步 {prev.pdfPage}
            </span>
            <span>{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={next.href}
          className="flex items-center gap-3 text-sm text-[#4a463f] hover:text-[#8a6b3f] transition group"
        >
          <span className="flex flex-col items-end">
            <span className="text-[10px] tracking-widest uppercase text-[#8a7f72]">
              下一步 {next.pdfPage}
            </span>
            <span>{next.title}</span>
          </span>
          <span className="text-[#8a7f72] group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
