import { createAuth0 } from "@auth0/auth0-vue"
import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"

import "./assets/main.css"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(
    createAuth0({
        domain: process.env.VITE_AUTH0_DOMAIN,
        clientId: process.env.VITE_AUTH0_CLIENT_ID,
        authorizationParams: {
            redirect_uri: process.env.VITE_AUTH0_CALLBACK_URL,
        },
    })
)
app.mount("#app")
