import { createRouter, createWebHistory } from "vue-router"
import { authGuard } from "@auth0/auth0-vue"
const HomeView = () => import("../views/HomeView.vue")
const CallbackView = () => import("@/views/CallbackView.vue")
const DiscoveryView = () => import("@/views/DiscoveryView.vue")
const UserView = () => import("@/views/UserView.vue")

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/callback",
            name: "callback",
            component: CallbackView,
        },
        {
            path: "/discovery",
            name: "discovery",
            component: DiscoveryView,
            beforeEnter: authGuard,
        },
        {
            path: "/user",
            name: "user",
            component: UserView,
            beforeEnter: authGuard,
        },
        {
            path: "/:catchAll(.*)",
            name: "Not Found",
            component: HomeView,
        },
    ],
})

export default router
