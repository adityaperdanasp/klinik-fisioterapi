import Image from "next/image";

export function Logo({
  className = "",
  size = "default",
  variant = "dark",
}: {
  className?: string;
  size?: "default" | "compact";
  /** Text color of the logo file: "dark" for light backgrounds, "light" for dark backgrounds. */
  variant?: "dark" | "light";
}) {
  const height = size === "compact" ? 50 : 68;
  const width = Math.round(height * (1022 / 428));
  const src = variant === "light" ? "/logo-white.png" : "/logo-dark.png";

  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image src={src} alt="Pulih Fisioterapi" width={width} height={height} priority />
    </span>
  );
}
