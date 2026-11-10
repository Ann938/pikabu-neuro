import Audiences from "@/components/Audiences";
import Benefits from "@/components/Benefits";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Models from "@/components/Models";
import Motion from "@/components/Motion";
import Pricing from "@/components/Pricing";
import Scenarios from "@/components/Scenarios";
import Sphere from "@/components/Sphere";
import Switcher from "@/variants/Switcher";
import { faq, site } from "@/content";

// Разметка вопросов для поисковиков
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: site.name,
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      description: site.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "RUB" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <Sphere />
      <Header />
      <main className="content">
        <Hero />
        <Scenarios />
        <Models />
        <Benefits />
        <Audiences />
        <Pricing />
        <Faq />
      </main>
      <div className="content">
        <Footer />
      </div>
      <Motion />
      <Switcher />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
