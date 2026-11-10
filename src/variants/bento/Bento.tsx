"use client";

import { useEffect, useRef, useState } from "react";
import ChatBox from "@/components/ChatBox";
import { Icon } from "@/components/Icons";
import { audiences, benefits, chatWithPrompt, faq, gallery, hero, links, models, pricing, scenarios } from "@/content";
import { FaqList, FooterBlock, PlanCards, TopBar, d } from "../blocks";
import s from "./bento.module.scss";

// Вариант 3 «Бенто»: редакционная подача — крупный шрифт, воздух, плитки разного
// размера с живыми кусками продукта. Свечений почти нет, движение — точечное.

const SHOW = [0, 7, 15, 16, 17, 2, 9, 18]; // ротация генераций в плитке «изображения»
const SC_ART: Record<number, number> = { 4: 16, 5: 7, 7: 12 }; // сценарии с картинкой
const AUD_ART = [14, 5, 15, 0, 18];

// Плавающий свет под курсором во всех плитках
function useSpotlight(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const on = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-tile]");
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--mx", `${e.clientX - r.left}px`);
      t.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("pointermove", on);
    return () => el.removeEventListener("pointermove", on);
  }, [ref]);
}

// Счётчик «80+» при появлении
function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{to}</span>;
}

// Плитка с генерациями: кадры сменяют друг друга
function Slides() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SHOW.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className={s.slides}>
      {SHOW.map((g, k) => (
        <img key={g} src={gallery[g].small} alt="" data-on={k === i || undefined} loading={k ? "lazy" : undefined} />
      ))}
    </div>
  );
}

// Модели: вкладки с автопереключением и полосой прогресса
function ModelTabs() {
  const [a, setA] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setA((v) => (v + 1) % models.items.length), 5000);
    return () => clearTimeout(t);
  }, [a, paused]);
  const m = models.items[a];
  return (
    <div className={s.tabsWrap} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className={s.tabs} role="tablist" aria-label="Модели">
        {models.items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={i === a}
            className={s.tab}
            onClick={() => setA(i)}
            style={{ "--tint": it.tint } as React.CSSProperties}
          >
            {it.name}
            {i === a && <i key={`${a}-${paused}`} className={s.tabBar} data-paused={paused || undefined} />}
          </button>
        ))}
      </div>
      <div className={s.panel} role="tabpanel" data-tile style={{ "--tint": m.tint } as React.CSSProperties}>
        <span className={s.panelGlow} aria-hidden="true" />
        <p key={m.id + "n"} className={s.panelName}>
          {m.name}
        </p>
        <p key={m.id + "t"} className={s.panelText}>
          {m.text}
        </p>
        <a className={s.panelCta} href={links.chat} target="_blank" rel="noopener">
          {models.open}
          <Icon name="right" />
        </a>
      </div>
    </div>
  );
}

