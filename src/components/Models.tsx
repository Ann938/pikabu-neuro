"use client";

import { links, models } from "@/content";
import { Icon } from "./Icons";
import s from "./Models.module.scss";

// 04 • Модели. Справа нейросфера распадается на ядро и пять сфер-моделей;
// наведение на модель в списке подсвечивает её сферу (событие neuro-focus).
const focus = (i: number) => window.dispatchEvent(new CustomEvent("neuro-focus", { detail: i }));

export default function Models() {
  return (
    <section className={s.section} id="models" data-scene="models">
      <div className={s.inner}>
        <p className={s.label} data-reveal>
          {models.label}
        </p>
        <h2 className={s.title} data-reveal style={{ "--d": 1 } as React.CSSProperties}>
          {models.title}
        </h2>
        <p className={s.lead} data-reveal style={{ "--d": 2 } as React.CSSProperties}>
          {models.lead}
        </p>

        <ul className={s.list} onPointerLeave={() => focus(-1)}>
          {models.items.map((m, i) => (
            <li key={m.id} data-reveal style={{ "--d": i, "--tint": m.tint } as React.CSSProperties}>
              <a
                className={s.row}
                href={links.chat}
                target="_blank"
                rel="noopener"
                onPointerEnter={() => focus(i)}
                onFocus={() => focus(i)}
                onBlur={() => focus(-1)}
              >
                <span className={s.dot} aria-hidden="true" />
                <span className={s.name}>{m.name}</span>
                <span className={s.text}>
                  <span>{m.text}</span>
                </span>
                <span className={s.open}>
                  {models.open}
                  <Icon name="right" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <a className={s.all} href={links.assistants} target="_blank" rel="noopener">
          {models.all}
          <Icon name="right" />
        </a>
      </div>
    </section>
  );
}
