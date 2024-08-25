import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

// @ts-ignore
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueVirtualScroller )
    return {}
})