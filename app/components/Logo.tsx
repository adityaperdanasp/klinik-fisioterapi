import { Fredoka } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-logo",
});

const BARS = [
  { y: 0, width: 30 },
  { y: 8, width: 26 },
  { y: 16, width: 22 },
  { y: 24, width: 18 },
  { y: 32, width: 14 },
  { y: 40, width: 10 },
];

export function Logo({
  className = "",
  size = "default",
}: {
  className?: string;
  size?: "default" | "compact";
}) {
  const iconSize = size === "compact" ? { w: 20, h: 30 } : { w: 28, h: 42 };
  const textClass = size === "compact" ? "text-sm" : "text-xl";

  return (
    <span className={`${fredoka.variable} inline-flex items-center gap-2 ${className}`}>
      <svg width={iconSize.w} height={iconSize.h} viewBox="0 0 40 64" fill="none" aria-hidden="true">
        {BARS.map((b) => (
          <rect
            key={b.y}
            x={(40 - b.width) / 2}
            y={b.y}
            width={b.width}
            height={6}
            rx={3}
            fill="#0E9F6E"
          />
        ))}
        <rect x={18} y={48} width={4} height={16} rx={2} fill="#0E9F6E" />
      </svg>
      <span
        className={`${textClass} font-semibold tracking-tight text-[#0F172A]`}
        style={{ fontFamily: "var(--font-logo)" }}
      >
        Pulih Fisioterapi
      </span>
    </span>
  );
}
