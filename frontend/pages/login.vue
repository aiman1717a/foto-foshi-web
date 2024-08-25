<template>
  <div class="bg-background flex flex-col h-full">
    <div class="md:container md:mx-auto p-5 md:mt-28 h-full">
      <div class="flex flex-col items-center justify-center my-auto h-full">

        <div class="w-full md:w-6/12 lg:w-4/12 mt-10">
          <p class="text-2xl text-center font-bold mb-5">Login to FotoFoshi</p>
          <form @submit.prevent="onSubmit" class="bg-white p-8 rounded-xl flex flex-col gap-5">
            <FormTextField :form="form" label="Email" field="email"></FormTextField>
            <FormTextField :form="form" label="Password" field="password" :password="true" :password-feedback="false"></FormTextField>
            <Button type="submit" label="Login" class="!bg-primary !text-white mt-3" severity="secondary" rounded :loading="isPending"></Button>
          </form>
          <template v-if="isError">
            <div class="mt-2 text-sm text-red-600">{{error?.data?.message}}</div>
          </template>
        </div>


        <p class="mt-10 text-center text-sm text-gray-500">
          Don't have an account?
          {{ ' ' }}
          <nuxt-link :to="'/sign-up'" class="font-semibold leading-6 text-primary hover:text-yellow-500">Sign Up</nuxt-link>
        </p>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import {useForm} from 'vee-validate';
import {useMutation} from "@tanstack/vue-query";

definePageMeta({
  middleware: ["redirect-auth"]
});

const form = useForm({
  validationSchema: {
    email: 'required|email',
    password: 'required',
  },
  initialValues: {
    email: null,
    password: null,
  }
})



const route = useRoute()
const {login} = useAuth()


const { mutate, status, isPending, isError, error } = useMutation({
  mutationFn: login
})

watch(status, async () => {
  if(status.value === 'success'){
    if(typeof route.query.return_to !== 'undefined'){
      await navigateTo(route.query.return_to.toString())
    }else{
      await navigateTo('/')
    }
  }
})

const onSubmit = form.handleSubmit(async (values: any) => {
  await mutate(values)
})

</script>

<style lang="scss">

</style>