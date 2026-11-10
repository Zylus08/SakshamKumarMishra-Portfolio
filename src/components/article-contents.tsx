"use client";

import { useEffect, useState } from "react";
import type { ArticleHeading } from "@/lib/article-headings";

export function ArticleContents({ headings }: { headings: ArticleHeading[] }) {
  const [active, setActive] = useState(headings[0]?.id);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = headings[0]?.id;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= 150)
          current = heading.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  if (!headings.length) return null;
  return (
    <aside className="contents">
      <p className="micro">IN THIS NOTE</p>
      <nav aria-label="Article sections">
        {headings.map(({ id, title, level }) => (
          <a
            key={id}
            href={`#${id}`}
            data-level={level}
            aria-current={active === id ? "location" : undefined}
          >
            {title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
