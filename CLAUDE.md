@AGENTS.md

# Пикабу Нейро — лендинг

Драфт лендинга: Figma `IksG4RrSMnbyTjK8qbG5HH`, узел `446:599` (тексты блоков — дословно оттуда, включая скрытые слои:
примеры запросов и 15 ответов FAQ). Дизайн продукта (галерея, чаты, токены): узел `446:22254`.
Живой продукт: https://neuro.pikabu.ru/chat

## Стек и правила
- Next 16 (App Router) + SCSS-модули, GSAP ScrollTrigger + Lenis. Без Tailwind.
- Размеры через `u()` (`src/styles/_core.scss`): ДВ — макет 1440, контент 1260; МВ (≤1023) — колонка 358 = экран − 32.
- Палитра — токены продукта в `globals.scss` (`--bg #03040d`, `--primary #3d4cbf`, градиент маскота cyan/blue/violet).
  Главное действие — зелёная кнопка Пикабу (`--green`), остальное тише. Шрифт — Golos Text.
- Все тексты и ссылки — `src/content.ts` (`links.*` ведут в продукт; запрос из поля — `chatWithPrompt`).
- Иконки — SVG в `Icons.tsx`; знаки моделей стилизованы по глифам драфта, не фирменные логотипы.

## Блоки (src/components) — редизайн «3D-космос»
Одна WebGL-нейросфера на всю страницу: `src/three/NeuroSphere.ts` (частицы three.js, формы sphere/galaxy/orbs/wave/helix/planets/calm,
поэтапный морф, реакция на курсор) + `Sphere.tsx` (фиксированный canvas, таблицы состояний DESKTOP/MOBILE по `data-scene`,
переходы по ScrollTrigger, планеты считаются по `[data-plan-card]`, фокус модели — событие `neuro-focus`).
Hero (ChatBox) → Scenarios (пин + горизонтальная лента `[data-hpin]`/`[data-htrack]` в Motion.tsx) → Models (список, сфера
делится на 6 шаров) → Benefits (сияющий заголовок `[data-shine]`) → Audiences (липкий заголовок, активная строка) →
Pricing (4 планеты над карточками) → Faq → Footer. На телефоне сфера приглушена (glow), пина нет — свайп-лента.

## Варианты дизайна для сравнения (src/variants, переключатель внизу экрана — Switcher.tsx)
- `/` — 1 «Космос» (основной, WebGL-сфера) · `/v2` — 2 «Кино» (пин-сцены: запрос → кадр, главы, титры моделей, стопка)
- `/v3` — 3 «Бенто» (редакционный, плитки, вкладки моделей, тарифы таблицей) · `/v4` — 4 «Светлый» (необрутализм, стикеры, маскот)
- `/v5` — 5 «Галерея» (стена генераций на первом экране, кирпичная кладка, превью за курсором)
Общее: `variants/blocks.tsx` (шапка, тарифы, FAQ, подвал — вид задаёт SCSS варианта), `variants/Smooth.tsx` (Lenis + появление).

## Картинки
`node scripts/prepare-assets.mjs <папка исходников Figma>` — генерации галереи → WebP (720 и 360), иконки/логотип SVG.

## Проверка
- `npm run dev -- -p 3200`
- `PW_CHROME=<chrome.exe> node scripts/shot.mjs http://localhost:3200/ <out> 1440 900 dark` — кадры по скроллу
- `ENGINE=webkit MOBILE=1 node scripts/shot.mjs http://localhost:3200/ <out> 390 844 dark` — МВ в Safari
- `node scripts/check.mjs` — поле запроса, модели, лента сценариев, FAQ, якоря
