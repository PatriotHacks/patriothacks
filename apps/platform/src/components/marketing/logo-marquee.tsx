import Image from "next/image";

import type { Sponsor } from "@/lib/site-config";

export function LogoMarquee({
  logos,
  size = 40,
  secondsPerLogo = 3.5,
  className = "",
}: {
  logos: Sponsor[];
  size?: number;
  secondsPerLogo?: number;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] ${className}`}
    >
      <ul
        className="animate-marquee flex w-max items-center"
        style={{ animationDuration: `${logos.length * secondsPerLogo}s` }}
      >
        {[...logos, ...logos].map((s, i) => (
          <li
            key={i}
            aria-hidden={i >= logos.length}
            className="flex shrink-0 items-center"
            style={{ height: `${size * 2}px`, paddingInline: `${size}px` }}
          >
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={i >= logos.length ? -1 : undefined}
              className="flex items-center opacity-80 transition hover:opacity-100"
            >
              <Image
                src={s.logo}
                alt={s.name}
                width={0}
                height={0}
                unoptimized
                loading="eager"
                className="w-auto object-contain"
                style={{ height: `${size * (s.scale ?? 1)}px` }}
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
