"use client";

import { useEffect, useRef, type ReactNode } from "react";

const SHIMMER_MS = 100;
const SHIMMER_SHARE = 0.015;

/** Rerolls a small share of the digits in the art below it every tick. */
export function Shimmer({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = root.querySelectorAll("pre span");
    const count = Math.ceil(spans.length * SHIMMER_SHARE);
    const id = setInterval(() => {
      for (let i = 0; i < count; i++) {
        spans[Math.floor(Math.random() * spans.length)]!.textContent = String(
          Math.floor(Math.random() * 10),
        );
      }
    }, SHIMMER_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <main ref={ref} className={className}>
      {children}
    </main>
  );
}
