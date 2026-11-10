"use client";

import { useEffect, useState } from "react";
import { header, links } from "@/content";
import Logo from "./Logo";
import s from "./Header.module.scss";

// Шапка: прозрачная над первым экраном, при прокрутке — стеклянная панель
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={s.header} data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <div className={s.inner}>
        <a href="#top" className={s.logo} aria-label="Пикабу Нейро — наверх">
          <Logo />
        </a>
        <nav className={s.nav} aria-label="Разделы">
          {header.nav.map((n) => (
            <a key={n.href} href={n.href} className={s.link} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className={s.actions}>
          <a href={links.login} className={s.login}>
            {header.login}
          </a>
          <button
            type="button"
            className={s.burger}
            aria-expanded={open}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
