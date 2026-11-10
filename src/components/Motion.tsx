"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// Плавный скролл, появление блоков и сцены, привязанные к прокрутке.
// Сфера живёт отдельно (Sphere.tsx); здесь — лента сценариев и блик заголовка.
export default function Motion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Lenis — только на десктопе, якоря ведём через него
    let lenis: Lenis | null = null;
    let raf: ((t: number) => void) | null = null;
    if (!reduced && !touch) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -72 } });
      lenis.on("scroll", ScrollTrigger.update);
      raf = (t: number) => lenis!.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    // Появление: один раз, когда блок заходит в экран
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-revealed", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    document.documentElement.classList.add("motion-ready");

    const mm = gsap.matchMedia();

    // Сценарии: экран закрепляется, лента едет вбок (только ДВ)
    mm.add("(min-width: 1024px)", () => {
      const pin = document.querySelector<HTMLElement>("[data-hpin]");
      const track = document.querySelector<HTMLElement>("[data-htrack]");
      const bar = document.querySelector<HTMLElement>("[data-hprogress]");
      if (!pin || !track) return;
      const margin = () => (window.innerWidth - Math.min(window.innerWidth, 1260 * Math.min(window.innerWidth / 1440, 1.3333))) / 2;
      const dist = () => Math.max(0, track.scrollWidth - (window.innerWidth - track.getBoundingClientRect().left) + margin());
      gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          pin: true,
          start: "top top",
          end: () => `+=${dist()}`,
          scrub: reduced ? true : 0.8,
          invalidateOnRefresh: true,
          refreshPriority: 1, // пин считается раньше остальных триггеров
          onUpdate: (st) => {
            if (bar) bar.style.transform = `scaleX(${st.progress})`;
          },
        },
      });
    });

    // Сияющий заголовок: блик проходит по буквам вместе со скроллом
    if (!reduced) {
      mm.add("all", () => {
        document.querySelectorAll<HTMLElement>("[data-shine]").forEach((el) => {
          gsap.fromTo(
            el,
            { "--shine": "-25%" },
            { "--shine": "125%", ease: "none", scrollTrigger: { trigger: el, start: "top 90%", end: "bottom 30%", scrub: 0.8 } },
          );
        });
      });
    }

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      io.disconnect();
      mm.revert();
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
