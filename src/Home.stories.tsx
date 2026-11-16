import type { Meta, StoryObj } from "@storybook/react-vite";
import App from "./App";
const meta = {
  title: "ВЕРТЭКС/Главная",
  component: App,
  args: { page: "home" },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof App>;
export default meta;
export const Desktop: StoryObj<typeof meta> = {
  name: "Desktop · 1440",
  globals: { viewport: { value: "desktop", isRotated: false } },
};
export const Mobile: StoryObj<typeof meta> = {
  name: "Mobile · 375",
  globals: { viewport: { value: "mobile", isRotated: false } },
};
export const Page404: StoryObj<typeof meta> = {
  name: "Страница 404",
  args: { page: "not-found" },
};
