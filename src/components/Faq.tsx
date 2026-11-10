"use client";

import { useState } from "react";
import { faq, links } from "@/content";
import { Icon } from "./Icons";
import s from "./Faq.module.scss";

// 08–09 • FAQ + «Начать бесплатно». Открыт второй вопрос — как в драфте.
export default function Faq() {
  const [open, setOpen] = useState<number | null>(1);
  const [all, setAll] = useState(false);

  return (
    <section className={s.section} id="faq" data-scene="faq">
      <div className={s.panel}>
        <span className={s.glow} aria-hidden="true" />
        <div className={s.side}>
          <p className={s.label}>{faq.label}</p>
          <h2 className={s.title}>{faq.title}</h2>
          <div className={s.cta}>
            <h3 className={s.ctaTitle}>{faq.ctaTitle}</h3>
            <p className={s.ctaText}>{faq.ctaText}</p>
            <a href={links.chat} target="_blank" rel="noopener" className={s.btn}>
              {faq.cta}
            </a>
          </div>
        </div>

        <div className={s.list}>
          {faq.items.map((it, i) => {
            const hidden = !all && i >= faq.visible;
            const isOpen = open === i;
            return (
              <div key={it.q} className={s.item} data-open={isOpen || undefined} data-hidden={hidden || undefined}>
                <div className={s.itemInner}>
                  <button
                    type="button"
                    className={s.q}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    tabIndex={hidden ? -1 : 0}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className={s.n}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={s.qText}>{it.q}</span>
                    <span className={s.sign} aria-hidden="true">
                      <i />
                      <i />
                    </span>
                  </button>
                  <div className={s.a} id={`faq-a-${i}`} role="region">
                    <p>{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {!all && (
            <button type="button" className={s.all} onClick={() => setAll(true)}>
              {faq.showAll}
              <Icon name="external" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
