import { createApp } from "vue"
import { setupLocalPersistence } from "./newstore/localpersistence"
import { performMigrations } from "./helpers/migrations"
import { initializeFirebase } from "./helpers/fb"
import { initUserInfo } from "./helpers/teams/BackendUserInfo"
import { HOPP_MODULES } from "@modules/."

import "virtual:windi.css"
import "../assets/scss/themes.scss"
import "../assets/scss/styles.scss"
import "nprogress/nprogress.css"

import App from "./App.vue"

const app = createApp(App)

// Some basic work that needs to be done before module inits even
initializeFirebase()
setupLocalPersistence()
performMigrations()
initUserInfo()

HOPP_MODULES.forEach((mod) => mod.onVueAppInit?.(app))

app.mount("#app")
