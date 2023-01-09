---
## 典型表单
最基础的表单包括各种输入表单项，比如`input`、`select`、`radio`、`checkbox`等。
---

<script setup lang="ts">
import { ref } from 'vue'

import { VpForm, createFormItems } from '@vue-plus/element-plus'

import * as formComponents from '@vue-plus/element-plus/es/components/VpForm/components'

import '@vue-plus/element-plus/es/components/VpForm/style'

const form = ref({})
const items = createFormItems(({ component, layout, props, dict }) => {
  const regionDict = dict([
    { label: '上海', value: 1 },
    { label: '北京', value: 2 },
  ])

  const typeDict = dict(['美食/餐厅线上活动', '地推活动', '线下主题活动', '单纯品牌曝光'])
  const resourceDict = dict(['线上品牌商赞助', '线下场地免费'])

  return [
    ['name', '活动名称'],
    ['region', '活动区域', regionDict],
    ['date1', '活动时间', component(formComponents.date, { placeholder: '选择日期' }), layout(12)],
    ['date2', '-', component(formComponents.timeSelect, { placeholder: '选择时间' }), layout(12), props({ labelWidth: '1em' })],
    ['delivery', '即时配送', component(formComponents._switch)],
    ['type', '活动性质', component(formComponents.checkbox), typeDict],
    ['resource', '特殊资源', component(formComponents.radio), resourceDict],
    ['desc', '活动形式', component(formComponents.textarea)],
  ]
})

function onSubmit() {
  console.log('submit', form.value)
}
</script>

<template>
  <VpForm
    v-model="form"
    label-width="80px"
    :items="items"
    :submit="onSubmit"
  >
    <template #button-append="{ isSubmitIng, formRef }">
      <ElButton :disabled="isSubmitIng" @click="formRef.resetFields()">
        重置
      </ElButton>
    </template>
  </VpForm>
</template>

