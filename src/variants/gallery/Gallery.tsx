"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ChatBox from "@/components/ChatBox";
import { Icon } from "@/components/Icons";
import { asset, audiences, benefits, chatWithPrompt, faq, gallery, hero, links, models, pricing, scenarios } from "@/content";
import { FaqList, FooterBlock, PlanCards, TopBar, d } from "../blocks";
import s from "./gallery.module.scss";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// Вариант 5 «Галерея»: первый экран — живая стена генераций из продукта.
// Дальше всё строится на картинках: сценарии — «запрос → результат», модели —
// карусель, применение — превью за курсором.

// раскладка стены: 8 колонок, в каждой свой набор кадров
const WALL = [
  [7, 0, 13, 18, 4],
  [16, 2, 9, 14, 5],
  [17, 10, 6, 1, 12],
  [8, 15, 3, 19, 0],
  [4, 11, 7, 2, 16],
  [12, 18, 5, 9, 17],
  [1, 14, 19, 6, 10],
  [9, 3, 16, 13, 15],
];
const SC_ART = [6, 9, 0, 5, 2, 7, 10, 12, 18];
const MODEL_ART = [15, 1, 17, 8, 18];
const AUD_ART = [14, 5, 15, 0, 18];

export default function Gallery() {
  const root = useRef<HTMLDivElement>(null);
  const [aud, setAud] = useState(-1);

  useEffect(() => {
    const el = root.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    // стена слегка следует за курсором
    const wall = el.querySelector<HTMLElement>("[data-wall]")!;
    const onMove = (e: PointerEvent) => {
      wall.style.setProperty("--px", `${(e.clientX / window.innerWidth - 0.5) * -40}px`);
      wall.style.setProperty("--py", `${(e.clientY / window.innerHeight - 0.5) * -30}px`);
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    // превью за курсором в «Применении»
    const peek = el.querySelector<HTMLElement>("[data-peek]")!;
    const list = el.querySelector<HTMLElement>("[data-aud]")!;
    const xTo = gsap.quickTo(peek, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(peek, "y", { duration: 0.6, ease: "power3" });
    const onAud = (e: PointerEvent) => {
      const r = list.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    if (fine) list.addEventListener("pointermove", onAud);

    // карусель моделей тянется мышью
    const rail = el.querySelector<HTMLElement>("[data-rail]")!;
    let down = false, sx = 0, sl = 0, moved = false;
    const rd = (e: PointerEvent) => { down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; rail.dataset.drag = ""; };
    const rm = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = sl - dx; };
    const ru = () => { down = false; delete rail.dataset.drag; };
    const rc = (e: MouseEvent) => { if (moved) e.preventDefault(); };
    if (fine) {
      rail.addEventListener("pointerdown", rd);
      window.addEventListener("pointermove", rm);
      window.addEventListener("pointerup", ru);
      rail.addEventListener("click", rc, true);
    }

    const ctx = gsap.context(() => {
      if (reduced) return;
      // при прокрутке стена выпрямляется и уходит вглубь, текст первого экрана растворяется
      gsap.timeline({ scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true } })
        .to("[data-wall-inner]", { "--tilt": 0, "--zoom": 0.82, ease: "none" }, 0)
        .to("[data-hero-copy]", { y: -120, opacity: 0, ease: "none" }, 0);
      // карточки сценариев: параллакс картинок
      gsap.utils.toArray<HTMLElement>("[data-par]").forEach((img) => {
        gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
      // фон-картинка внутри заголовка преимуществ плывёт
      gsap.fromTo("[data-clip]", { backgroundPosition: "50% 0%" }, { backgroundPosition: "50% 100%", ease: "none", scrollTrigger: { trigger: "[data-clip]", start: "top bottom", end: "bottom top", scrub: true } });
    }, el);

    return () => {
      window.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointermove", onAud);
      rail.removeEventListener("pointerdown", rd);
      window.removeEventListener("pointermove", rm);
      window.removeEventListener("pointerup", ru);
      rail.removeEventListener("click", rc, true);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} className={s.page}>
      <TopBar s={s} />

      {/* 01 · Первый экран: стена генераций */}
      <section className={s.hero} id="top" data-hero>
        <div className={s.wall} data-wall aria-hidden="true">
          <div className={s.wallInner} data-wall-inner>
            {WALL.map((col, ci) => (
              <div key={ci} className={s.wallCol} data-dir={ci % 2 ? "down" : "up"} style={{ "--dur": `${46 + ci * 7}s` } as React.CSSProperties}>
                {[...col, ...col].map((g, i) => (
                  <img key={i} src={gallery[g].small} alt="" loading={i < 3 ? "eager" : "lazy"} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <span className={s.vignette} aria-hidden="true" />
        <div className={s.heroCopy} data-hero-copy>
          <ul className={s.pills}>
            {hero.pills.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <h1 className={s.h1}>
            {hero.title[0]}
            <br />
            <span>{hero.title[1]}</span>
          </h1>
          <p className={s.heroLead}>
            {hero.lead[0]} {hero.lead[1]}
          </p>
          <div className={s.heroBox}>
            <ChatBox />
          </div>
        </div>
      </section>

      {/* 02 · Сценарии: запрос → результат */}
      <section className={s.section} id="scenarios">
        <div className={s.head}>
          <h2 className={s.h2} data-reveal>
            {scenarios.title}
          </h2>
          <p className={s.lead} data-reveal style={d(1)}>
            {scenarios.lead}
          </p>
        </div>
        <ul className={s.masonry}>
          {scenarios.items.map((it, i) => (
            <li key={it.n} className={s.shot} data-reveal style={d(i % 3)}>
              <a href={it.example ? chatWithPrompt(it.example) : links.chat} target="_blank" rel="noopener">
                <span className={s.shotImg} data-tall={[1, 4, 6].includes(i) || undefined}>
                  <img src={gallery[SC_ART[i]].src} alt="" loading="lazy" data-par />
                  {it.example && (
                    <span className={s.prompt}>
                      <Icon name="spark" />
                      {it.example}
                    </span>
                  )}
                </span>
                <span className={s.shotMeta}>
                  <span className={s.shotN}>{it.n}</span>
                  <b>{it.title}</b>
                  <span className={s.shotText}>{it.text}</span>
                  <span className={s.shotCta}>
                    {it.cta}
                    <Icon name="right" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 03 · Модели: карусель, тянется мышью */}
      <section className={s.section} id="models">
        <div className={s.headRow}>
          <div className={s.head}>
            <p className={s.label}>{models.label}</p>
            <h2 className={s.h2}>{models.title}</h2>
            <p className={s.lead}>{models.lead}</p>
          </div>
          <a className={s.ghost} href={links.assistants} target="_blank" rel="noopener">
            {models.all}
            <Icon name="right" />
          </a>
        </div>
      </section>
      <div className={s.rail} data-rail>
        {models.items.map((m, i) => (
          <a key={m.id} href={links.chat} target="_blank" rel="noopener" className={s.mCard} style={{ "--tint": m.tint } as React.CSSProperties} draggable={false}>
            <img src={gallery[MODEL_ART[i]].src} alt="" loading="lazy" draggable={false} />
            <span className={s.mTint} />
            <span className={s.mName}>{m.name}</span>
            <span className={s.mText}>{m.text}</span>
            <span className={s.mOpen}>
              {models.open}
              <Icon name="right" />
            </span>
          </a>
        ))}
      </div>

      {/* 04 · Преимущества: заголовок «из картинки» */}
      <section className={s.section}>
        <h2 className={s.clip} data-clip style={{ backgroundImage: `linear-gradient(rgba(150, 175, 255, 0.38), rgba(150, 175, 255, 0.38)), url(${gallery[18].src})` }}>
          {benefits.title[0]}
          <br />
          {benefits.title[1]}
        </h2>
        <ul className={s.ben}>
          {benefits.items.map((b, i) => (
            <li key={b.title} data-reveal style={d(i % 3)}>
              <Icon name={b.icon as "shield"} />
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 05 · Применение: превью за курсором */}
      <section className={s.section}>
        <div className={s.head}>
          <p className={s.label}>{audiences.label}</p>
          <h2 className={s.h2}>{audiences.title.join(" ")}</h2>
          <p className={s.lead}>{audiences.lead}</p>
        </div>
        <ul className={s.aud} data-aud onPointerLeave={() => setAud(-1)}>
          <span className={s.peek} data-peek data-on={aud >= 0 || undefined} aria-hidden="true">
            {AUD_ART.map((g, i) => (
              <img key={g} src={gallery[g].small} alt="" data-on={i === aud || undefined} />
            ))}
          </span>
          {audiences.items.map((a, i) => (
            <li key={a.n} onPointerEnter={() => setAud(i)} data-on={i === aud || undefined}>
              <span className={s.audN}>{a.n}</span>
              <b>{a.title}</b>
              <span className={s.audText}>{a.text}</span>
              <img className={s.audThumb} src={gallery[AUD_ART[i]].small} alt="" loading="lazy" />
            </li>
          ))}
        </ul>
      </section>

      {/* 06 · Тарифы на размытом кадре */}
      <section className={s.pricing} id="pricing">
        <img className={s.pricingBg} src={gallery[0].src} alt="" loading="lazy" />
        <div className={s.pricingInner}>
          <div className={s.head} data-center>
            <p className={s.label}>{pricing.label}</p>
            <h2 className={s.h2}>{pricing.title}</h2>
            <p className={s.lead}>{pricing.lead}</p>
          </div>
          <PlanCards s={s} />
          <p className={s.note}>{pricing.note}</p>
        </div>
      </section>

      {/* 07 · FAQ */}
      <section className={s.section} id="faq">
        <div className={s.faqGrid}>
          <div className={s.head}>
            <p className={s.label}>{faq.label}</p>
            <h2 className={s.h2}>{faq.title}</h2>
          </div>
          <FaqList s={s} />
        </div>
      </section>

      {/* 08 · Финал: лента генераций */}
      <section className={s.final}>
        <div className={s.strip} aria-hidden="true">
          <div>
            {[...gallery, ...gallery].map((g, i) => (
              <img key={i} src={g.small} alt="" loading="lazy" />
            ))}
          </div>
        </div>
        <div className={s.finalBox}>
          <img src={asset("/img/ui/logo-icon.svg")} alt="" className={s.finalIcon} />
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
