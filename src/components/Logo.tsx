import { asset } from "@/content";

// «пикабу НЕЙРО»: маскот и надпись — SVG из дизайна продукта (Figma 446:22254)
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: "calc(8 * var(--u))" }}>
      <img src={asset("/img/ui/logo-icon.svg")} alt="" style={{ width: "calc(36 * var(--u))", height: "calc(36 * var(--u))" }} />
      <img src={asset("/img/ui/logo-text.svg")} alt="Пикабу Нейро" style={{ width: "calc(76 * var(--u))", height: "calc(36 * var(--u))" }} />
    </span>
  );
}
