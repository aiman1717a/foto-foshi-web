<template>
  <div class="flex flex-row items-center pt-4 pb-2">
    <h6 class="text-base font-medium">
      {{ title }}
    </h6>
    <template v-if="info !== null">
      <font-awesome-icon id="info" class="cursor-pointer w-5 mx-3" icon="fa-regular fa-circle-question" />
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

// import { useTippy } from '@/plugins/tippy'

interface Props {
  title?: string | null;
  rtl?: boolean;
  info?: string | null;
}
const props = withDefaults(defineProps<Props>(),{
  title: null,
  rtl: false,
  info: null,
})

const {
  title,
  rtl,
  info,
} = toRefs(props);

// const tippy = useTippy()

// const { directionFlex, directionText } = useSettings(props, null)

onMounted(() => {
  if (info.value) {
    /* tippy('#info', {
       animation: 'scale',
       content: props.info
     })*/
  }
})
</script>
