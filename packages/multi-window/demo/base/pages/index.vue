<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { onClose, onRefresh } from '@vue-plus/multi-window'

onRefresh((refresh) => {
  if (confirm('Refresh?')) {
    refresh()
  }
})

onClose((close) => {
  if (confirm('Close?')) {
    close()
  }
})
</script>

<template>
  <input placeholder="Check cache for input data">

  <div v-for="i in 10" :key="i">
    <RouterLink :to="`/detail?id=${i}`">
      Detail {{ i }}
    </RouterLink>
  </div>
</template>
