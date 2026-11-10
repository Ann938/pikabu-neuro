"use client";

import { useState } from "react";
import { faq, footer, header, links, pricing } from "@/content";
import { Icon } from "@/components/Icons";
import Logo from "@/components/Logo";

// Общая разметка повторяющихся блоков. Вид целиком задаёт вариант —
// через свой SCSS-модуль (s), поэтому один и тот же блок выглядит по-разному.
type S = Record<string, string>;
const d = (n: number) => ({ "--d": n }) as React.CSSProperties;

export function TopBar({ s, logo }: { s: S; logo?: React.ReactNode }) {
  return (
    <header className={s.top}>
      <div className={s.topInner}>
        <a href="#top" className={s.topLogo} aria-label="Пикабу Нейро — наверх">
          {logo ?? <Logo />}
        </a>
        <nav className={s.topNav} aria-label="Разделы">
          {header.nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <a href={links.login} className={s.topLogin}>
          {header.login}
        </a>
      </div>
    </header>
  );
}

export function PlanCards({ s }: { s: S }) {
  return (
    <ul className={s.plans}>
      {pricing.plans.map((p, i) => (
        <li key={p.id} className={s.plan} data-plan={p.id} data-reveal style={d(i)}>
          <p className={s.planName}>{p.name}</p>
          <p className={s.planPrice}>
            <b>{p.price}</b>
            <span>{pricing.per}</span>
          </p>
          <p className={s.planCredits}>{p.credits}</p>
          <ul className={s.planFeatures}>
            {p.features.map((f) => (
              <li key={f} data-off={f.startsWith("Без") || undefined}>
                <Icon name={f.startsWith("Без") ? "minus" : "check"} />
                {f}
              </li>
            ))}
          </ul>
          <a className={s.planModels} href={links.pricing} target="_blank" rel="noopener">
            {pricing.models}
            <Icon name="external" />
          </a>
          <a className={s.planCta} href={links.pricing} target="_blank" rel="noopener">
            {p.cta}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function FaqList({ s }: { s: S }) {
  const [open, setOpen] = useState<number | null>(1);
  const [all, setAll] = useState(false);
  return (
    <div className={s.faqList}>
      {faq.items.map((it, i) => {
        const hidden = !all && i >= faq.visible;
        const isOpen = open === i;
        return (
          <div key={it.q} className={s.faqItem} data-open={isOpen || undefined} data-hidden={hidden || undefined}>
            <div className={s.faqInner}>
              <button
                type="button"
                className={s.faqQ}
                aria-expanded={isOpen}
                aria-controls={`fa-${i}`}
                tabIndex={hidden ? -1 : 0}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className={s.faqN}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.faqText}>{it.q}</span>
                <span className={s.faqSign} aria-hidden="true">
                  <i />
                  <i />
                </span>
              </button>
              <div className={s.faqA} id={`fa-${i}`} role="region">
                <p>{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
      {!all && (
        <button type="button" className={s.faqAll} onClick={() => setAll(true)}>
          {faq.showAll}
          <Icon name="down" />
        </button>
      )}
    </div>
  );
}

export function FooterBlock({ s, logo }: { s: S; logo?: React.ReactNode }) {
  return (
    <footer className={s.footer} id="footer">
      <div className={s.footInner}>
        <div className={s.footTop}>
          <a href="#top" aria-label="Пикабу Нейро — наверх">
            {logo ?? <Logo />}
          </a>
          <nav className={s.footNav} aria-label="Подвал">
            {footer.nav.map((n) => (
              <a key={n.label} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
        </div>
        <div className={s.footBottom}>
          <div className={s.footLegal}>
            {footer.legal.map((l) => (
              <a key={l} href="#footer">
                {l}
              </a>
            ))}
          </div>
          <div className={s.footSocial}>
            {footer.social.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export { d };
