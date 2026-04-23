import DefaultTheme from "vitepress/theme";
import "./custom.css";
import CopyPath from "./components/CopyPath.vue";
import type { App } from 'vue';

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component('CopyPath', CopyPath)
  }
};
