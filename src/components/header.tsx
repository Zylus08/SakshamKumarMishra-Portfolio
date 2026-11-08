"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, Sun, Moon, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navigation, configuredSocials } from "@/lib/profile";
import type { ProfessionalDocument } from "@/lib/assets";
import { ResumeMenu } from "./resume-menu";
import { BrandMark } from "./brand-mark";
type Command = { label: string; href?: string };
export function Header({
  entries,
  documents,
}: {
  entries: Command[];
  documents: ProfessionalDocument[];
}) {
  const path = usePathname(),
    router = useRouter(),
    dialog = useRef<HTMLDialogElement>(null),
    input = useRef<HTMLInputElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const [menu, setMenu] = useState(false),
    [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState(0),
    [light, setLight] = useState(false);
  const reduced = useReducedMotion();
  function toggleTheme() {
    const next = document.documentElement.dataset.theme !== "light";
    document.documentElement.dataset.theme = next ? "light" : "dark";
    setLight(next);
    try {
      localStorage.setItem("skm-theme", next ? "light" : "dark");
    } catch {}
  }
  useEffect(() => {
    // Synchronize with the pre-hydration theme script after the DOM is available.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLight(document.documentElement.dataset.theme === "light");
  }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      input.current?.focus();
    } else if (dialog.current?.open) {
      dialog.current.close();
      trigger.current?.focus();
    }
    const old = document.body.style.overflow;
    if (open || menu) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [open, menu]);
  const commands: Command[] = [
    ...navigation.map((n) => ({ label: n.label, href: n.href })),
    ...entries,
    { label: "Contact", href: "/contact" },
    ...configuredSocials().map((link) => ({
      label: link.label,
      href: link.url,
    })),
    { label: "Toggle theme" },
  ];
  const matches = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );
  function run(command: Command) {
    setOpen(false);
    setQuery("");
    setSelected(0);
    setMenu(false);
    if (command.href) {
      if (command.href.startsWith("https://"))
        window.location.assign(command.href);
      else router.push(command.href);
    } else toggleTheme();
  }
  return (
    <>
      <header className="header">
        <Link className="brand" href="/" aria-label="SKM home">
          <BrandMark />
          <span className="brand-word">
            SKM<span>.</span>
          </span>
        </Link>
        <nav aria-label="Primary" className="desktop-nav">
          {navigation.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={
                (n.href === "/" ? path === "/" : path.startsWith(n.href))
                  ? "page"
                  : undefined
              }
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="utilities">
          <ResumeMenu documents={documents} />
          <button
            ref={trigger}
            onClick={() => setOpen(true)}
            aria-label="Open command palette"
          >
            <Search size={17} />
            <kbd>⌘ K</kbd>
          </button>
          <button
            onClick={toggleTheme}
            aria-label={
              light ? "Switch to dark theme" : "Switch to light theme"
            }
          >
            {light ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button
            className="mobile-toggle"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            aria-controls="mobile-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setMenu(false);
            }}
          >
            {navigation.map((n, i) => (
              <Link
                onClick={() => setMenu(false)}
                key={n.href}
                href={n.href}
                aria-current={
                  (n.href === "/" ? path === "/" : path.startsWith(n.href))
                    ? "page"
                    : undefined
                }
              >
                <small>0{i + 1}</small>
                {n.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
      <dialog
        ref={dialog}
        className="palette"
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        aria-labelledby="palette-title"
      >
        <div className="palette-inner">
          <div className="palette-top">
            <h2 id="palette-title">Find your way</h2>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close command palette"
            >
              <X size={20} />
            </button>
          </div>
          <input
            ref={input}
            aria-label="Search pages and work"
            placeholder="Search pages, research, projects…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected((i) => (i + 1) % Math.max(1, matches.length));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected(
                  (i) => (i - 1 + matches.length) % Math.max(1, matches.length),
                );
              }
              if (e.key === "Enter" && matches[selected]) {
                e.preventDefault();
                run(matches[selected]);
              }
            }}
            aria-controls="command-results"
            aria-activedescendant={
              matches.length ? `command-${selected}` : undefined
            }
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
          />
          <div id="command-results" role="listbox" aria-label="Commands">
            {matches.map((c, i) => (
              <button
                id={`command-${i}`}
                key={c.label}
                role="option"
                aria-selected={selected === i}
                onClick={() => run(c)}
              >
                {c.label}
                <span>↗</span>
              </button>
            ))}
          </div>
          {!matches.length && (
            <p role="status">No matches. Try “research” or “theme”.</p>
          )}
          <p className="micro">↑ ↓ to select · enter to open · esc to close</p>
        </div>
      </dialog>
    </>
  );
}
