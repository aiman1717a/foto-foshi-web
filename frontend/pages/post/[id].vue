<template>
  <div class="max-w-5xl md:mx-auto p-5 flex flex-col justify-center items-center pb-10" v-if="post">
    <div class="rounded-xl overflow-hidden aspect-video">
      <template v-if="getMedia(post).length > 0">
        <viewer :images="getMedia(post)">
          <img :src="getMedia(post)[0].original_url" alt="Image Not Found" class="w-full h-full object-cover">
        </viewer>
      </template>
    </div>
    <div class="mt-5 rounded-xl bg-white p-5 text-slate-500 w-full">
      <p> {{post.description}}</p>
      <div class="mt-5 flex flex-row gap-5">
        <div class="flex flex-row gap-2">
          <font-awesome-icon icon="calendar-days" class="w-4" />
          <p>{{publishedAt(post?.created_at, 'DD MMMM YYYY')}}</p>
        </div>
        <div class="flex flex-row gap-2">
          <font-awesome-icon icon="circle-user" class="w-4" />
          <p>{{post?.created_by?.name}}</p>
        </div>
      </div>
    </div>

    <template v-if="acl.deleteItem(post)">
      <Button label="Delete Photo" class="!bg-slate-200 mx-auto mt-5 w-56" text rounded severity="danger" @click="showDeleteConfirmationDialog(true, post.id)"></Button>
      <DeletePost></DeletePost>
    </template>

  </div>
</template>
<script setup lang="ts">
import {useQuery, useMutation} from "@tanstack/vue-query";
import { useRouteParams } from '@vueuse/router'
import {usePolicy} from './../usePostPolicy'
const acl = usePolicy()

definePageMeta({
  middleware: ["guest"]
});

const {$api} = useNuxtApp()
const {getCollection, publishedAt, notify} = useHelper()
const {visibleDeleteDialog, showDeleteConfirmationDialog} = usePost()

const id = useRouteParams('id')

const {data: post, isPending, refetch} = useQuery({
  queryKey: ['pos/post', id],
  queryFn: async ({queryKey}) => {
    try {
      const [_key, id] = queryKey;
      return await $api(`/api/posts/${id}`, {
        method: 'GET',
      })
    }catch (e) {
      console.log(e)
      throw new Error('Network response was not ok')
    }
  },
  staleTime: 0,
})



function getMedia(post: any){
  if(post){
    if(post.media){
      return getCollection(post.media, 'images')
    }
  }
  return []
}
// const DeletePost = defineAsyncComponent(() => import('~/components/DeletePost.vue'));
/*const dialog = useDialog();

const showDeleteConfirmationDialog = async (post_id: null) => {
  await nextTick()
  const dialogRef = dialog.open(DeletePost, {
    props: {
      header: '   ',
      style: {
        width: '20vw',
      },
      breakpoints:{
        '960px': '30vw',
        '640px': '20vw'
      },
      modal: false
    },
    data: {
      post_id: post_id,
    }
  });
}*/


</script>