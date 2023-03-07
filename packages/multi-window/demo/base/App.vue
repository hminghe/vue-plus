<script lang="ts" setup>
import type { Window } from '@vue-plus/multi-window'
import { MultiWindowRouter, useMultiWindowStore } from '@vue-plus/multi-window'

const store = useMultiWindowStore()

function rename(window: Window) {
  const name = prompt('Input window name', window.name || '')
  if (name) {
    window.rename(name)
  }
}
</script>

<template>
  <div>
    <h3>Current windows: </h3>
    <div v-for="window in store.windows" :key="window.fullPath" style="margin-top: 10px">
      <button :disabled="store.currentWindow === window" @click="$router.push(window.fullPath)">
        {{ window.name }}
      </button>
      <a @click="window.refresh()">Refresh</a>
      <a @click="window.close()">Close</a>
      <a @click="rename(window)">Rename</a>
    </div>
  </div>

  <h3>Current page:</h3>
  <MultiWindowRouter />
</template>

<style scoped>
h3 {
  margin-bottom: 0;
  margin-top: 20px;
}
button {
  margin-right: 5px;
}
button[disabled] {
  zoom: 1.2;
}
a {
  font-size: 14px;
  margin: 0 5px;
  cursor: pointer;
}
</style>
