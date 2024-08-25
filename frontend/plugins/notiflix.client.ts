import pkg from 'notiflix/build/notiflix-notify-aio';
const { Notify } = pkg;

export default defineNuxtPlugin((nuxtApp) => {

    Notify.init({
        fontFamily: 'Quicksand',
        position: 'right-bottom',
        clickToClose: true,
        timeout: 1000,
        showOnlyTheLastOne: true
    })

    return {
        provide: {
            notify: Notify
        }
    }
})
