import type { Preview } from "@storybook/react-vite";
import "../src/tokens.css";
import "../src/styles.css";
import "../src/layout.css";
import "../src/navigation.css";
const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    viewport: {
      options: {
        desktop: {
          name: "Desktop 1440",
          styles: { width: "1440px", height: "900px" },
        },
        mobile: {
          name: "Mobile 375",
          styles: { width: "375px", height: "815px" },
        },
      },
    },
  },
};
export default preview;
