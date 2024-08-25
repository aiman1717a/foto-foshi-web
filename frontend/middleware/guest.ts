import {useAuth} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { isAuthenticated } = useAuth()
    await isAuthenticated()
})