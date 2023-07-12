import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./index.css";

import CustomHline from "./design/components/custom-hline/index.vue";
import CustomVline from "./design/components/custom-vline/index.vue";
import CustomText from "./design/components/custom-text/index.vue";
import Customimage from "./design/components/custom-image/index.vue";
import Customlogo from "./design/components/custom-logo/index.vue";
import CustomSelect from "./design/components/custom-select/index.vue";
import PageCount from "./design/components/page-count/index.vue";
import "v-calendar/dist/style.css";
import VCalendar from "v-calendar";

const app = createApp(App);
app.config.unwrapInjectedRef = true;
app.use(VCalendar, {});
app.component(CustomHline.name, CustomHline);
app.component(CustomVline.name, CustomVline);

app.component(CustomText.name, CustomText);
app.component(Customimage.name, Customimage);
app.component(Customlogo.name, Customlogo);
app.component(CustomSelect.name, CustomSelect);
app.component(PageCount.name, PageCount);
app.use(store).use(router).mount("#app");


