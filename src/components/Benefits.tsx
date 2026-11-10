import { benefits } from "@/content";
import { Icon, type IconName } from "./Icons";
import s from "./Benefits.module.scss";

// 05 • Преимущества. Сияющий заголовок (блик идёт по буквам при прокрутке),
// шесть пунктов — чистым текстом. За ними нейросфера ложится волной.
export default function Benefits() {
  return (
    <section className={s.section} data-scene="benefits">
      <h2 className={s.title} data-shine>
        {benefits.title.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </h2>

      <ul className={s.grid}>
        {benefits.items.map((b, i) => (
          <li key={b.title} className={s.item} data-reveal style={{ "--d": i % 3 } as React.CSSProperties}>
            <Icon name={b.icon as IconName} className={s.icon} />
            <h3 className={s.itemTitle}>{b.title}</h3>
            <p className={s.text}>{b.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
