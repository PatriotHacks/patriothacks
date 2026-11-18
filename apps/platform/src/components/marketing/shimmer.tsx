"use client";

import { useEffect, useRef, type ReactNode } from "react";

const SHIMMER_MS = 200;
const SHIMMER_SHARE = 0.015;

/** Rerolls a small share of the digits in the art below it every tick. */
export function Shimmer({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = root.querySelectorAll("pre span");
    const count = Math.ceil(spans.length * SHIMMER_SHARE);
    const tick = () => {
      for (let i = 0; i < count; i++) {
        spans[Math.floor(Math.random() * spans.length)]!.textContent = String(
          Math.floor(Math.random() * 10),
        );
      }
    };
    let id: ReturnType<typeof setInterval> | undefined;
    let onScreen = false;
    const update = () => {
      clearInterval(id);
      id = onScreen && !document.hidden ? setInterval(tick, SHIMMER_MS) : undefined;
    };
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry!.isIntersecting;
      update();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      clearInterval(id);
    };
  }, []);

  return (
    <main ref={ref} className={className}>
      {children}
    </main>
  );
}
