import { footer } from "@/content";
import Logo from "./Logo";
import s from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={s.footer} id="footer">
      <div className={s.inner}>
        <div className={s.top}>
          <a href="#top" className={s.logo} aria-label="Пикабу Нейро — наверх">
            <Logo />
          </a>
          <nav className={s.nav} aria-label="Подвал">
            {footer.nav.map((n) => (
              <a key={n.label} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
        </div>
        <div className={s.bottom}>
          <div className={s.legal}>
            {footer.legal.map((l) => (
              <a key={l} href="#footer">
                {l}
              </a>
            ))}
          </div>
          <div className={s.social}>
            {footer.social.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
