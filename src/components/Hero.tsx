import { hero } from "@/content";
import ChatBox from "./ChatBox";
import s from "./Hero.module.scss";

// 02 • Первый экран. Доминанта — нейросфера за заголовком (холст Sphere),
// поверх — только заголовок и поле запроса. Никаких лишних рамок.
export default function Hero() {
  return (
    <section className={s.hero} id="top" data-scene="hero">
      <div className={s.inner}>
        <p className={s.pills} data-reveal>
          {hero.pills.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </p>

        <h1 className={s.title} data-reveal style={{ "--d": 1 } as React.CSSProperties}>
          <span>{hero.title[0]}</span>
          <span className={s.accent}>{hero.title[1]}</span>
        </h1>

        <p className={s.lead} data-reveal style={{ "--d": 2 } as React.CSSProperties}>
          {hero.lead.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </p>

        <div className={s.chat} data-reveal style={{ "--d": 3 } as React.CSSProperties}>
          <ChatBox />
        </div>

        <p className={s.free} data-reveal style={{ "--d": 4 } as React.CSSProperties}>
          {hero.free}
          <span className={s.sep}>·</span>
          {hero.hint}
        </p>
      </div>
      <span className={s.scroll} aria-hidden="true" />
    </section>
  );
}
