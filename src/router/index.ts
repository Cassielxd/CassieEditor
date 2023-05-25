import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import BaseEditor from "../views/BaseEditor.vue";
import PageEditor from "../views/PageEditor.vue";
import PageEditorDeflate from "../views/PageEditorDeflate.vue";
import SignEditor from "../views/SignEditor.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "base",
    component: BaseEditor
  },
  {
    path: "/page",
    name: "page",
    component: PageEditor
  },
  {
    path: "/page1",
    name: "page1",
    component: PageEditorDeflate
  },
  {
    path: "/sign",
    name: "sign",
    component: SignEditor
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/AboutView.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
