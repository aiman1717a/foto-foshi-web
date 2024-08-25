// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  /*server: {
    hmr: {
      clientPort: 3000
    },
  },*/
  routeRules: {
    '/': { redirect: '/feed' },
  },
  runtimeConfig: {
    public: {
      domain: process.env.DOMAIN,
      appUrl: process.env.APP_URL,
      baseUrl: process.env.BASE_URL || 'https://api.example.com/',
    },
  },
  modules: [
    '@nuxtjs/google-fonts',
    '@primevue/nuxt-module',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],

  imports: {
    presets: [
      {
        from: '@tanstack/vue-query',
        imports: ['useQuery', 'useMutation']
      }
    ]
  },

  build: {
    transpile: [
      'lodash-es',
      '@vee-validate/rules',
      'primevue',
      '@headlessui/vue',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/pro-solid-svg-icons',
      '@fortawesome/pro-regular-svg-icons',
      '@fortawesome/pro-light-svg-icons',
      '@fortawesome/free-brands-svg-icons'
    ],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },
  components: [
    { path: '~/cms/form', prefix: 'Form' },
    { path: '~/cms/table', prefix: 'Table' },
    '~/components'
  ],
  css: [
    '@/assets/scss/main.scss',
    'primeicons/primeicons.css',
  ],
  googleFonts: {
    families: {
      Roboto: true,
      'Josefin+Sans': true,
      Inter: [400, 700],
      Lato: [100, 300],
      Raleway: {
        wght: [100, 400],
        ital: [100]
      }
    }
  },
})