export default function Bento() {
  const root = useRef<HTMLDivElement>(null);
  const [aud, setAud] = useState(0);
  useSpotlight(root);

  return (
    <div ref={root} className={s.page}>
      <TopBar s={s} />

      {/* 01 · Первый экран: крупная строка + бенто с продуктом */}
      <section className={s.hero} id="top">
        <div className={s.heroHead}>
          <h1 className={s.h1} data-reveal>
            {hero.title[0]}
            <br />
            <span>{hero.title[1]}</span>
          </h1>
          <div className={s.heroSide} data-reveal style={d(2)}>
            <p>
              {hero.lead[0]} {hero.lead[1]}
            </p>
            <a className={s.btn} href={links.chat} target="_blank" rel="noopener">
              {faq.cta}
            </a>
            <small>{hero.free}</small>
          </div>
        </div>

        <div className={s.grid}>
          <div className={`${s.tile} ${s.tChat}`} data-tile data-reveal>
            <p className={s.tileLabel}>{hero.hint}</p>
            <ChatBox />
          </div>
          <div className={`${s.tile} ${s.tImage}`} data-tile data-reveal style={d(1)}>
            <Slides />
            <p className={s.tileCap}>
              <Icon name="image" />
              {scenarios.items[4].title}
            </p>
          </div>
          <div className={`${s.tile} ${s.tCount}`} data-tile data-reveal style={d(2)}>
            <p className={s.big}>
              <Counter to={80} />+
            </p>
            <p className={s.tileSmall}>{hero.pills[3].replace("80+ ", "")}</p>
          </div>
          <div className={`${s.tile} ${s.tModels}`} data-tile data-reveal style={d(3)}>
            <div className={s.marquee}>
              <div>
                {[...models.items, ...models.items].map((m, i) => (
                  <span key={i} style={{ "--tint": m.tint } as React.CSSProperties}>
                    <i />
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
            <p className={s.tileSmall}>{models.title}</p>
          </div>
          <div className={`${s.tile} ${s.tVideo}`} data-tile data-reveal style={d(1)}>
            <img src={gallery[17].src} alt="" />
            <span className={s.play} aria-hidden="true" />
            <p className={s.tileCap}>{scenarios.items[5].title}</p>
          </div>
          {benefits.items.slice(0, 2).map((b, i) => (
            <div key={b.title} className={`${s.tile} ${s.tFact}`} data-tile data-reveal style={d(2 + i)}>
              <Icon name={b.icon as "shield"} className={s.factIcon} />
              <p className={s.factTitle}>{b.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 02 · Сценарии — бенто разных размеров */}
      <section className={s.section} id="scenarios">
        <div className={s.head}>
          <h2 className={s.h2} data-reveal>
            {scenarios.title}
          </h2>
          <p className={s.lead} data-reveal style={d(1)}>
            {scenarios.lead}
          </p>
        </div>
        <div className={s.scGrid}>
          {scenarios.items.map((it, i) => {
            const art = SC_ART[i];
            return (
              <a
                key={it.n}
                href={it.example ? chatWithPrompt(it.example) : links.chat}
                target="_blank"
                rel="noopener"
                className={s.tile}
                data-tile
                data-sc={i}
                data-art={art !== undefined || undefined}
                data-reveal
                style={d(i % 3)}
              >
                {art !== undefined && <img className={s.scImg} src={gallery[art].src} alt="" loading="lazy" />}
                <span className={s.scN}>{it.n}</span>
                <div className={s.scBody}>
                  <h3>{it.title}</h3>
                  <p>{it.text}</p>
                  {it.example && <q>{it.example}</q>}
                </div>
                <span className={s.scCta}>
                  {it.cta}
                  <Icon name="right" />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* 03 · Модели — вкладки */}
      <section className={s.section} id="models">
        <div className={s.head}>
          <p className={s.label} data-reveal>
            {models.label}
          </p>
          <h2 className={s.h2} data-reveal style={d(1)}>
            {models.title}
          </h2>
          <p className={s.lead} data-reveal style={d(2)}>
            {models.lead}
          </p>
        </div>
        <div data-reveal>
          <ModelTabs />
        </div>
        <a className={s.textLink} href={links.assistants} target="_blank" rel="noopener">
          {models.all}
          <Icon name="right" />
        </a>
      </section>

      {/* 04 · Преимущества — лист характеристик */}
      <section className={s.section}>
        <h2 className={s.display} data-reveal>
          {benefits.title[0]}
          <br />
          <span>{benefits.title[1]}</span>
        </h2>
        <dl className={s.specs}>
          {benefits.items.map((b, i) => (
            <div key={b.title} data-reveal style={d(i % 2)}>
              <dt>
                <Icon name={b.icon as "shield"} />
                {b.title}
              </dt>
              <dd>{b.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 05 · Применение — раскрывающиеся колонки */}
      <section className={s.section}>
        <div className={s.head}>
          <p className={s.label} data-reveal>
            {audiences.label}
          </p>
          <h2 className={s.h2} data-reveal style={d(1)}>
            {audiences.title.join(" ")}
          </h2>
          <p className={s.lead} data-reveal style={d(2)}>
            {audiences.lead}
          </p>
        </div>
        <ul className={s.cols} data-reveal>
          {audiences.items.map((a, i) => (
            <li key={a.n} data-on={i === aud || undefined}>
              <button type="button" className={s.col} aria-expanded={i === aud} onClick={() => setAud(i)} onPointerEnter={() => setAud(i)}>
                <img src={gallery[AUD_ART[i]].src} alt="" loading="lazy" />
                <span className={s.colN}>{a.n}</span>
                <span className={s.colBody}>
                  <b>{a.title}</b>
                  <span>{a.text}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* 06 · Тарифы — таблица */}
      <section className={s.section} id="pricing">
        <div className={s.head} data-center>
          <p className={s.label} data-reveal>
            {pricing.label}
          </p>
          <h2 className={s.h2} data-reveal style={d(1)}>
            {pricing.title}
          </h2>
          <p className={s.lead} data-reveal style={d(2)}>
            {pricing.lead}
          </p>
        </div>
        <PlanCards s={s} />
        <p className={s.note}>{pricing.note}</p>
        <a className={s.textLink} data-center href={links.pricing} target="_blank" rel="noopener">
          {pricing.more}
          <Icon name="right" />
        </a>
      </section>

      {/* 07 · FAQ — узкая колонка */}
      <section className={s.section} id="faq">
        <div className={s.head} data-center>
          <p className={s.label}>{faq.label}</p>
          <h2 className={s.h2}>{faq.title}</h2>
        </div>
        <div className={s.faqCol}>
          <FaqList s={s} />
        </div>
      </section>

      {/* 08 · Призыв — большая плитка */}
      <section className={s.section}>
        <div className={`${s.tile} ${s.cta}`} data-tile data-reveal>
          <span className={s.mesh} aria-hidden="true" />
          <h2 className={s.h2}>{faq.ctaTitle}</h2>
          <p className={s.lead}>{faq.ctaText}</p>
          <a className={s.btn} href={links.chat} target="_blank" rel="noopener">
            {faq.cta}
          </a>
        </div>
      </section>

      <FooterBlock s={s} />
    </div>
  );
}
