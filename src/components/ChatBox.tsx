"use client";

import { useEffect, useRef, useState } from "react";
import { chatWithPrompt, hero, models, scenarios } from "@/content";
import { Icon } from "./Icons";
import s from "./ChatBox.module.scss";

// Примеры для «печатающейся» подсказки — из сценариев драфта
const EXAMPLES = scenarios.items.map((i) => i.example).filter(Boolean);
const MODEL_LIST = [hero.model, ...models.items.map((m) => m.name)];

// Поле запроса первого экрана. Работает по-настоящему: запрос уходит
// в чат Пикабу Нейро, выбранная модель подставляется в интерфейс.
export default function ChatBox() {
  const [value, setValue] = useState("");
  const [model, setModel] = useState(hero.model);
  const [menu, setMenu] = useState(false);
  const [ghost, setGhost] = useState("");
  const [focused, setFocused] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Печатающаяся подсказка: показываем, пока поле пустое и не в фокусе
  useEffect(() => {
    if (value || focused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t0 = window.setTimeout(() => setGhost(EXAMPLES[0]), 0);
      return () => clearTimeout(t0);
    }
    let ex = 0;
    let i = 0;
    let dir = 1;
    let t = 0;
    const tick = () => {
      const text = EXAMPLES[ex];
      i += dir;
      setGhost(text.slice(0, i));
      let delay = dir > 0 ? 38 + Math.random() * 40 : 14;
      if (dir > 0 && i >= text.length) {
        dir = -1;
        delay = 2200;
      } else if (dir < 0 && i <= 0) {
        dir = 1;
        ex = (ex + 1) % EXAMPLES.length;
        delay = 450;
      }
      t = window.setTimeout(tick, delay);
    };
    t = window.setTimeout(tick, 900);
    return () => clearTimeout(t);
  }, [value, focused]);

  // Закрытие списка моделей по клику мимо и Esc
  useEffect(() => {
    if (!menu) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menu]);

  // Подгоняем высоту поля под текст
  useEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const send = () => {
    const q = value.trim() || ghost.trim() || EXAMPLES[0];
    window.open(chatWithPrompt(q), "_blank", "noopener");
  };

  const fill = (prompt: string) => {
    setValue(prompt);
    requestAnimationFrame(() => {
      ta.current?.focus();
      ta.current?.setSelectionRange(prompt.length, prompt.length);
    });
  };

  return (
    <div className={s.wrap}>
      <form
        className={s.box}
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <span className={s.border} aria-hidden="true" />
        <label className="visually-hidden" htmlFor="hero-prompt">
          {hero.placeholder}
        </label>
        <div className={s.field}>
          <textarea
            id="hero-prompt"
            ref={ta}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={focused ? hero.placeholder : ""}
          />
          {!value && !focused && (
            <span className={s.ghost} aria-hidden="true">
              {ghost || hero.placeholder}
              <i className={s.caret} />
            </span>
          )}
        </div>
        <div className={s.bar}>
          <div className={s.model} ref={menuRef}>
            <button type="button" className={s.modelBtn} aria-haspopup="listbox" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
              <Icon name="spark" className={s.modelIcon} />
              {model}
              <Icon name="down" className={s.chev} />
            </button>
            <ul className={s.menu} role="listbox" data-open={menu || undefined} aria-label="Модель">
              {MODEL_LIST.map((m) => (
                <li key={m}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={m === model}
                    onClick={() => {
                      setModel(m);
                      setMenu(false);
                    }}
                  >
                    {m}
                    {m === model && <Icon name="check" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button type="button" className={s.attach} aria-label="Прикрепить файл" onClick={send}>
            <Icon name="plus" />
          </button>
          <button type="submit" className={s.send} aria-label="Отправить запрос">
            <Icon name="up" />
          </button>
        </div>
      </form>

      <div className={s.quick}>
        {hero.quick.map((q) => (
          <button key={q.label} type="button" className={s.chip} onClick={() => fill(q.prompt)}>
            <Icon name={q.icon as "pen"} />
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
