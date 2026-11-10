import type { Metadata } from "next";
import Light from "@/variants/light/Light";
import Smooth from "@/variants/Smooth";
import Switcher from "@/variants/Switcher";

export const metadata: Metadata = { title: "Вариант 4 · Светлый — Пикабу Нейро", robots: { index: false } };

export default function Page() {
  return (
    <>
      <Light />
      <Smooth />
      <Switcher />
    </>
  );
}
