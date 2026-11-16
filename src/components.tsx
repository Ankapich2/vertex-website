import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { desktop as d, mobile as m } from "./assets";
import { siteUrl } from "./urls";

export function Button({
  children,
  tone = "black",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "black" | "white" | "green";
}) {
  return (
    <button className={`vx-button ${tone} ${className}`} {...props}>
      <span className="button-dot" aria-hidden="true" />
      <span>{children}</span>
    </button>
  );
}
export function ActionLink({
  children,
  href,
  tone = "black",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  tone?: "black" | "white" | "green";
}) {
  return (
    <a
      className={`vx-button ${tone} ${className}`}
      {...props}
      href={href ? siteUrl(href) : undefined}
    >
      <span className="button-dot" aria-hidden="true" />
      <span>{children}</span>
    </a>
  );
}
export function Arrow({
  white = false,
  size = 23,
}: {
  white?: boolean;
  size?: number;
}) {
  return (
    <span
      className="arrow"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src={white ? d.imgLucideChevronDown3 : d.imgLucideChevronDown2}
        alt=""
        width={size}
        height={size}
      />
    </span>
  );
}
export function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <a
      href={siteUrl("/")}
      aria-label="ВЕРТЭКС — на главную"
      className={footer ? "logo footer-logo" : "logo"}
    >
      <img
        src={footer ? d.imgLogo : d.imgMonochromeFalseWhiteFalse}
        alt="ВЕРТЭКС"
      />
    </a>
  );
}
const navigation = [
  ["О компании", "/about/"],
  ["Услуги", "/services/"],
  ["Объекты", "/projects/"],
  ["Контакты", "/contacts/"],
];
const serviceLinks = [
  ["Все услуги", "/services/"],
  ["Аренда техники", "/equipment/"],
  ["Эксплуатация подъёмных сооружений", "/services/operation/"],
  ["Вывоз и хранение техники", "/services/storage/"],
  ["Ремонт подъёмных сооружений", "/services/repair/"],
  ["Крановщики и обучение", "/career/"],
];
function NavigationItems({ onNavigate }: { onNavigate?: () => void }) {
  const dropdown = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (dropdown.current && !dropdown.current.contains(event.target as Node))
        dropdown.current.open = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dropdown.current?.open) {
        event.stopPropagation();
        dropdown.current.open = false;
        dropdown.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  return navigation.map(([label, url]) =>
    label === "Услуги" ? (
      <details
        key={label}
        ref={dropdown}
        className="nav-dropdown"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node))
            event.currentTarget.open = false;
        }}
      >
        <summary>
          Услуги
          <img src={d.imgLucideChevronDown1} width="12" height="12" alt="" />
        </summary>
        <div className="nav-dropdown-panel" data-lenis-prevent>
          {serviceLinks.map(([name, href]) => (
            <a
              key={href}
              href={siteUrl(href)}
              onClick={() => {
                if (dropdown.current) dropdown.current.open = false;
                onNavigate?.();
              }}
            >
              {name}
            </a>
          ))}
        </div>
      </details>
    ) : (
      <a key={label} href={siteUrl(url)} onClick={onNavigate}>
        {label}
      </a>
    ),
  );
}
export function Header({ standalone = false }: { standalone?: boolean }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const finishClose = () => {
    setOpen(false);
    setClosing(false);
    opener.current?.focus();
  };
  const dismiss = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      finishClose();
    else setClosing(true);
  };
  useEffect(() => {
    if (standalone) return;
    let anchor = window.scrollY;
    let previous = anchor;
    let direction = 0;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const nextDirection = Math.sign(y - previous);
      if (nextDirection && nextDirection !== direction) {
        anchor = previous;
        direction = nextDirection;
      }
      if (open || y < 80) setHidden(false);
      else if (Math.abs(y - anchor) > 12) setHidden(direction > 0);
      previous = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [open, standalone]);
  useEffect(() => {
    if (standalone) return;
    document.documentElement.dataset.headerHidden = String(hidden && !open);
    return () => {
      delete document.documentElement.dataset.headerHidden;
    };
  }, [hidden, open, standalone]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
      }
      if (e.key === "Tab") {
        const els = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".mobile-menu a,.mobile-menu button,.mobile-menu summary",
          ),
        );
        const first = els[0],
          last = els.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <>
      <header
        className={`header ${standalone ? "header--standalone" : ""} ${hidden && !open ? "header--hidden" : ""}`}
        inert={hidden && !open}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="header-left">
          <Logo />
          <nav aria-label="Главная навигация">
            <NavigationItems />
          </nav>
        </div>
        <div className="header-right">
          <a href="tel:+74212666677">+7 4212 66 66 77</a>
          <a className="header-cta" href={siteUrl("/contact/")}>
            Обсудить задачу
          </a>
        </div>
        <button
          ref={opener}
          className="menu-toggle"
          aria-label="Открыть меню"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <img src={m.imgFrame} width="24" height="24" alt="" />
        </button>
      </header>
      {open && (
        <div
          id="mobile-menu"
          className={`mobile-menu ${closing ? "mobile-menu--closing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Навигация"
          data-lenis-prevent
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && closing) finishClose();
          }}
        >
          <div className="menu-top">
            <Logo />
            <button
              ref={closeRef}
              className="menu-toggle close-menu"
              aria-label="Закрыть меню"
              onClick={dismiss}
            >
              <span />
              <span />
            </button>
          </div>
          <nav>
            <NavigationItems onNavigate={dismiss} />
          </nav>
          <div className="menu-contact">
            <a href={siteUrl("/contact/")} onClick={dismiss}>
              Задать вопрос
            </a>
            <a href="tel:+74212666677">+7 4212 66 66 77</a>
          </div>
        </div>
      )}
    </>
  );
}
export function Field({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = useId();
  return (
    <div className="field">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        placeholder={label}
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? id + "-error" : undefined}
      />
      {error && (
        <span className="field-error" id={id + "-error"}>
          {error}
        </span>
      )}
    </div>
  );
}
export function Checkbox({
  children,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  children: ReactNode;
  error?: string;
}) {
  const id = useId();
  return (
    <div>
      <label className="checkbox">
        <input
          type="checkbox"
          {...props}
          aria-invalid={!!error}
          aria-describedby={error ? id : undefined}
        />
        <span>{children}</span>
      </label>
      {error && (
        <span className="field-error" id={id}>
          {error}
        </span>
      )}
    </div>
  );
}
export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  options: string[];
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(Math.max(0, options.indexOf(value)));
  const [placement, setPlacement] = useState({ up: false, height: 240 });
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef({ text: "", time: 0 });
  const close = () => setOpen(false);
  const choose = (index: number) => {
    onChange(options[index]);
    close();
    trigger.current?.focus({ preventScroll: true });
  };
  useLayoutEffect(() => {
    if (!open) return;
    const position = () => {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      if (rect.bottom < 0 || rect.top > innerHeight) {
        close();
        return;
      }
      const below = innerHeight - rect.bottom - 12;
      const above = rect.top - 12;
      const up =
        below < Math.min(options.length * 48 + 16, 240) && above > below;
      setPlacement({
        up,
        height: Math.max(48, Math.min(240, up ? above : below)),
      });
    };
    const outside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) close();
    };
    position();
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [open, options.length]);
  useEffect(() => {
    if (open)
      document
        .getElementById(`${id}-option-${active}`)
        ?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [active, open, id]);
  return (
    <div
      ref={container}
      className={`select-field ${open ? "select-field--open" : ""}`}
    >
      <label id={id + "-label"} htmlFor={id}>
        {label}
      </label>
      <div className="select-wrap">
        <button
          ref={trigger}
          id={id}
          className="select-trigger"
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={id + "-list"}
          aria-labelledby={id + "-label"}
          aria-activedescendant={open ? `${id}-option-${active}` : undefined}
          onClick={() => {
            setActive(Math.max(0, options.indexOf(value)));
            setOpen(!open);
          }}
          onBlur={(event) => {
            if (!container.current?.contains(event.relatedTarget as Node))
              close();
          }}
          onKeyDown={(event) => {
            const { key } = event;
            if (key === "Tab") {
              close();
              return;
            }
            if (key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              close();
              return;
            }
            if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
              event.preventDefault();
              if (!open) {
                setOpen(true);
                setActive(
                  key === "Home"
                    ? 0
                    : key === "End"
                      ? options.length - 1
                      : Math.max(0, options.indexOf(value)),
                );
              } else
                setActive(
                  key === "Home"
                    ? 0
                    : key === "End"
                      ? options.length - 1
                      : (active +
                          (key === "ArrowDown" ? 1 : -1) +
                          options.length) %
                        options.length,
                );
            } else if (key === "Enter" || key === " ") {
              event.preventDefault();
              if (open) choose(active);
              else {
                setActive(Math.max(0, options.indexOf(value)));
                setOpen(true);
              }
            } else if (
              key.length === 1 &&
              !event.ctrlKey &&
              !event.metaKey &&
              !event.altKey
            ) {
              event.preventDefault();
              const now = performance.now();
              search.current = {
                text:
                  now - search.current.time > 600
                    ? key
                    : search.current.text + key,
                time: now,
              };
              const match = options.findIndex((option) =>
                option
                  .toLocaleLowerCase()
                  .startsWith(search.current.text.toLocaleLowerCase()),
              );
              if (match >= 0) {
                setActive(match);
                setOpen(true);
              }
            }
          }}
        >
          <span>{value}</span>
          <img src={d.imgLucideChevronDown4} width="12" height="12" alt="" />
        </button>
        {open && (
          <div
            id={id + "-list"}
            role="listbox"
            aria-labelledby={id + "-label"}
            className={`select-options ${placement.up ? "select-options--up" : ""}`}
            style={{ maxHeight: placement.height }}
            data-lenis-prevent
          >
            {options.map((option, index) => (
              <div
                id={`${id}-option-${index}`}
                key={option}
                role="option"
                aria-selected={value === option}
                className={`select-option ${active === index ? "select-option--active" : ""}`}
                onPointerMove={() => setActive(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
              >
                <span>{option}</span>
                {value === option && (
                  <span className="select-option-dot" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export type Equipment = {
  id: number;
  name: string;
  type: string;
  capacity: number;
  boom: number;
  height: number;
  image: string;
};
export const equipment: Equipment[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: "Caterpillar CC880-1 2021 г",
  type: "Гусеничный кран",
  capacity: 80,
  boom: 40,
  height: 60,
  image: d.imgFrame115,
}));
export function EquipmentCard({ item }: { item: Equipment }) {
  return (
    <article className="equipment-card">
      <div className="equipment-photo">
        <img src={item.image} alt={item.name} loading="lazy" />
      </div>
      <div className="equipment-info">
        <div>
          <p className="equipment-type">{item.type}</p>
          <h3>{item.name}</h3>
        </div>
        <div className="equipment-specs">
          <h4>Основные характеристики</h4>
          <p>Грузоподъёмность {item.capacity} т</p>
          <p>
            Стрела {item.boom} м · высота {item.height} м
          </p>
          <p>Ходовая часть: гусеничная</p>
        </div>
      </div>
      <a className="text-link" href={siteUrl(`/equipment/${item.id}/`)}>
        О технике <Arrow size={12} />
      </a>
    </article>
  );
}
export function RevealCard({
  children,
  image,
  icon,
  kind = "service",
  className = "",
  iconWidth = 78,
  iconHeight = 78,
  boxWidth = 78,
  revealedIcon,
  flipped = false,
  href = "/services/",
}: {
  children: ReactNode;
  image: string;
  icon: string;
  kind?: "service" | "support" | "career";
  className?: string;
  iconWidth?: number;
  iconHeight?: number;
  boxWidth?: number;
  revealedIcon?: string;
  flipped?: boolean;
  href?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)");
    const touch = window.matchMedia("(hover: none)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const configure = () => {
      observer?.disconnect();
      if (mobile.matches || !touch.matches || reduced.matches) {
        setSeen(false);
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setSeen(true);
            observer?.disconnect();
          }
        },
        { threshold: 0.65 },
      );
      if (ref.current) observer.observe(ref.current);
    };
    [mobile, touch, reduced].forEach((query) =>
      query.addEventListener("change", configure),
    );
    configure();
    return () => {
      observer?.disconnect();
      [mobile, touch, reduced].forEach((query) =>
        query.removeEventListener("change", configure),
      );
    };
  }, [kind]);
  const Tag = kind === "service" ? "a" : "article";
  return (
    <Tag
      ref={(element) => {
        ref.current = element;
      }}
      href={kind === "service" ? siteUrl(href) : undefined}
      tabIndex={kind === "career" ? 0 : undefined}
      className={`reveal-card ${kind} ${seen ? "touch-revealed" : ""} ${className}`}
    >
      <div
        className="reveal-photo"
        style={{
          backgroundImage: `${kind === "service" ? "linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))" : "linear-gradient(0deg,rgba(0,0,0,.60),rgba(0,0,0,.12))"},url("${image}")`,
        }}
      />
      {kind === "career" ? (
        <div
          className="career-thumbnail"
          style={{
            backgroundImage: `url("${image}")`,
            maskImage: `url("${icon}")`,
            WebkitMaskImage: `url("${icon}")`,
          }}
        />
      ) : (
        <div
          className="reveal-icon"
          style={{
            width: kind === "service" ? 195 : boxWidth,
            height: kind === "service" ? 98 : 78,
          }}
        >
          <img
            src={icon}
            alt=""
            width={iconWidth}
            height={iconHeight}
            className={flipped ? "flipped" : ""}
          />
          {(kind === "service" || kind === "support") && (
            <span
              className={`reveal-icon-solid${flipped ? " flipped" : ""}`}
              aria-hidden="true"
              style={{
                width: iconWidth,
                height: iconHeight,
                maskImage: `url("${icon}")`,
                WebkitMaskImage: `url("${icon}")`,
              }}
            />
          )}
        </div>
      )}
      {revealedIcon && (
        <img className="revealed-icon" src={revealedIcon} alt="" />
      )}
      {(kind === "service" || kind === "career") && <Arrow />}
      <div className="reveal-copy">{children}</div>
    </Tag>
  );
}
export function ContactForm({
  initialErrors = false,
}: {
  initialErrors?: boolean;
}) {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>(
    initialErrors
      ? {
          name: "Укажите имя",
          phone: "Укажите номер телефона",
          consent: "Необходимо согласие",
        }
      : {},
  );
  const [sent, setSent] = useState(false);
  const validate = () => {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = "Укажите имя";
    if (values.phone.replace(/\D/g, "").length < 10)
      e.phone = "Укажите корректный номер телефона";
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      e.email = "Проверьте электронную почту";
    if (!consent) e.consent = "Необходимо согласие";
    return e;
  };
  return (
    <form
      className="contact-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const next = validate();
        setErrors(next);
        if (!Object.keys(next).length) setSent(true);
      }}
    >
      <h2>Обсудим вашу задачу. Оставьте контакты — мы свяжемся с вами</h2>
      <div className="form-fields">
        {(
          [
            ["name", "Ваше имя", "text", "name"],
            ["phone", "Номер телефона", "tel", "tel"],
            ["email", "Электронная почта", "email", "email"],
            ["message", "Сообщение", "text", "off"],
          ] as const
        ).map(([key, label, type, autoComplete]) => (
          <Field
            key={key}
            label={label}
            type={type}
            autoComplete={autoComplete}
            value={values[key]}
            required={key === "name" || key === "phone"}
            error={errors[key]}
            onChange={(e) => {
              setValues({ ...values, [key]: e.target.value });
              setSent(false);
            }}
          />
        ))}
        <Checkbox
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setSent(false);
          }}
          error={errors.consent}
        >
          Я согласен на обработку персональных данных
        </Checkbox>
      </div>
      <Button type="submit">Отправить</Button>
      {sent && (
        <p className="form-result" role="status">
          Демонстрационная форма: данные проверены, отправка не выполнялась.
        </p>
      )}
    </form>
  );
}
export function Footer() {
  return (
    <footer className="footer" id="contacts">
      <div className="footer-top">
        <div className="footer-links">
          <p className="meta">Навигация</p>
          <nav aria-label="Навигация в подвале">
            <NavigationItems />
          </nav>
        </div>
        <address>
          <div>
            <p className="meta">Телефон:</p>
            <a href="tel:+74212666677">+7 (4212) 66-66-77</a>
          </div>
          <div>
            <p className="meta">Почта:</p>
            <a href="mailto:info@vertexdv.ru">info@vertexdv.ru</a>
          </div>
          <div>
            <p className="meta">Адрес:</p>
            <p>г. Хабаровск, ул. Дикопольцева, д. 26, пом. 1</p>
          </div>
        </address>
        <Logo footer />
      </div>
      <div className="footer-bottom">
        <span>ООО «Вертэкс», 2026</span>
        <a href={siteUrl("/privacy/")}>Политика конфиденциальности</a>
        <a href={siteUrl("/terms/")}>Пользовательское соглашение</a>
        <span>Разработка — RASA</span>
      </div>
    </footer>
  );
}
