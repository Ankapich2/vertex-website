import { useEffect, useRef, useState } from "react";
import { desktop as d, service, support } from "./assets";
import {
  ActionLink,
  Button,
  ContactForm,
  EquipmentCard,
  Footer,
  Header,
  RevealCard,
  SelectField,
  equipment,
} from "./components";
import { useSmoothScroll } from "./useSmoothScroll";
import { useHeadingReveal } from "./useHeadingReveal";
import { siteUrl } from "./urls";

const supportText = [
  "Организуем работу комиссии, которая проверит готовность подъёмного сооружения к запуску после монтажа на новом месте",
  "Организуем безопасную эксплуатацию подъёмных сооружений и надзор за их работой",
  "Готовим документы и сопровождаем работу арендованной техники — от ввода в эксплуатацию до дальнейшего надзора",
];
const visualCheck =
  import.meta.env.DEV &&
  new URLSearchParams(location.search).get("visual") === "figma";
export function SupportCards() {
  return (
    <div className="support-grid">
      {supportText.map((text, i) => (
        <RevealCard
          key={text}
          kind="support"
          image={
            [support.imgFrame108, support.imgFrame109, support.imgFrame110][i]
          }
          icon={[d.imgVector1, d.imgVector2, d.imgVector3][i]}
          iconWidth={[67.093, 64.418, 56.547][i]}
          iconHeight={[69.353, 74.55, 68.177][i]}
          boxWidth={[78, 86, 79][i]}
          revealedIcon={
            [
              support.imgImage14Vectorized,
              support.imgImage15Vectorized,
              support.imgImage16Vectorized,
            ][i]
          }
        >
          <p>{text}</p>
        </RevealCard>
      ))}
    </div>
  );
}
export function Services() {
  return (
    <div className="services-grid" id="services">
      <RevealCard
        image={d.imgFrame115}
        icon={service.imgVector}
        iconWidth={183.894}
        iconHeight={84.968}
        flipped
      >
        <h3>
          Вывоз и хранение техники
          <br />
          на время простоя
        </h3>
      </RevealCard>
      <RevealCard
        image={d.imgFrame76}
        icon={service.imgVector1}
        iconWidth={92.59}
        iconHeight={93.184}
        className="repair"
      >
        <h3>
          Ремонт
          <br />
          подъёмных сооружений
        </h3>
      </RevealCard>
    </div>
  );
}
export function Hero() {
  const video = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(
    () =>
      visualCheck ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(visualCheck || mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (reduced) {
      video.current?.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.current?.play().catch(() => {});
        else video.current?.pause();
      },
      { threshold: 0.05 },
    );
    if (video.current) io.observe(video.current);
    return () => io.disconnect();
  }, [reduced]);
  return (
    <section className="hero" id="top">
      <picture className="hero-poster">
        <source media="(max-width:767px)" srcSet={d.imgFrame45} />
        <img src={d.imgFrame45} alt="" fetchPriority="high" />
      </picture>
      {!reduced && (
        <video
          ref={video}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={siteUrl("/assets/hero-poster.jpg")}
        >
          <source src={siteUrl("/assets/hero.mp4")} type="video/mp4" />
        </video>
      )}
      <div className="hero-shade" />
      <div className="hero-content">
        <div className="hero-copy">
          <h1>
            ВЕРТЭКС — аренда и эксплуатация
            <br className="desktop-break" /> грузоподъёмной техники
          </h1>
          <p>
            Предоставляем технику и крановщиков, готовим документы и организуем
            безопасную эксплуатацию — от ввода в работу до обслуживания.
          </p>
        </div>
        <div className="hero-stats">
          {[0, 1].map((group) => (
            <div key={group}>
              <div className="avatars">
                {[0, 1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={
                      [
                        d.imgEllipse1,
                        d.imgEllipse2,
                        d.imgEllipse3,
                        d.imgEllipse4,
                        d.imgEllipse5,
                        d.imgEllipse6,
                        d.imgEllipse7,
                        d.imgEllipse8,
                      ][group * 4 + i]
                    }
                    width="30"
                    height="30"
                    alt=""
                  />
                ))}
              </div>
              <p>{group === 0 ? "32 единицы техники" : "70+ специалистов"}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Rental() {
  const [type, setType] = useState("Гусеничный кран");
  const [capacity, setCapacity] = useState("Любая");
  const [boom, setBoom] = useState("20–40 м");
  const [height, setHeight] = useState("Любая");
  const reset = () => {
    setType("Гусеничный кран");
    setCapacity("Любая");
    setBoom("20–40 м");
    setHeight("Любая");
  };
  const filtered = equipment.filter(
    (item) =>
      (type === "Любой" || item.type === type) &&
      (capacity === "Любая" ||
        (capacity === "До 50 т" ? item.capacity <= 50 : item.capacity > 50)) &&
      (boom === "Любая" ||
        (boom === "20–40 м"
          ? item.boom >= 20 && item.boom <= 40
          : item.boom > 40)) &&
      (height === "Любая" ||
        (height === "До 40 м" ? item.height <= 40 : item.height > 40)),
  );
  return (
    <section className="rental page-inset" id="rental">
      <h2>Грузоподъёмная техника в аренду</h2>
      <div className="filters">
        <SelectField
          label="Тип крана"
          value={type}
          onChange={setType}
          options={["Гусеничный кран", "Башенный кран", "Автокран", "Любой"]}
        />
        <SelectField
          label="Грузоподъёмность"
          value={capacity}
          onChange={setCapacity}
          options={["Любая", "До 50 т", "Более 50 т"]}
        />
        <SelectField
          label="Длина стрелы"
          value={boom}
          onChange={setBoom}
          options={["20–40 м", "Более 40 м", "Любая"]}
        />
        <SelectField
          label="Высота"
          value={height}
          onChange={setHeight}
          options={["Любая", "До 40 м", "Более 40 м"]}
        />
      </div>
      <div className="equipment-layout">
        <div className="equipment-list">
          {filtered.map((item) => (
            <EquipmentCard key={item.id} item={item} />
          ))}
          {!filtered.length && (
            <div className="empty-results" role="status">
              <h3>Техника не найдена</h3>
              <p>Попробуйте изменить параметры подбора.</p>
              <Button onClick={reset}>Сбросить фильтры</Button>
            </div>
          )}
        </div>
        <ActionLink className="all-equipment" href="/equipment/">
          Вся техника
        </ActionLink>
      </div>
    </section>
  );
}
export function Operators() {
  return (
    <section className="operators" id="operators">
      <RevealCard
        kind="career"
        image={d.imgFrame82}
        icon={support.imgImage15Vectorized}
        className="operator-panel"
      >
        <div className="panel-copy">
          <h2>
            Крановщики
            <br />
            для вашего объекта
          </h2>
          <p>
            Предоставляем аттестованных крановщиков без аренды техники.
            Подбираем персонал под тип подъёмного сооружения и задачи объекта.
          </p>
          <ActionLink href="/contact/" tone="white">
            Подобрать крановщика
          </ActionLink>
        </div>
      </RevealCard>
      <RevealCard
        kind="career"
        image={support.imgFrame108}
        icon={support.imgImage14Vectorized}
        className="training-panel"
      >
        <div className="panel-copy">
          <h2>
            Работа крановщиком
            <br />и обучение
          </h2>
          <p>
            Оставьте отклик, если ищете работу на объектах, хотите пройти
            обучение или повысить квалификацию.
          </p>
          <ActionLink href="/contact/" tone="white">
            Откликнуться
          </ActionLink>
        </div>
      </RevealCard>
    </section>
  );
}
function Homepage() {
  const contactRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = contactRef.current;
    if (!section) return;
    const footer = section.querySelector<HTMLElement>(".footer");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const update = () => {
      frame = 0;
      const top = section.getBoundingClientRect().top;
      const viewport = window.innerHeight;
      const reveal =
        visualCheck || mq.matches ? 1 : clamp((viewport - top) / viewport);
      const footerTop = top + (footer?.offsetTop ?? 0);
      const cardReveal =
        visualCheck || mq.matches
          ? 1
          : clamp(
              (viewport - footerTop) /
                Math.min(viewport * 0.65, footer?.offsetHeight ?? viewport),
            );
      section.style.setProperty("--footer-reveal", String(reveal));
      section.style.setProperty("--footer-card-reveal", String(cardReveal));
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(requestUpdate);
    observer.observe(section);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    mq.addEventListener("change", requestUpdate);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      mq.removeEventListener("change", requestUpdate);
      cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.visual = visualCheck ? "figma" : "";
  }, []);

  return (
    <>
      <button
        className="skip-link"
        onClick={() => document.getElementById("main-content")?.focus()}
      >
        Перейти к содержимому
      </button>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Rental />
        <section className="safety page-inset" id="about">
          <img src={d.imgFrame115} alt="Парк башенных кранов ВЕРТЭКС" />
          <div>
            <div>
              <h2>
                Безопасная эксплуатация
                <br className="desktop-break" /> подъёмных сооружений
              </h2>
              <p>
                Предоставляем персонал, готовим документы и контролируем
                соблюдение требований промышленной безопасности на опасных
                производственных объектах. Состав работ и зону ответственности
                согласуем для каждого объекта.
              </p>
            </div>
            <ActionLink href="/contact/">Узнать об эксплуатации</ActionLink>
          </div>
        </section>
        <div className="page-inset services-section">
          <Services />
        </div>
        <Operators />
        <section className="support-section page-inset">
          <h2>
            Ввод в работу
            <br />и сопровождение эксплуатации
          </h2>
          <SupportCards />
        </section>
        <section
          ref={contactRef}
          className="contact-section page-inset"
          id="contact"
        >
          <picture className="contact-background">
            <source media="(max-width:767px)" srcSet={d.imgFrame125} />
            <img src={d.imgFrame125} alt="" />
          </picture>
          <ContactForm />
          <Footer />
        </section>
      </main>
    </>
  );
}

export function NotFound() {
  return (
    <>
      <Header />
      <main className="not-found page-inset" id="main-content" tabIndex={-1}>
        <div className="not-found-code" aria-hidden="true">
          404
        </div>
        <div className="not-found-copy">
          <h1>Страница не найдена</h1>
          <p>Проверьте адрес или вернитесь на главную страницу.</p>
          <ActionLink href="/">На главную</ActionLink>
        </div>
      </main>
    </>
  );
}

export default function App({ page }: { page?: "home" | "not-found" } = {}) {
  useSmoothScroll();
  const home = page
    ? page === "home"
    : location.pathname === siteUrl("/") ||
      location.pathname === siteUrl("/index.html");
  useHeadingReveal(home);
  useEffect(() => {
    document.title = home
      ? "ВЕРТЭКС — аренда и эксплуатация техники"
      : "404 — Страница не найдена · ВЕРТЭКС";
  }, [home]);
  return home ? <Homepage /> : <NotFound />;
}
