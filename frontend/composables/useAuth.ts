const loggedInUser = ref<any>(null)
import type {Ability, User} from "@/types";
import _ from "lodash-es"

export function useAuth() {

    const {$api} = useNuxtApp()
    const {  domain } = useRuntimeConfig().public;

    async function isAuthenticated() {
        try {
            if (!process.server) {
                const xsrfToken = useCookie('XSRF-TOKEN', {
                    domain: domain as string,
                    watch: false
                })
                if (!xsrfToken || xsrfToken.value == null) {
                    loggedInUser.value = null
                    return false
                }
            }
            const { data, status } = await useMyFetch('/auth/me')
            if (status.value == 'success') {
                loggedInUser.value = data.value
                return true
            }
            loggedInUser.value = null
            return false
        } catch (e) {
            loggedInUser.value = null
            return false
        }
    }
    async function login(payload: { email: string, password: string }) {
        await $api('/sanctum/csrf-cookie')
        return await $api('/auth/login', {
            method: 'POST',
            body: payload
        })
    }

    async function register(payload: { email: string, password: string }) {
        return await $api('/auth/register', {
            method: 'POST',
            body: payload
        })
    }

    async function forgotPassword(payload: { email: string}) {
        return await $api('/auth/forgot-password', {
            method: 'POST',
            body: payload
        })
    }

    async function resetPassword(token: string, email: string, payload: { password: string, password_confirmation: string}) {
        return await $api('/auth/reset-password', {
            method: 'POST',
            body: {
                token,
                email,
                ...payload
            }
        })
    }

    async function logout(){
        return await $api('/auth/logout', {
            method: 'POST',
        })
    }

    function can(abilities: any, model: any = null) {
        let access = false
        let targetAbilities: string[] = []
        if(!_.isArray(abilities)){
            targetAbilities.push(abilities)
        } else {
            targetAbilities = abilities as string[]
        }

        if(model === null){
            model = loggedInUser.value
        }
        if (model !== null) {
            let abilityFound = 0
            for (const ability of targetAbilities) {
                model.abilities.forEach((item : Ability) => {
                    if (item.name === "*") {
                        access = true
                    }
                    if (item.name === ability) {
                        abilityFound++
                    }
                })
            }
            if(targetAbilities.length === abilityFound){
                access = true
            }
        }
        return access
    }
    function canAny(abilities: string[] | string, model: any = null) {
        let access = false

        let targetAbilities: string[] = []
        if(!_.isArray(abilities)){
            targetAbilities.push(abilities)
        } else {
            targetAbilities = abilities as string[]
        }
        if(model === null){
            model = loggedInUser.value
        }
        if (model !== null) {
            for (const ability of targetAbilities) {
                model.abilities.forEach((loggedInUserAbility : Ability) => {
                    if (loggedInUserAbility.name === "*") {
                        access = true
                    }
                    if (loggedInUserAbility.name === ability) {
                        access = true
                    }
                })
            }
        }
        return access
    }




    return { loggedInUser, isAuthenticated, login, register, logout, can, canAny }
}
