<script setup lang="ts">
import { RouterView } from 'vue-router'
import MultiWindowKeepAlive from './MultiWindowKeepAlive.vue'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <MultiWindowKeepAlive :is="Component" />
  </RouterView>
</template>
