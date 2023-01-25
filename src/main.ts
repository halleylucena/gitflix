import { createAuth0 } from "@auth0/auth0-vue"
import { createApp } from "vue"
import { createPinia } from "pinia"
import authConfig from "../auth_config.json"

import App from "./App.vue"
import router from "./router"

import "./assets/main.css"

const app = createApp(App)

console.log(import.meta.env)

app.use(createPinia())
app.use(router)
app.use(
    createAuth0({
        domain: authConfig.domain,
        clientId: authConfig.clientId,
        authorizationParams: {
            redirect_uri: window.location.origin,
        },
    })
)
app.mount("#app")
