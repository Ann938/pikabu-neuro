"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NeuroSphere, type SphereState } from "@/three/NeuroSphere";
import s from "./Sphere.module.scss";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Scene = "hero" | "scenarios" | "models" | "benefits" | "audiences" | "pricing" | "faq";
const ORDER: Scene[] = ["hero", "scenarios", "models", "benefits", "audiences", "pricing", "faq"];

// Состояние сферы для каждого блока: форма, место на экране, наклон, яркость
const DESKTOP: Record<Scene, SphereState> = {
  hero: { morph: 0, x: 0, y: -0.2, scale: 1.08, spin: 0, tilt: 0.35, glow: 1 },
  scenarios: { morph: 1, x: 0, y: -0.35, scale: 1.2, spin: 0, tilt: 1.05, glow: 0.75 },
  models: { morph: 2, x: 2.75, y: 0, scale: 0.85, spin: 0, tilt: 0, glow: 1 },
  benefits: { morph: 3, x: 0, y: -1.35, scale: 1, spin: 0, tilt: 0.55, glow: 0.7 },
  audiences: { morph: 4, x: -2.3, y: -2.2, scale: 0.6, spin: 0, tilt: 0.25, glow: 0.6 },
  pricing: { morph: 5, x: 0, y: 0, scale: 1, spin: 0, tilt: 0, glow: 1 },
  faq: { morph: 6, x: -3.35, y: -0.9, scale: 1.15, spin: 0, tilt: 0.35, glow: 0.55 },
};
// На телефоне сфера всегда по центру и меньше — текст идёт поверх неё
// на телефоне сфера — фон под текстом, поэтому тише
const MOBILE: Record<Scene, SphereState> = {
  hero: { morph: 0, x: 0, y: 0.15, scale: 0.62, spin: 0, tilt: 0.35, glow: 0.6 },
  scenarios: { morph: 1, x: 0, y: -0.2, scale: 0.55, spin: 0, tilt: 1.05, glow: 0.4 },
  models: { morph: 2, x: 0, y: 0.25, scale: 0.55, spin: 0, tilt: 0, glow: 0.45 },
  benefits: { morph: 3, x: 0, y: -0.6, scale: 0.6, spin: 0, tilt: 0.55, glow: 0.45 },
  audiences: { morph: 4, x: 0, y: 0, scale: 0.45, spin: 0, tilt: 0.25, glow: 0.4 },
  pricing: { morph: 5, x: 0, y: 0, scale: 0.62, spin: 0, tilt: 0, glow: 0.8 },
  faq: { morph: 6, x: 0, y: 0, scale: 0.6, spin: 0, tilt: 0.35, glow: 0.3 },
};

// Один WebGL-холст на всю страницу, закреплён под содержимым
export default function Sphere() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    let sphere: NeuroSphere;
    try {
      sphere = new NeuroSphere(el, { count: mobile ? 5200 : 11000, reduced, dprMax: mobile ? 1.5 : 1.75 });
    } catch {
      return; // без WebGL страница просто остаётся без сферы
    }
    const states = mobile ? MOBILE : DESKTOP;
    Object.assign(sphere.state, states.hero);

    // ---- Планеты «Тарифов» — точно над колонками карточек ----
    const placePlanets = () => {
      const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-plan-card]"));
      if (cards.length !== 4) return;
      const centers = cards.map((c) => {
        const r = c.getBoundingClientRect();
        const w = sphere.screenToWorld(r.left + r.width / 2, window.innerHeight / 2);
        return [w.x, 0] as [number, number];
      });
      // на телефоне карточки в колонку — планеты ставим в ряд по центру
      sphere.setPlanets(mobile ? [[-0.9, 0], [-0.3, 0], [0.3, 0], [0.9, 0]] : centers);
    };

    // ---- Переходы между блоками по скроллу ----
    const ctx = gsap.context(() => {
      ORDER.forEach((name, i) => {
        if (i === 0) return;
        const section = document.querySelector(`[data-scene="${name}"]`);
        if (!section) return;
        gsap.fromTo(sphere.state, { ...states[ORDER[i - 1]] }, {
          ...states[name],
          ease: "none",
          immediateRender: false,
          // переход идёт, пока блок поднимается от низа экрана к середине
          scrollTrigger: { trigger: section, start: "top 75%", end: "top 30%", scrub: reduced ? true : 1 },
        });
      });
      // в «Сценариях» галактика проворачивается вместе с горизонтальной лентой
      const sc = document.querySelector("[data-scene=scenarios]");
      if (sc && !mobile) {
        gsap.to(sphere.state, {
          spin: Math.PI * 0.9,
          ease: "none",
          scrollTrigger: { trigger: sc, start: "top top", end: "bottom bottom", scrub: 1 },
        });
      }
    });

    // Планеты держатся на уровне ряда-ориентира, пока блок едет по экрану
    const row = document.querySelector<HTMLElement>("[data-planets]");
    const track = () => {
      const st = sphere.state;
      const w = Math.max(0, 1 - Math.abs(st.morph - 5));
      if (!row || w <= 0) return;
      const r = row.getBoundingClientRect();
      const target = sphere.screenToWorld(window.innerWidth / 2, r.top + r.height / 2).y;
      st.y = st.y * (1 - w) + target * w;
    };
    gsap.ticker.add(track);

    // ---- Курсор, фокус модели, размер, видимость ----
    const onMove = (e: PointerEvent) => {
      sphere.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      sphere.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onFocus = (e: Event) => {
      const idx = (e as CustomEvent<number>).detail;
      if (idx >= 0) sphere.focus.index = idx;
      sphere.focus.target = idx >= 0 ? 1 : 0;
    };
    const onResize = () => sphere.resize();
    const onRefresh = () => placePlanets();
    const onVis = () => (document.hidden ? sphere.stop() : sphere.start());
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("neuro-focus", onFocus);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    ScrollTrigger.addEventListener("refresh", onRefresh);

    placePlanets();
    sphere.start();
    el.dataset.ready = "";

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("neuro-focus", onFocus);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(track);
      ctx.revert();
      sphere.dispose();
    };
  }, []);

  return <canvas ref={canvas} className={s.canvas} aria-hidden="true" />;
}
