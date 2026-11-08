"use client";
import { useEffect, useRef } from "react";
export function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cleanup = () => {};
    let active = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (!active) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
            gsap.fromTo(
              el,
              { y: 24 },
              {
                y: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 92%", once: true },
              },
            ),
          );
        }, ref);
        cleanup = () => ctx.revert();
      },
    );
    return () => {
      active = false;
      cleanup();
    };
  }, []);
  return <div ref={ref}>{children}</div>;
}
