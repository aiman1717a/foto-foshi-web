<template>
  <div class="bg-white">
    <div class="md:container flex flex-row justify-center items-center flex-wrap py-5 px-5 gap-5">
      <nuxt-link to="/feed" class="mr-auto">
        <img :src="Logo" alt="Image not found" class="w-36">
      </nuxt-link>

      <nuxt-link to="/#">
        <Button rounded icon="pi pi-cog" severity="secondary"></Button>
      </nuxt-link>

      <nuxt-link to="/upload">
        <Button class="!bg-primary !text-white !border-none" icon="pi pi-camera" label="Post a Photo"></Button>
      </nuxt-link>

      <ClientOnly>
        <template  v-if="loggedInUser">
          <Menu as="div" class="relative">
            <MenuButton class="flex flex-row justify-center items-center gap-2 rounded-xl px-2">
              <div class="rounded-full bg-slate-100 w-10 h-10 flex flex-col justify-center items-center">
                <i class="pi pi-user w-5 h-5 "></i>
              </div>
              <p>{{loggedInUser.name}}</p>
              <i class="pi pi-chevron-down"></i>
            </MenuButton>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 top-10 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <button type="button" @click="onLogout" class="flex flex-row justify-between items-center !p-3" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">
                      <p>Logout</p>
                      <i class="pi pi-sign-out"></i>
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </template>
      </ClientOnly>

    </div>
  </div>
</template>
<script setup lang="ts">
import Logo from '~/assets/images/FotoFoshi Logo.png'
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";

const {loggedInUser, logout} = useAuth()

async function onLogout(){
  await logout()
  location.reload();
}
</script>
