"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "./Switcher.module.scss";

// Переключатель вариантов для сравнения (не часть дизайна лендинга)
export const VARIANTS = [
  { href: "/", n: "1", name: "Космос" },
  { href: "/v2", n: "2", name: "Кино" },
  { href: "/v3", n: "3", name: "Бенто" },
  { href: "/v4", n: "4", name: "Светлый" },
  { href: "/v5", n: "5", name: "Галерея" },
];

export default function Switcher() {
  const path = usePathname().replace(/\/$/, "") || "/";
  return (
    <nav className={s.bar} aria-label="Варианты дизайна">
      <span className={s.label}>Вариант</span>
      {VARIANTS.map((v) => (
        <Link key={v.href} href={v.href} className={s.item} aria-current={path === v.href ? "page" : undefined}>
          <b>{v.n}</b>
          <span>{v.name}</span>
        </Link>
      ))}
    </nav>
  );
}
