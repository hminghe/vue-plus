<script setup lang="ts">
import type { VNode } from 'vue'
import { useMultiWindowStore } from '..'

const props = defineProps<{
  is: VNode
}>()

const store = useMultiWindowStore()
</script>

<template>
  <keep-alive :include="store.keepAliveInclude">
    <component :is="store.currentWindow?.component || props.is" />
  </keep-alive>
</template>
