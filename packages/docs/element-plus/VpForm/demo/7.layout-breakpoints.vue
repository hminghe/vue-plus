---
## 响应适

这个响应适是响应 `form` 自身的宽度的，不是屏幕宽度。
---

<script setup lang="ts">
import { ref } from 'vue'

import { VpForm, createFormItems } from '@vue-plus/element-plus'

import '@vue-plus/element-plus/es/components/VpForm/style'

const form = ref({})
const items = createFormItems(({ layout }) => {
  return [
    ['name1', '活动名称1', layout({ xl: 8, lg: 12, md: 16, sm: 24 })],
    ['name2', '活动名称2'],
    ['name3', '活动名称3'],
    ['name4', '活动名称4'],
    ['name5', '活动名称5'],
    ['name6', '活动名称6'],
    ['name7', '活动名称7'],
  ]
})

const width = ref(600)

function onSubmit() {
  console.log('submit', form.value)
}

const marks = {
  640: 'sm',
  768: 'md',
  1024: 'lg',
  1280: 'xl',
}
</script>

<template>
  <div :style="{ width: `${width}px`, transition: 'width 0.5s' }">
    <VpForm
      v-model="form"
      label-width="120px"
      button-align="center"
      :button-layout="24"
      :layout="{ xl: 4, lg: 6, md: 8, sm: 12 }"
      :items="items"
      :submit="onSubmit"
    >
      <template #button-append="{ isSubmitIng, formRef }">
        <ElButton :disabled="isSubmitIng" @click="formRef.resetFields()">
          重置
        </ElButton>
      </template>
    </VpForm>
  </div>
  <ElSlider v-model="width" :min="500" :max="1300" :marks="marks" />
</template>

