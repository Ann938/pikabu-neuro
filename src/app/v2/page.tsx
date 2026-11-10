import type { Metadata } from "next";
import Kino from "@/variants/kino/Kino";
import Smooth from "@/variants/Smooth";
import Switcher from "@/variants/Switcher";

export const metadata: Metadata = { title: "Вариант 2 · Кино — Пикабу Нейро", robots: { index: false } };

export default function Page() {
  return (
    <>
      <Kino />
      <Smooth />
      <Switcher />
    </>
  );
}
