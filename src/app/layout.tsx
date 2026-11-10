import type { Metadata, Viewport } from "next";
import { Golos_Text } from "next/font/google";
import { asset, site } from "@/content";
import "@/styles/globals.scss";

// Golos Text — шрифт продукта Пикабу Нейро
const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  // опубликованный черновик не должен попадать в поиск
  robots: process.env.PAGES_EXPORT === "1" ? { index: false, follow: false } : undefined,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3200"),
  title: site.title,
  description: site.description,
  keywords: ["нейросети онлайн", "нейросеть без VPN", "ChatGPT на русском", "Claude", "Gemini", "DeepSeek", "Пикабу Нейро", "генерация изображений"],
  icons: { icon: asset("/img/ui/logo-icon.svg") },
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  themeColor: "#03040d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={golos.variable}>
      <body>{children}</body>
    </html>
  );
}
