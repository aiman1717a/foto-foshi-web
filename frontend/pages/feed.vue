<template>
  <div class="md:container md:mx-auto p-5 flex flex-col relative">
    <h1 class="text-2xl font-bold mb-5">Feed</h1>
      <ClientOnly>
        <div class="grid grid-cols-3 gap-5 my-5" v-if="isFetching && !isFetchingNextPage">
          <template v-for="i in 9">
            <Skeleton style="height: 100%" class="aspect-square"></Skeleton>
          </template>
        </div>

        <template v-if="items.length > 0">
          <div
              ref="parentRef"
              class="List"
          >
            <div class="overflow-auto relative w-full scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 overflow-y-auto" :style="{
          height: `${totalSizeRows}px`,
        }">
              <div
                  v-for="virtualRow in virtualRows"
                  :key="virtualRow.key">
                <div
                    v-for="virtualColumn in columnVirtualizer.getVirtualItems()"
                    :key="virtualColumn.index"
                    class="overflow-hidden"
                    :style="{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${virtualColumn.size}px`,
                  height: `${virtualRow.size}px`,
                  transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                }"
                >
                  <template v-if="items[virtualRow.index]">
                    <template v-if="items[virtualRow.index][virtualColumn.index]">
                      <nuxt-link :to="`post/${items[virtualRow.index][virtualColumn.index].id}`" class="rounded-xl overflow-hidden aspect-square">
                        <NuxtImg :src="items[virtualRow.index][virtualColumn.index].url" class="h-full w-full object-cover overflow-hidden" quality="50" loading="lazy" densities="x1 x2" sizes="100vw sm:100vw"></NuxtImg>
                      </nuxt-link>
                    </template>
                  </template>
                </div>

              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <LottieAnimation
              :animation-data="NotFoundJSON"
              :auto-play="true"
              :loop="true"
              :speed="1"
              ref="anim" class="!w-96 mx-auto"></LottieAnimation>
          <p class="mx-auto">No Fotos Found</p>
          <nuxt-link to="/upload" class="mx-auto mt-5">
            <Button class="!bg-primary !text-white !border-none" icon="pi pi-camera" label="Post a Photo"></Button>
          </nuxt-link>
        </template>


        <div
            class="my-5 flex flex-col justify-center items-center"
        >

          <template v-if="isFetchingNextPage">
            <div class="grid grid-cols-3 gap-5 my-5 w-full">
              <template v-for="i in 9">
                <Skeleton style="height: 100%" class="aspect-square"></Skeleton>
              </template>
            </div>
          </template>
          <template v-else-if="hasNextPage">
            <Button
                label="Load More"
                outlined
                @click="() => fetchNextPage()"
                :disabled="!hasNextPage || isFetchingNextPage"
            >
            </Button>
          </template>
          <template v-else>
<!--            <template v-if="items.length > 9">-->
<!--              <p>Nothing more to load</p>-->
<!--            </template>-->
          </template>
        </div>
      </ClientOnly>


  </div>
</template>
<script setup lang="ts">
import {useQuery, useInfiniteQuery} from "@tanstack/vue-query";
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { LottieAnimation } from "lottie-web-vue"
import NotFoundJSON from "~/assets/lottie/NotFound.json"
import _ from "lodash-es";
import { uuid } from 'uuidv4';
import { useVirtualizer } from '@tanstack/vue-virtual'
import { useWindowSize } from '@vueuse/core'
import { useScroll } from '@vueuse/core'

definePageMeta({
  middleware: ["guest"]
});

const parentRef = ref<HTMLElement | null>(null)
const { x, y } = useWindowScroll()

const {$api} = useNuxtApp()
const {getCollection} = useHelper()

const {
  data: posts,
  error,
  fetchNextPage,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  isPending,
  isError,
  suspense,
  status
} = useInfiniteQuery({
  queryKey: ['pos/posts'],
  initialPageParam: 0,
  queryFn: async ({queryKey, pageParam = 0}) => {
    try {
      const [_key] = queryKey;
      let url = `/api/posts`
      if(pageParam !== 0){
        url = `/api/posts?cursor=${pageParam}`
      }
      return await $api(url, {
        method: 'GET',
      })
    }catch (e) {
      console.log(e)
      throw new Error('Network response was not ok')
    }
  },
  getNextPageParam: (lastPage, pages) => {
    console.log(lastPage)
    console.log(lastPage.next_cursor)
    return lastPage.next_cursor || undefined
  },
  staleTime: 0,
})
/*onServerPrefetch(async () => {
  await suspense()
})*/

const { width, height } = useWindowSize()


const cols = ref(3)
const gap = ref(20)
const items = computed(() => {
  if(posts.value){
    // let allData = posts.value.pages.flatMap((d) => d.data)
    const allData = _.flatMap(_.cloneDeep(posts.value.pages), 'data');
    const lolData = _.map(allData, (item) => {
      let media = getMedia(item)
      if(media.length > 0){
        item['url'] = media[0].original_url
      }
      return item
    });

    const chunkedData = _.chunk(lolData, cols.value);
    return chunkedData
  }
  return []
})


const rowVirtualizerOptions = computed(() => {
  return {
    count: items.value.length,
    getScrollElement: () => parentRef.value,
    estimateSize: () => {
      let width = 1400;
      if(parentRef.value){
        width = parentRef?.value?.offsetWidth
      }
      return (width / cols.value) - gap.value
    },
    gap:gap.value,
    overscan: 5,
  }
})

const rowVirtualizer = useVirtualizer(rowVirtualizerOptions)

const columnVirtualizer = useVirtualizer({
  horizontal: true,
  count: cols.value,
  getScrollElement: () => parentRef.value,
  gap:gap.value,
  estimateSize: (id: any) => {
    console.log(id)
    let width = 1400;
    console.log(parentRef?.value?.offsetWidth)
    if(parentRef.value){
      width = parentRef?.value?.offsetWidth
    }
   /* if(id === 3){
      return (width / cols.value)
    }*/
    return ((width / cols.value) - gap.value) + 5
  },
})

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())
const totalSizeRows = computed(() => rowVirtualizer.value.getTotalSize())
const totalSizeColumns = computed(() => columnVirtualizer.value.getTotalSize())

watch(width, () => {
  columnVirtualizer.value.measure()
  rowVirtualizer.value.measure()
}, {immediate: true, deep: true})

onMounted(() => {
  console.log(rowVirtualizer.value)

  watch(y, () => {
    if (parentRef.value) {
      const parentElement = parentRef.value
      const parentRect = parentElement.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      // console.log(parentRect.bottom)
      // console.log((viewportHeight + 200))

      // Check if scrolled to the bottom of the parent element
      if (parentRect.bottom <= (viewportHeight + 500)) {
        if(hasNextPage && !isFetchingNextPage.value) {
          fetchNextPage()
        }else{
          // console.log('not fetching next page')
        }
      }
    }
  })
})

function getMedia(post: any){
  if(post){
    if(post.media){
      return getCollection(post.media, 'images')
    }
  }
  return []
}

</script>
<style lang="scss">
.wrapper,
.scroller {
  height: 100%;
}

/*.wrapper {
  display: flex;
  flex-direction: column;
}

.toolbar {
  flex: none;
}

.scroller {
  flex: 1;
}

.scroller :deep(.hover) img {
  opacity: 0.5;
}

.item {
  position: relative;
  height: 100%;
}

.index {
  position: absolute;
  top: 2px;
  left: 2px;
  padding: 4px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.85);
  color: black;
}*/
</style>

<style lang="scss" scoped>
/*.scroller {
  height: 100%;
}*/
</style>