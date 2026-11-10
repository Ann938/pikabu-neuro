import { chatWithPrompt, links, scenarios } from "@/content";
import { Icon } from "./Icons";
import s from "./Scenarios.module.scss";

// 03 • Сценарии. На ДВ блок закрепляется, и девять сценариев проезжают
// вбок, пока за ними крутится «галактика». Карточки — без коробок:
// номер-контур, заголовок, текст, пример запроса и ссылка в чат.
export default function Scenarios() {
  return (
    <section className={s.section} id="scenarios" data-scene="scenarios">
      <div className={s.pin} data-hpin>
        <div className={s.head}>
          <h2 className={s.title} data-reveal>
            {scenarios.title}
          </h2>
          <p className={s.lead} data-reveal style={{ "--d": 1 } as React.CSSProperties}>
            {scenarios.lead}
          </p>
          <span className={s.progress} aria-hidden="true">
            <i data-hprogress />
          </span>
        </div>
        <div className={s.viewport}>
          <ol className={s.track} data-htrack>
            {scenarios.items.map((it) => (
              <li key={it.n} className={s.card}>
                <span className={s.num} aria-hidden="true">
                  {it.n}
                </span>
                <h3 className={s.cardTitle}>{it.title}</h3>
                <p className={s.text}>{it.text}</p>
                {it.example && <p className={s.example}>«{it.example}»</p>}
                <a className={s.cta} href={it.example ? chatWithPrompt(it.example) : links.chat} target="_blank" rel="noopener">
                  {it.cta}
                  <Icon name="right" />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
