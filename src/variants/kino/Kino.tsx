"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ChatBox from "@/components/ChatBox";
import { Icon } from "@/components/Icons";
import { audiences, benefits, chatWithPrompt, faq, gallery, hero, links, models, pricing, scenarios } from "@/content";
import { FaqList, FooterBlock, PlanCards, TopBar, d } from "../blocks";
import s from "./kino.module.scss";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// Вариант 2 «Кино»: лендинг как один фильм. Сцены закреплены на весь экран,
// запрос печатается и превращается в кадр, сценарии идут главами, модели — титрами.

const GEN = scenarios.items[5]; // «Создать видео» — ночной город (кадр g07 из галереи продукта)
const CHAPTER_ART = [6, 9, 0, 5, 2, 7, 10, 12, 18]; // фон каждой главы — генерации из галереи
const AUD_ART = [14, 5, 15, 17, 18];

export default function Kino() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      // ---- Сцена «Генерация»: запрос печатается → кадр проявляется → раскрывается на весь экран ----
      const typed = el.querySelector<HTMLElement>("[data-typed]")!;
      const full = GEN.example;
      const t = { n: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: "[data-gen]", pin: true, start: "top top", end: "+=320%", scrub: reduced ? true : 0.9 },
      });
      tl.to(t, { n: full.length, duration: 3, onUpdate: () => (typed.textContent = full.slice(0, Math.round(t.n))) })
        .to("[data-send]", { scale: 1.18, duration: 0.3, yoyo: true, repeat: 1 })
        .to("[data-bar]", { y: () => -window.innerHeight * 0.3, opacity: 0, duration: 1.2 }, ">")
        .fromTo("[data-shot]", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 }, "<")
        .fromTo("[data-shot] img", { filter: "blur(28px) saturate(0.2)", scale: 1.25 }, { filter: "blur(0px) saturate(1)", scale: 1.08, duration: 1.6 }, "<0.3")
        .to("[data-shot]", { "--open": 1, duration: 2.2, ease: "power2.inOut" })
        .to("[data-shot] img", { scale: 1, duration: 2.2, ease: "power2.inOut" }, "<")
        .fromTo("[data-gen-title] > *", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.25 }, "-=0.6")
        .to({}, { duration: 0.8 });

      // ---- Главы-сценарии: активная глава по прогрессу ----
      const chapters = el.querySelector<HTMLElement>("[data-chapters]")!;
      const bar = el.querySelector<HTMLElement>("[data-chapter-bar]")!;
      const N = scenarios.items.length;
      ScrollTrigger.create({
        trigger: chapters,
        pin: true,
        start: "top top",
        end: () => `+=${window.innerHeight * 0.75 * N}`,
        onUpdate: (st) => {
          const i = Math.min(N - 1, Math.floor(st.progress * N));
          if (chapters.dataset.active !== String(i)) chapters.dataset.active = String(i);
          bar.style.transform = `scaleY(${st.progress})`;
        },
      });

      // ---- Модели — титры: список едет, в центре горит активная ----
      const reel = el.querySelector<HTMLElement>("[data-reel]")!;
      const rows = Array.from(reel.children) as HTMLElement[];
      const M = rows.length;
      ScrollTrigger.create({
        trigger: "[data-models]",
        pin: true,
        start: "top top",
        end: () => `+=${window.innerHeight * 0.6 * M}`,
        scrub: true,
        onUpdate: (st) => {
          const f = st.progress * (M - 1);
          const h = rows[0].offsetHeight;
          reel.style.transform = `translate3d(0, ${-f * h}px, 0)`;
          rows.forEach((r, i) => {
            const k = Math.max(0, 1 - Math.abs(i - f));
            r.style.setProperty("--k", k.toFixed(3));
          });
          const a = Math.round(f);
          if (reel.dataset.active !== String(a)) reel.dataset.active = String(a);
        },
      });

      // ---- Преимущества: слова заголовка «загораются» по скроллу ----
      gsap.fromTo(
        "[data-words] span",
        { opacity: 0.12 },
        { opacity: 1, stagger: 0.12, ease: "none", scrollTrigger: { trigger: "[data-words]", start: "top 80%", end: "bottom 45%", scrub: true } },
      );

      // ---- Применение: карточки ложатся стопкой, нижние уходят в тень ----
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack] > li");
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(c.firstElementChild, {
          scale: 0.9,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
        });
      });

      // ---- Финальная надпись проезжает по экрану ----
      gsap.fromTo("[data-outro]", { xPercent: 10 }, { xPercent: -30, ease: "none", scrollTrigger: { trigger: "[data-outro]", start: "top bottom", end: "bottom top", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={s.page}>
      <span className={s.grain} aria-hidden="true" />
      <TopBar s={s} />

      {/* 01 · Первый экран: «шторки» кадра раскрываются */}
      <section className={s.hero} id="top">
        <span className={s.beam} aria-hidden="true" />
        <span className={s.letterTop} aria-hidden="true" />
        <span className={s.letterBottom} aria-hidden="true" />
        <ul className={s.pills}>
          {hero.pills.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <h1 className={s.h1}>
          {hero.title.map((line, li) => (
            <span key={line} className={s.h1Line} data-accent={li === 1 || undefined}>
              {line.split(" ").map((w, wi) => (
                <span key={wi} className={s.word}>
                  <span style={{ animationDelay: `${0.25 + li * 0.35 + wi * 0.08}s` }}>{w}</span>
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className={s.heroLead}>
          {hero.lead[0]} {hero.lead[1]}
        </p>
        <div className={s.heroBox}>
          <ChatBox />
        </div>
        <p className={s.heroFree}>{hero.free}</p>
        <span className={s.scrollCue} aria-hidden="true">
          <i />
        </span>
      </section>

      {/* 02 · Сцена генерации: запрос → кадр */}
      <section className={s.gen} data-gen id="scenarios">
        <div className={s.genBar} data-bar>
          <span className={s.genChip}>
            <Icon name="spark" />
            {GEN.title}
          </span>
          <p className={s.genField}>
            <span data-typed />
            <i className={s.caret} />
          </p>
          <span className={s.genSend} data-send>
            <Icon name="up" />
          </span>
        </div>
        <div className={s.shot} data-shot>
          <img src={gallery[7].src} alt="Ночной город — кадр, созданный в Пикабу Нейро" />
          <span className={s.shotShade} />
          <div className={s.genTitle} data-gen-title>
            <h2>{scenarios.title}</h2>
            <p>{scenarios.lead}</p>
          </div>
        </div>
      </section>

      {/* 03 · Главы-сценарии */}
      <section className={s.chapters} data-chapters data-active="0" aria-label="Сценарии">
        {scenarios.items.map((it, i) => (
          <img key={it.n} className={s.chBg} data-i={i} src={gallery[CHAPTER_ART[i]].src} alt="" loading="lazy" />
        ))}
        <span className={s.chShade} aria-hidden="true" />
        <div className={s.chInner}>
          <div className={s.chRail}>
            <span className={s.chTrack}>
              <i data-chapter-bar />
            </span>
            <ol className={s.chList}>
              {scenarios.items.map((it, i) => (
                <li key={it.n} data-i={i}>
                  <span>{it.n}</span>
                  {it.title}
                </li>
              ))}
            </ol>
          </div>
          <div className={s.chStage}>
            {scenarios.items.map((it, i) => (
              <article key={it.n} className={s.chapter} data-i={i}>
                <p className={s.chNum}>
                  Глава {it.n} <span>/ 09</span>
                </p>
                <h3 className={s.chTitle}>{it.title}</h3>
                <p className={s.chText}>{it.text}</p>
                {it.example && <p className={s.chBubble}>{it.example}</p>}
                <a className={s.chCta} href={it.example ? chatWithPrompt(it.example) : links.chat} target="_blank" rel="noopener">
                  {it.cta}
                  <Icon name="right" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 04 · Модели — титры */}
      <section className={s.models} data-models id="models">
        <div className={s.modelsHead}>
          <p className={s.label}>{models.label}</p>
          <h2 className={s.h2}>{models.title}</h2>
          <p className={s.lead}>{models.lead}</p>
          <a className={s.ghostBtn} href={links.assistants} target="_blank" rel="noopener">
            {models.all}
            <Icon name="right" />
          </a>
        </div>
        <div className={s.reelWrap}>
          <ul className={s.reel} data-reel data-active="0">
            {models.items.map((m) => (
              <li key={m.id} style={{ "--tint": m.tint } as React.CSSProperties}>
                <a href={links.chat} target="_blank" rel="noopener" className={s.reelName}>
                  {m.name}
                </a>
                <p className={s.reelText}>{m.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 05 · Преимущества */}
      <section className={s.benefits}>
        <h2 className={s.words} data-words>
          {benefits.title
            .join(" ")
            .split(" ")
            .map((w, i) => (
              <span key={i}>{w} </span>
            ))}
        </h2>
        <ul className={s.benList}>
          {benefits.items.map((b, i) => (
            <li key={b.title} data-reveal style={d(i % 3)}>
              <span className={s.benIcon}>
                <Icon name={b.icon as "shield"} />
              </span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 06 · Применение — стопка кадров */}
      <section className={s.aud}>
        <div className={s.audHead}>
          <p className={s.label}>{audiences.label}</p>
          <h2 className={s.h2}>{audiences.title.join(" ")}</h2>
          <p className={s.lead}>{audiences.lead}</p>
        </div>
        <ul className={s.stack} data-stack>
          {audiences.items.map((a, i) => (
            <li key={a.n} style={{ "--i": i } as React.CSSProperties}>
              <div className={s.stackCard}>
                <img src={gallery[AUD_ART[i]].src} alt="" loading="lazy" />
                <div className={s.stackText}>
                  <span>{a.n}</span>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 07 · Тарифы — билеты на сеанс */}
      <section className={s.pricing} id="pricing">
        <div className={s.center}>
          <p className={s.label}>{pricing.label}</p>
          <h2 className={s.h2}>{pricing.title}</h2>
          <p className={s.lead}>{pricing.lead}</p>
        </div>
        <PlanCards s={s} />
        <p className={s.note}>{pricing.note}</p>
        <a className={s.more} href={links.pricing} target="_blank" rel="noopener">
          {pricing.more}
          <Icon name="right" />
        </a>
      </section>

      {/* 08 · FAQ */}
      <section className={s.faq} id="faq">
        <div className={s.faqHead}>
          <p className={s.label}>{faq.label}</p>
          <h2 className={s.h2}>{faq.title}</h2>
        </div>
        <FaqList s={s} />
      </section>

      {/* 09 · Финал */}
      <section className={s.outro}>
        <p className={s.outroLine} data-outro aria-hidden="true">
          {faq.ctaTitle} · {faq.ctaTitle} ·
        </p>
        <div className={s.outroBox}>
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
