---
## 动态增减表单项
---

<script setup lang="ts">
import type { FormItemRule } from 'element-plus'
import { get } from 'lodash'
import { ref } from 'vue'

import type { FormSimpleItem } from '@vue-plus/element-plus'
import { VpForm, createFormItems } from '@vue-plus/element-plus'


const form = ref({
  domains: [{
    key: 1,
    value: '',
  }],
  email: '',
})

const emailRules: FormItemRule[] = [
  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
]

const items = createFormItems(({ rules, slot, required }) => {
  return [
    ['email', '邮箱', rules(emailRules)],
    ...form.value.domains.map((item, index) => {
      return [`domains.${index}.value`, `域名${index}`, slot('domains'), required('域名不能为空')] as FormSimpleItem
    }),
  ]
})

function addDomain() {
  form.value.domains.push({
    key: Date.now(),
    value: '',
  })
}

function removeDomain(key) {
  const item = get(form.value, key.replace(/\.value$/, ''))
  const index = form.value.domains.indexOf(item)
  if (index > -1) {
    form.value.domains.splice(index, 1)
  }
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
    :submit="onSubmit"
  >
    <template #domains="{ attrs, item }">
      <ElInput v-bind="attrs" />
      <ElButton class="mt-2" @click="removeDomain(item.key)">
        删除
      </ElButton>
    </template>
    <template #button-append="{ isSubmitIng, formRef }">
      <ElButton @click="addDomain()">
        添加域名
      </ElButton>
      <ElButton :disabled="isSubmitIng" @click="formRef.resetFields()">
        重置
      </ElButton>
    </template>
  </VpForm>
</template>

