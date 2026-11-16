import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  ActionLink,
  Button,
  Checkbox,
  ContactForm,
  EquipmentCard,
  Field,
  Footer,
  Header,
  SelectField,
  equipment,
} from "./components";
import { Services, SupportCards, Operators } from "./App";

const meta = {
  title: "ВЕРТЭКС/Дизайн-система",
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
const wrap = {
  display: "flex",
  gap: 24,
  flexWrap: "wrap" as const,
  alignItems: "flex-start",
};
export const Tokens: Story = {
  name: "01 · Цвета и токены",
  render: () => (
    <div>
      <h2>Токены Figma · ВЕРТЭКС</h2>
      <div style={{ ...wrap, marginTop: 32 }}>
        {[
          "green",
          "black",
          "white",
          "primary",
          "primary-70",
          "primary-20",
          "accent-green",
          "surface",
        ].map((token) => (
          <div key={token} style={{ width: 140 }}>
            <div
              style={{
                height: 100,
                border: "1px solid #ddd",
                borderRadius: 8,
                background: `var(--${token})`,
              }}
            />
            <p className="meta" style={{ marginTop: 8 }}>
              --{token}
            </p>
          </div>
        ))}
      </div>
      <h3 style={{ marginTop: 48 }}>Шкала отступов</h3>
      <div style={{ ...wrap, marginTop: 24 }}>
        {[4, 6, 8, 12, 16, 20, 24, 32, 48, 64, 96].map((n) => (
          <div key={n}>
            <div style={{ width: n, height: 24, background: "var(--green)" }} />
            <p className="meta">{n}px</p>
          </div>
        ))}
      </div>
    </div>
  ),
};
export const Typography: Story = {
  name: "02 · Типографика",
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <h1>H1 · Аренда и эксплуатация</h1>
      <h2>H2 · Грузоподъёмная техника в аренду</h2>
      <h3>H3 · Caterpillar CC880-1 2021 г</h3>
      <p>
        Body · Предоставляем технику и крановщиков, готовим документы и
        организуем безопасную эксплуатацию.
      </p>
      <p style={{ fontSize: 14, fontWeight: 600, lineHeight: "20px" }}>
        UI · Основные характеристики
      </p>
      <p className="meta">Meta · 32 единицы техники</p>
    </div>
  ),
};
export const Buttons: Story = {
  name: "03 · Кнопки и ссылки",
  render: () => (
    <div style={wrap}>
      <Button>Обсудить задачу</Button>
      <Button tone="white">Подобрать крановщика</Button>
      <Button tone="green">Откликнуться</Button>
      <Button disabled>Недоступно</Button>
      <ActionLink href="/404/">Ссылка</ActionLink>
    </div>
  ),
};
export const Fields: Story = {
  name: "04 · Поля и состояния",
  render: () => {
    const [v, setV] = useState("Любая");
    return (
      <div style={{ display: "grid", gap: 24, maxWidth: 400 }}>
        <Field label="Ваше имя" />
        <Field label="Электронная почта" defaultValue="info@vertexdv.ru" />
        <Field
          label="Номер телефона"
          error="Укажите корректный номер телефона"
          defaultValue="123"
        />
        <Field label="Недоступное поле" disabled />
        <SelectField
          label="Грузоподъёмность"
          value={v}
          onChange={setV}
          options={["Любая", "До 50 т", "Более 50 т"]}
        />
        <Checkbox>Я согласен на обработку персональных данных</Checkbox>
      </div>
    );
  },
};
export const Equipment: Story = {
  name: "05 · Карточка техники",
  render: () => <EquipmentCard item={equipment[0]} />,
};
export const ServiceCards: Story = {
  name: "06 · Хранение и ремонт · анимация",
  render: () => <Services />,
};
export const CommissionCards: Story = {
  name: "07 · Сопровождение · анимация",
  render: () => <SupportCards />,
};
export const CareerCards: Story = {
  name: "07а · Крановщики и обучение · раскрытие",
  parameters: { layout: "fullscreen" },
  render: () => <Operators />,
};
export const Form: Story = {
  name: "08 · Форма",
  render: () => <ContactForm />,
};
export const FormErrors: Story = {
  name: "09 · Форма с ошибками",
  render: () => <ContactForm initialErrors />,
};
export const Navigation: Story = {
  name: "10 · Навигация",
  parameters: { layout: "fullscreen" },
  render: () => <Header standalone />,
};
export const PageFooter: Story = {
  name: "11 · Подвал",
  render: () => <Footer />,
};
export const Mobile: Story = {
  name: "12 · Компоненты на 375 px",
  globals: { viewport: { value: "mobile", isRotated: false } },
  render: () => (
    <div style={{ display: "grid", gap: 32 }}>
      <Button>Обсудить задачу</Button>
      <EquipmentCard item={equipment[0]} />
      <Services />
      <SupportCards />
      <ContactForm />
    </div>
  ),
};
