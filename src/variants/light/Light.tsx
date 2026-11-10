"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "@/components/Icons";
import { asset, audiences, benefits, chatWithPrompt, faq, gallery, hero, links, models, pricing, scenarios } from "@/content";
import { FaqList, FooterBlock, PlanCards, TopBar, d } from "../blocks";
import s from "./light.module.scss";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// Вариант 4 «Светлый и дерзкий»: светлый фон как у живого продукта, жирные обводки
// и жёсткие тени, яркие карточки, маскот в роли героя, стикеры можно таскать.

const CARD_TONES = ["cyan", "white", "violet", "green", "blue", "white", "violet", "cyan", "green"];
const AUD_ART = [14, 5, 15, 0, 18];

function LightLogo() {
  return (
    <span className={s.logo}>
      <img src={asset("/img/ui/logo-icon.svg")} alt="" />
      <span>
        пикабу
        <b>НЕЙРО</b>
      </span>
    </span>
  );
}

// Стикер, который можно перетащить мышью или пальцем
function Sticker({ children, className, style }: React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    let sx = 0, sy = 0, ox = 0, oy = 0, drag = false;
    const down = (e: PointerEvent) => {
      drag = true;
      sx = e.clientX;
      sy = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.dataset.drag = "";
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      el.style.translate = `${ox + e.clientX - sx}px ${oy + e.clientY - sy}px`;
    };
    const up = (e: PointerEvent) => {
      if (!drag) return;
      drag = false;
      ox += e.clientX - sx;
      oy += e.clientY - sy;
      delete el.dataset.drag;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);
  return (
    <span ref={ref} className={`${s.sticker} ${className ?? ""}`} style={style}>
      {children}
    </span>
  );
}

