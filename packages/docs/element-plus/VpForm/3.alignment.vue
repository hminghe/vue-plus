---
## 对齐方式
根据你们的设计情况，来选择最佳的标签对齐方式。

通过设置 `label-position` 属性可以改变表单域标签的位置，可选值为 `top`、`left`， 当设为 `top` 时标签会置于表单域的顶部
---

<script setup lang="ts">
import '@vue-plus/element-plus/es/components/VpForm/style'
import { ref } from 'vue'
import type { FormProps } from 'element-plus'
import { VpForm, createFormItems } from '@vue-plus/element-plus'

const labelPosition = ref<FormProps['labelPosition']>('right')

const items = createFormItems(() => [
  ['name', '名称'],
  ['region', '活动区域'],
  ['type', '活动形式'],
])

function onSubmit(form) {
  console.log('submit', form)
}
</script>

<template>
  <ElRadioGroup v-model="labelPosition" size="small" class="mb-4">
    <ElRadioButton label="left">
      左对齐
    </ElRadioButton>
    <ElRadioButton label="right">
      右对齐
    </ElRadioButton>
    <ElRadioButton label="top">
      顶部对齐
    </ElRadioButton>
  </ElRadioGroup>

  <VpForm
    label-width="80px"
    :label-position="labelPosition"
    :items="items"
    :submit="onSubmit"
  />
</template>
