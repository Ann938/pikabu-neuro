// Линейные иконки лендинга (вместо символов ✎ ✧ ✦ ▧ из драфта).
// Один стиль: 24×24, штрих 1.7, скруглённые концы, цвет — currentColor.
type P = { className?: string };
const S = ({ children, className }: React.PropsWithChildren<P>) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const icons = {
  pen: (p: P) => (
    <S {...p}>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </S>
  ),
  bulb: (p: P) => (
    <S {...p}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
    </S>
  ),
  spark: (p: P) => (
    <S {...p}>
      <path d="M12 3c.6 3.9 2.1 5.4 6 6-3.9.6-5.4 2.1-6 6-.6-3.9-2.1-5.4-6-6 3.9-.6 5.4-2.1 6-6Z" />
      <path d="M18.5 15.5c.3 1.6.9 2.2 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.3 2.2-.9 2.5-2.5Z" />
    </S>
  ),
  image: (p: P) => (
    <S {...p}>
      <rect x="3" y="4" width="18" height="16" rx="4" />
      <circle cx="9" cy="9.5" r="1.7" />
      <path d="m4 17 4.5-4.5a2 2 0 0 1 2.8 0L18 19" />
      <path d="m14 15 1.5-1.5a2 2 0 0 1 2.8 0L21 16" />
    </S>
  ),
  shield: (p: P) => (
    <S {...p}>
      <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </S>
  ),
  chat: (p: P) => (
    <S {...p}>
      <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4A8 8 0 1 1 20 12Z" />
      <path d="M8.5 11h7M8.5 14h4" />
    </S>
  ),
  bot: (p: P) => (
    <S {...p}>
      <rect x="4" y="8" width="16" height="12" rx="4" />
      <path d="M12 8V4M9.5 4h5" />
      <circle cx="9" cy="14" r="1" fill="currentColor" />
      <circle cx="15" cy="14" r="1" fill="currentColor" />
    </S>
  ),
  layers: (p: P) => (
    <S {...p}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </S>
  ),
  coins: (p: P) => (
    <S {...p}>
      <ellipse cx="9" cy="7" rx="6" ry="3" />
      <path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7" />
      <path d="M9 15v2c0 1.7 2.7 3 6 3s6-1.3 6-3v-5c0-1.6-2.4-2.9-5.5-3" />
    </S>
  ),
  card: (p: P) => (
    <S {...p}>
      <rect x="3" y="5" width="18" height="14" rx="3.5" />
      <path d="M3 10h18M7 15h4" />
    </S>
  ),
  plus: (p: P) => (
    <S {...p}>
      <path d="M12 5v14M5 12h14" />
    </S>
  ),
  up: (p: P) => (
    <S {...p}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </S>
  ),
  down: (p: P) => (
    <S {...p}>
      <path d="m6 9 6 6 6-6" />
    </S>
  ),
  left: (p: P) => (
    <S {...p}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </S>
  ),
  right: (p: P) => (
    <S {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </S>
  ),
  external: (p: P) => (
    <S {...p}>
      <path d="M8 16 16 8M9 8h7v7" />
    </S>
  ),
  check: (p: P) => (
    <S {...p}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </S>
  ),
  minus: (p: P) => (
    <S {...p}>
      <path d="M5 12h14" />
    </S>
  ),
};
export type IconName = keyof typeof icons;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const C = icons[name];
  return <C className={className} />;
}

// Знаки моделей — по мотивам глифов из драфта (✺ ✳ ✦ 𝕏 ≋), не фирменные логотипы.
export function ModelMark({ id, className }: { id: string; className?: string }) {
  const common = { className, viewBox: "0 0 120 120", "aria-hidden": true as const };
  switch (id) {
    case "chatgpt":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={6} strokeLinecap="round">
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse key={i} cx="60" cy="38" rx="15" ry="26" transform={`rotate(${i * 60} 60 60)`} />
          ))}
        </svg>
      );
    case "claude":
      return (
        <svg {...common} fill="currentColor">
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x="56" y="10" width="8" height="44" rx="4" transform={`rotate(${i * 30} 60 60)`} opacity={i % 2 ? 0.75 : 1} />
          ))}
        </svg>
      );
    case "gemini":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="gm" x1="10" y1="10" x2="110" y2="110">
              <stop offset="0" stopColor="#5aa2ff" />
              <stop offset="0.5" stopColor="#2f6be8" />
              <stop offset="1" stopColor="#7b4cf0" />
            </linearGradient>
          </defs>
          <path d="M60 6c3.5 26 17.5 40.5 54 54-36.5 13.5-50.5 28-54 54-3.5-26-17.5-40.5-54-54 36.5-13.5 50.5-28 54-54Z" fill="url(#gm)" />
        </svg>
      );
    case "grok":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={9} strokeLinecap="round">
          <path d="M26 24 94 96" />
          <path d="M94 24 70 49M50 71 26 96" />
        </svg>
      );
    default:
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={7} strokeLinecap="round">
          <path d="M16 44c11-10 22-10 33 0s22 10 33 0 22-10 22-10" />
          <path d="M16 62c11-10 22-10 33 0s22 10 33 0 22-10 22-10" />
          <path d="M16 80c11-10 22-10 33 0s22 10 33 0 22-10 22-10" />
        </svg>
      );
  }
}