// Поле запроса в светлом стиле (запрос уходит в чат продукта)
function Prompt() {
  const [v, setV] = useState("");
  const send = () => window.open(chatWithPrompt(v.trim() || hero.quick[0].prompt), "_blank", "noopener");
  return (
    <div className={s.promptWrap}>
      <form
        className={s.prompt}
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label className="visually-hidden" htmlFor="l-prompt">
          {hero.placeholder}
        </label>
        <input id="l-prompt" value={v} onChange={(e) => setV(e.target.value)} placeholder={hero.placeholder} autoComplete="off" />
        <span className={s.promptModel}>
          <Icon name="spark" />
          {hero.model}
        </span>
        <button type="submit" className={s.promptSend} aria-label="Отправить запрос">
          <Icon name="up" />
        </button>
      </form>
      <div className={s.chips}>
        {hero.quick.map((q) => (
          <button key={q.label} type="button" onClick={() => setV(q.prompt)}>
            <Icon name={q.icon as "pen"} />
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Light() {
  const root = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const el = root.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // маскот поворачивается за курсором
    const mascot = el.querySelector<HTMLElement>("[data-mascot]")!;
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mascot.style.setProperty("--rx", `${-y * 14}deg`);
      mascot.style.setProperty("--ry", `${x * 18}deg`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const ctx = gsap.context(() => {
      if (reduced) return;
      // ленты бегут быстрее и наклоняются при резком скролле
      const bands = gsap.utils.toArray<HTMLElement>("[data-band]");
      const loops = bands.map((b, i) =>
        gsap.to(b, { xPercent: i % 2 ? 0 : -50, startAt: { xPercent: i % 2 ? -50 : 0 }, duration: 26, ease: "none", repeat: -1 }),
      );
      ScrollTrigger.create({
        onUpdate: (st) => {
          const v = gsap.utils.clamp(-1, 1, st.getVelocity() / 2500);
          loops.forEach((l) => gsap.to(l, { timeScale: 1 + Math.abs(v) * 5, duration: 0.3, overwrite: true }));
          gsap.to(bands, { skewX: -v * 10, duration: 0.4, overwrite: "auto" });
        },
      });
      // карточки сценариев влетают с поворотом
      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((c, i) => {
        gsap.from(c, { y: 120, rotate: i % 2 ? 8 : -8, opacity: 0, duration: 0.9, ease: "back.out(1.6)", scrollTrigger: { trigger: c, start: "top 92%" } });
      });
      // заголовок преимуществ едет навстречу
      gsap.fromTo("[data-slide-a]", { xPercent: -12 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: "[data-slide-a]", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo("[data-slide-b]", { xPercent: 10 }, { xPercent: -8, ease: "none", scrollTrigger: { trigger: "[data-slide-b]", start: "top bottom", end: "bottom top", scrub: true } });
    }, el);
    return () => {
      window.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

  const band = [...hero.pills, ...hero.pills, ...hero.pills, ...hero.pills];

  return (
    <div ref={root} className={s.page}>
      <TopBar s={s} logo={<LightLogo />} />

      {/* 01 · Первый экран */}
      <section className={s.hero} id="top">
        <h1 className={s.h1}>
          <span className={s.h1a}>
            Нейросети
            <span className={s.mascot} data-mascot aria-hidden="true">
              <img src={asset("/img/ui/logo-icon.svg")} alt="" />
            </span>
          </span>
          <span className={s.h1b}>онлайн</span>
          <span className={s.h1c}>
            <mark>{hero.title[1]}</mark>
          </span>
        </h1>
        <Sticker className={s.st1}>{hero.pills[0]}</Sticker>
        <Sticker className={s.st2}>{hero.pills[1]}</Sticker>
        <Sticker className={s.st3}>{hero.pills[2]}</Sticker>
        <Sticker className={s.st4}>{hero.pills[3]}</Sticker>
        <p className={s.heroLead}>
          {hero.lead[0]} {hero.lead[1]}
        </p>
        <Prompt />
        <p className={s.free}>{hero.free}</p>
      </section>

      {/* бегущие ленты */}
      <div className={s.bands} aria-hidden="true">
        <div className={s.bandA}>
          <div data-band>
            {band.map((p, i) => (
              <span key={i}>{p}</span>
            ))}
          </div>
        </div>
        <div className={s.bandB}>
          <div data-band>
            {[...models.items, ...models.items, ...models.items, ...models.items].map((m, i) => (
              <span key={i}>{m.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 02 · Сценарии — яркие карточки */}
      <section className={s.section} id="scenarios">
        <h2 className={s.h2}>{scenarios.title}</h2>
        <p className={s.lead}>{scenarios.lead}</p>
        <ul className={s.cards}>
          {scenarios.items.map((it, i) => (
            <li key={it.n} data-card data-tone={CARD_TONES[i]} className={s.card}>
              <span className={s.cardN}>{it.n}</span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
              {it.example && <q className={s.bubble}>{it.example}</q>}
              <a href={it.example ? chatWithPrompt(it.example) : links.chat} target="_blank" rel="noopener" className={s.cardCta}>
                {it.cta}
                <Icon name="right" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 03 · Модели — строки, заливаются цветом */}
      <section className={s.section} id="models">
        <div className={s.split}>
          <div>
            <p className={s.tag}>{models.label}</p>
            <h2 className={s.h2}>{models.title}</h2>
          </div>
          <p className={s.lead}>{models.lead}</p>
        </div>
        <ul className={s.rows}>
          {models.items.map((m, i) => (
            <li key={m.id} style={{ "--tint": m.tint } as React.CSSProperties} data-reveal>
              <a href={links.chat} target="_blank" rel="noopener" className={s.row}>
                <span className={s.rowN}>0{i + 1}</span>
                <span className={s.rowName}>{m.name}</span>
                <span className={s.rowText}>{m.text}</span>
                <span className={s.rowGo}>
                  <Icon name="right" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a className={s.btnInk} href={links.assistants} target="_blank" rel="noopener">
          {models.all}
          <Icon name="right" />
        </a>
      </section>

      {/* 04 · Преимущества */}
      <section className={s.benefits}>
        <p className={s.huge} data-slide-a>
          {benefits.title[0]}
        </p>
        <p className={s.huge} data-slide-b data-outline>
          {benefits.title[1]}
        </p>
        <h2 className="visually-hidden">{benefits.title.join(" ")}</h2>
        <ul className={s.notes}>
          {benefits.items.map((b, i) => (
            <li key={b.title} className={s.note} data-i={i} data-reveal style={d(i % 3)}>
              <span className={s.noteIcon}>
                <Icon name={b.icon as "shield"} />
              </span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 05 · Применение — вкладки-таблетки */}
      <section className={s.section}>
        <p className={s.tag}>{audiences.label}</p>
        <h2 className={s.h2}>{audiences.title.join(" ")}</h2>
        <p className={s.lead}>{audiences.lead}</p>
        <div className={s.pills} role="tablist" aria-label={audiences.label}>
          {audiences.items.map((a, i) => (
            <button key={a.n} type="button" role="tab" aria-selected={i === tab} onClick={() => setTab(i)}>
              {a.title}
            </button>
          ))}
        </div>
        <div className={s.audPanel} role="tabpanel">
          <div key={tab} className={s.audText}>
            <span>{audiences.items[tab].n}</span>
            <h3>{audiences.items[tab].title}</h3>
            <p>{audiences.items[tab].text}</p>
            <a className={s.btn} href={links.chat} target="_blank" rel="noopener">
              {faq.cta}
            </a>
          </div>
          <img key={`i${tab}`} className={s.audImg} src={gallery[AUD_ART[tab]].src} alt="" />
        </div>
      </section>

      {/* 06 · Тарифы */}
      <section className={s.section} id="pricing">
        <div className={s.split}>
          <div>
            <p className={s.tag}>{pricing.label}</p>
            <h2 className={s.h2}>{pricing.title}</h2>
          </div>
          <p className={s.lead}>{pricing.lead}</p>
        </div>
        <PlanCards s={s} />
        <p className={s.small}>{pricing.note}</p>
        <a className={s.btnInk} href={links.pricing} target="_blank" rel="noopener">
          {pricing.more}
          <Icon name="right" />
        </a>
      </section>

      {/* 07 · FAQ */}
      <section className={s.section} id="faq">
        <p className={s.tag}>{faq.label}</p>
        <h2 className={s.h2}>{faq.title}</h2>
        <div className={s.faqWrap}>
          <FaqList s={s} />
        </div>
      </section>

      {/* 08 · Финал */}
      <section className={s.final}>
        <img className={s.finalMascot} src={asset("/img/ui/logo-icon.svg")} alt="" />
        <h2>{faq.ctaTitle}</h2>
        <p>{faq.ctaText}</p>
        <a className={s.btn} href={links.chat} target="_blank" rel="noopener">
          {faq.cta}
        </a>
      </section>

      <FooterBlock s={s} logo={<LightLogo />} />
    </div>
  );
}
