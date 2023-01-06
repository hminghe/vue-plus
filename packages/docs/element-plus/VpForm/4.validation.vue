---
## 表单验证
在防止用户犯错的前提下，尽可能让用户更早地发现并纠正错误。
---

<script setup lang="ts">
import type { FormRules } from 'element-plus'
import { ref } from 'vue'

import { VpForm, createFormItems } from '@vue-plus/element-plus'

import * as formComponents from '@vue-plus/element-plus/es/components/VpForm/components'
import '@vue-plus/element-plus/es/components/VpForm/style'

const form = ref({})
const items = createFormItems(({ layout, component, props, dict }) => {
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

const rules: FormRules = {
  name: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
  ],
  region: [
    { required: true, message: '请选择活动区域', trigger: 'change' },
  ],
  date1: [
    { type: 'date', required: true, message: '请选择日期', trigger: 'change' },
  ],
  date2: [
    { required: true, message: '请选择时间', trigger: 'change' },
  ],
  type: [
    { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' },
  ],
  resource: [
    { required: true, message: '请选择活动资源', trigger: 'change' },
  ],
  desc: [
    { required: true, message: '请填写活动形式', trigger: 'blur' },
  ],
}

function onSubmit() {
  console.log('submit', form.value)
}
</script>

<template>
  <VpForm
    v-model="form"
    label-width="80px"
    :items="items"
    :rules="rules"
    :submit="onSubmit"
  >
    <template #button-append="{ isSubmitIng, formRef }">
      <ElButton :disabled="isSubmitIng" @click="formRef.resetFields()">
        重置
      </ElButton>
    </template>
  </VpForm>
</template>

