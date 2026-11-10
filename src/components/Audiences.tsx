"use client";

import { useEffect, useRef, useState } from "react";
import { audiences, links } from "@/content";
import { Icon } from "./Icons";
import s from "./Audiences.module.scss";

// 06 • Применение. Слева закреплён заголовок, за ним — спираль из частиц.
// Справа пять направлений; активное — то, что у середины экрана (или под курсором).
export default function Audiences() {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLUListElement>(null);
  const hovering = useRef(false);

  useEffect(() => {
    const items = Array.from(list.current?.children ?? []) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        if (hovering.current) return;
        for (const e of entries) if (e.isIntersecting) setActive(items.indexOf(e.target as HTMLElement));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className={s.section} data-scene="audiences">
      <div className={s.inner}>
        <div className={s.side}>
          <div className={s.sticky}>
            <p className={s.label}>{audiences.label}</p>
            <h2 className={s.title}>
              {audiences.title.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </h2>
            <p className={s.lead}>{audiences.lead}</p>
          </div>
        </div>

        <ul className={s.list} ref={list}>
          {audiences.items.map((it, i) => (
            <li
              key={it.n}
              data-on={i === active || undefined}
              onPointerEnter={() => {
                hovering.current = true;
                setActive(i);
              }}
              onPointerLeave={() => {
                hovering.current = false;
              }}
            >
              <a href={links.chat} target="_blank" rel="noopener" className={s.row}>
                <span className={s.n}>{it.n}</span>
                <span className={s.body}>
                  <span className={s.rowTitle}>{it.title}</span>
                  <span className={s.text}>{it.text}</span>
                </span>
                <Icon name="external" className={s.go} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
