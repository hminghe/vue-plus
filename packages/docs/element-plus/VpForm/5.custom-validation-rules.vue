---
## 自定义校验规则
这个例子中展示了如何使用自定义验证规则来完成密码的二次验证。
- 本例还使用 `status-icon` 属性为输入框添加了表示校验结果的反馈图标。
---

<script setup lang="ts">
import type { FormRules } from 'element-plus'
import { ref } from 'vue'

import { VpForm, createFormItems } from '@vue-plus/element-plus'

import * as formComponents from '@vue-plus/element-plus/es/components/VpForm/components'
import '@vue-plus/element-plus/es/components/VpForm/style'

const form = ref<Record<string, string>>({})
const items = createFormItems(({ component }) => [
  ['pass', '密码', component(formComponents.password)],
  ['checkPass', '确认密码', component(formComponents.password)],
  ['age', '年龄', component(formComponents.number)],
])

const checkAge = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('年龄不能为空'))
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error('请输入数字值'))
    } else {
      if (value < 18) {
        callback(new Error('必须年满18岁'))
      } else {
        callback()
      }
    }
  }, 1000)
}
const validatePass = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}
const validatePass2 = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.value.pass) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  pass: [
    { validator: validatePass, trigger: 'blur' },
  ],
  checkPass: [
    { validator: validatePass2, trigger: 'blur' },
  ],
  age: [
    { validator: checkAge, trigger: 'blur' },
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
    status-icon
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

