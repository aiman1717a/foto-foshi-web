<template>
  <Dialog v-model:visible="visibleDeleteDialog" modal>
    <template #container="{ closeCallback }">
      <div class="flex flex-col justify-center items-center gap-5 text-center p-5">
        <h1 class="font-bold text-xl">Are you sure?</h1>
        <p>You cant undo this delete operation. Are you sure you want to delete this photo?</p>
        <p class="text-danger" v-if="error">{{error}}</p>
        <div class="flex flex-row justify-center items-center gap-5">
          <Button type="button" label="Cancel" text rounded severity="secondary" class="w-36" @click="closeDeleteConfirmationDialog(false)"></Button>
          <Button type="button" label="Delete" rounded severity="danger" :loading="isPending" class="w-36" @click="mutate(post_id)"></Button>
        </div>
      </div>
    </template>
  </Dialog>



</template>
<script setup lang="ts">
import {useMutation} from "@tanstack/vue-query";


const {notify} = useHelper()
const {$api} = useNuxtApp()
const {visibleDeleteDialog, post_id, closeDeleteConfirmationDialog} = usePost()

const { mutate, isPending, error } = useMutation({
  mutationFn: async (id: number) => {
    try {
      const data = await $api(`/api/posts/${id}`, {
        method: 'DELETE',
      })
      notify.success('Photo Deleted')
      return data
    }catch (e) {
      console.log(e)
      throw(e?.data?.message)
    }
  },
  onSuccess: () => {
    closeDeleteConfirmationDialog(false)
    navigateTo('/feed')
  }
})
</script>