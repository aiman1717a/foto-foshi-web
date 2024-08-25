<template>
  <div class="bg-background">
    <AppBar></AppBar>
    <NuxtLoadingIndicator color="#FFC700" />
    <DynamicDialog />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

import DynamicDialog from 'primevue/dynamicdialog';

useSeoMeta({
  title: 'FotoFoshi',
  ogTitle: 'FotoFoshi',
  description: 'A place to share your memories',
  ogDescription: 'A place to share your memories',
})

</script>