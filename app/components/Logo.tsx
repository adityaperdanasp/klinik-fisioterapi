import Image from "next/image";

export function Logo({
  className = "",
  size = "default",
}: {
  className?: string;
  size?: "default" | "compact";
}) {
  const height = size === "compact" ? 32 : 44;
  const width = Math.round(height * (1022 / 428));

  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Pulih Fisioterapi"
        width={width}
        height={height}
        className="rounded-md"
        priority
      />
    </span>
  );
}
