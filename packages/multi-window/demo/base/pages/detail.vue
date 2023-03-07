<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentWindow, onClose, onRefresh } from '@vue-plus/multi-window'

const route = useRoute()
const router = useRouter()
const window = getCurrentWindow()
const id = route.query.id

onRefresh(() => {
  // Custom refresh
  getNow()
})

onClose((close) => {
  if (confirm(`Close Detail ${id}?`)) {
    close()
  }
})

const now = ref(Date.now())

function getNow() {
  now.value = Date.now()
}
</script>

<template>
  <div>Detail {{ id }} - {{ now }}</div>
  <input placeholder="Check cache for input data">

  <div>
    <button @click="router.back()">
      Back
    </button>
    <button @click="window.close()">
      Close
    </button>
  </div>
</template>
