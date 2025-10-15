"use client";
import Image from "next/image";

interface LogoProps {
  className?: string;
  priority?: boolean;
}

export default function Logo({ className, priority = true }: LogoProps) {
  return (
    <div className={className}>
      <Image
        src="/logotransparent.png"
        alt="The Rock Salt logo"
        width={800}
        height={400}
        priority={priority}
        className="mx-auto h-auto w-full max-w-[520px]"
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement
          if (img.src.endsWith('/logotransparent.png')) {
            img.src = '/rock-salt-logo.svg'
          }
        }}
      />
    </div>
  );
}
