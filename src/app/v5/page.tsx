import type { Metadata } from "next";
import Gallery from "@/variants/gallery/Gallery";
import Smooth from "@/variants/Smooth";
import Switcher from "@/variants/Switcher";

export const metadata: Metadata = { title: "Вариант 5 · Галерея — Пикабу Нейро", robots: { index: false } };

export default function Page() {
  return (
    <>
      <Gallery />
      <Smooth />
      <Switcher />
    </>
  );
}
