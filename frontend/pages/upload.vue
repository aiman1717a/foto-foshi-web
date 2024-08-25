<template>
  <div class="md:container md:mx-auto p-5">
    <h1 class="text-center mb-5 font-bold text-2xl">Upload Image</h1>
    <form @submit.prevent="onSubmit" class="bg-white p-8 rounded-xl flex flex-col gap-5">
      <FormMediaUploadField :form="form" label="Media" field="media" :multiple="false" :show-label="false"></FormMediaUploadField>
      <FormTextAreaField :form="form" label="Description" field="password"></FormTextAreaField>
      <Button type="submit" label="Upload" class="!bg-primary !text-white mt-3 w-60 mx-auto" severity="secondary" rounded :loading="isPending"></Button>
    </form>
  </div>
</template>
<script setup lang="ts">
import {useForm} from 'vee-validate';
import {useMutation} from "@tanstack/vue-query";

definePageMeta({
  middleware: ["auth"]
});

const { $api } = useNuxtApp()
const { notify } = useHelper()
const form = useForm({
  validationSchema: {
    media: 'required',
    description: 'required',
  },
  initialValues: {
    media: null,
    description: 'gfgsdfdf',
  }
})



const route = useRoute()
const {login} = useAuth()


const { mutate, status, isPending, isError, error } = useMutation({
  mutationFn: async (values: any) => {
    try {
      const data = await $api(`/api/posts`, {
        method: 'POST',
        body: {
          description: values['description'],
          media: values['media'],
        }
      })
      return data
    }catch (e) {
      console.log(e)
      notify.failure('Error Creating Post')
      throw new Error('Network response was not ok')
    }
  },
  onSuccess: () => {
    navigateTo('/feed')
  }
})

const onSubmit = form.handleSubmit(async (values: any) => {
  await mutate(values)
})

</script>