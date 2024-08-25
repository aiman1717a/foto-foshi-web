
const CSRF_COOKIE = "XSRF-TOKEN";
const CSRF_HEADER = "X-XSRF-TOKEN";

async function initCsrf() {
    const { baseUrl, domain } = useRuntimeConfig().public;
    const existingToken = useCookie(CSRF_COOKIE, {
        domain: domain as string,
        watch: false
    }).value;

    if (existingToken) return existingToken;

    await $fetch("/sanctum/csrf-cookie", {
        baseURL: baseUrl,
        credentials: "include",
    });

    return useCookie(CSRF_COOKIE, {
        domain: domain as string,
        watch: false
    }).value;
}

export const useMyFetch: typeof useFetch = (request, opts?) => {
    const con = useRuntimeConfig()

    /* const xsrfToken = useCookie('XSRF-TOKEN', {
         domain: con.public.domain as string,
         watch: false
     })*/

    /*let headers = {
        Accept: 'application/json',
        "Content-Type": "application/json",
        ...opts?.headers,
    }*/

    // if (xsrfToken && xsrfToken.value !== null) {
    //     // @ts-ignore
    //     headers['X-XSRF-TOKEN'] = xsrfToken.value;
    // }


    /*if (process.server) {
        // @ts-ignore
        headers = {
            ...headers,
            ...useRequestHeaders(['cookie']),
            referer: con.public.appUrl
        }
    }*/
    return useFetch(request, {
        baseURL: con.public.baseUrl,
        // headers,
        credentials: 'include',
        ...opts,
        async onRequest({request, options}) {
            try{
                const { baseUrl, appUrl, domain } = useRuntimeConfig().public;
                const event = typeof useEvent === "function" ? useEvent() : null;
                let token = event ? parseCookies(event)[CSRF_COOKIE] : useCookie(CSRF_COOKIE, {
                    domain: domain as string,
                    watch: false
                }).value;

                // on client initiate a csrf request and get it from the cookie set by laravel
                if (
                    process.client &&
                    ["post", "delete", "put", "patch"].includes(
                        options?.method?.toLowerCase() ?? ""
                    )
                ) {
                    token = await initCsrf();
                }

                let headers: any = {
                    accept: "application/json",
                    ...options?.headers,
                    ...(token && { [CSRF_HEADER]: token }),
                };

                if (process.server) {
                    const cookieString = event
                        ? event.headers.get("cookie")
                        : useRequestHeaders(["cookie"]).cookie;

                    headers = {
                        ...headers,
                        ...(cookieString && { cookie: cookieString }),
                        referer: appUrl,
                    };
                }

                options.headers = headers;
                options.baseURL = baseUrl;
            }catch (e) {
                console.log(e)
            }
        },
        onResponseError({request, response, options}) {
            const status = response.status;
            if ([500].includes(status)) {
                console.error("[Laravel Error]", response.statusText, response._data);
            }

            if ([401, 419].includes(status)) {
                navigateTo("/login");
            }

            if ([409].includes(status)) {
                navigateTo("/verify-email");
            }
        },
    })

    // return useFetch(request, { baseURL: config.public.apiBaseURL, credentials: "include", ...opts })
}