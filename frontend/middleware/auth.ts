import {useAuth} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { isAuthenticated } = useAuth()
    const status = await isAuthenticated()
    if (!status && to.path !== '/login') {
        return navigateTo(`/login?return_to=${encodeURIComponent(to.fullPath)}`)
    }
})