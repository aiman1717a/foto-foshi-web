
import {useAuth} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return

    const { isAuthenticated } = useAuth()

    if (await isAuthenticated()) {
        return navigateTo('/')
    }
})