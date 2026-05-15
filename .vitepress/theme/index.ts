import DefaultTheme from "vitepress/theme";
import { useRoute } from "vitepress";
import imageViewer from "vitepress-plugin-image-viewer";
import vImageViewer from "vitepress-plugin-image-viewer/lib/vImageViewer.vue";
import "viewerjs/dist/viewer.min.css";
import "./custom.css";
import CopyPath from "./components/CopyPath.vue";
import type { App } from "vue";

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component("CopyPath", CopyPath);
    app.component("vImageViewer", vImageViewer);
  },
  setup() {
    const route = useRoute();
    imageViewer(route);
  },
};
