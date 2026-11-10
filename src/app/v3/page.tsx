import type { Metadata } from "next";
import Bento from "@/variants/bento/Bento";
import Smooth from "@/variants/Smooth";
import Switcher from "@/variants/Switcher";

export const metadata: Metadata = { title: "Вариант 3 · Бенто — Пикабу Нейро", robots: { index: false } };

export default function Page() {
  return (
    <>
      <Bento />
      <Smooth />
      <Switcher />
    </>
  );
}
