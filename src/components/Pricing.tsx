import { links, pricing } from "@/content";
import { Icon } from "./Icons";
import s from "./Pricing.module.scss";

// 07 • Тарифы. Нейросфера собирается в четыре планеты — каждая ровно над
// своей карточкой (ряд-ориентир data-planets, центры — по карточкам).
export default function Pricing() {
  return (
    <section className={s.section} id="pricing" data-scene="pricing">
      <div className={s.inner}>
        <p className={s.label} data-reveal>
          {pricing.label}
        </p>
        <h2 className={s.title} data-reveal style={{ "--d": 1 } as React.CSSProperties}>
          {pricing.title}
        </h2>
        <p className={s.lead} data-reveal style={{ "--d": 2 } as React.CSSProperties}>
          {pricing.lead}
        </p>

        {/* ряд, над которым висят планеты из частиц */}
        <div className={s.planets} data-planets aria-hidden="true" />

        <ul className={s.cards}>
          {pricing.plans.map((p, i) => (
            <li key={p.id} className={s.card} data-plan={p.id} data-plan-card data-reveal style={{ "--d": i } as React.CSSProperties}>
              <p className={s.name}>{p.name}</p>
              <p className={s.price}>
                <b>{p.price}</b>
                <span>{pricing.per}</span>
              </p>
              <p className={s.credits}>{p.credits}</p>
              <ul className={s.features}>
                {p.features.map((f) => (
                  <li key={f} data-off={f.startsWith("Без") || undefined}>
                    <Icon name={f.startsWith("Без") ? "minus" : "check"} />
                    {f}
                  </li>
                ))}
              </ul>
              <a className={s.models} href={links.pricing} target="_blank" rel="noopener">
                {pricing.models}
                <Icon name="external" />
              </a>
              <a className={s.cta} href={links.pricing} target="_blank" rel="noopener">
                {p.cta}
              </a>
            </li>
          ))}
        </ul>

        <p className={s.note}>{pricing.note}</p>
        <a className={s.more} href={links.pricing} target="_blank" rel="noopener">
          {pricing.more}
          <Icon name="right" />
        </a>
      </div>
    </section>
  );
}
