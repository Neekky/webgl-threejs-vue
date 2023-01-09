import { createRouter, createWebHashHistory } from "vue-router";
import VRViewHome from "../views/VRViewHome.vue";
import BeautyIsland from "../views/BeautyIsland.vue";
import CarModelDisplay from "../views/CarModelDisplay.vue";
import GreetingCard from "../views/GreetingCard.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "VRViewHome",
      component: VRViewHome,
    },
    {
      path: "/GreetingCard",
      name: "GreetingCard",
      component: GreetingCard,
    },
    {
      path: "/BeautyIsland",
      name: "BeautyIsland",
      component: BeautyIsland,
    },
    {
      path: "/CarModelDisplay",
      name: "CarModelDisplay",
      component: CarModelDisplay,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
