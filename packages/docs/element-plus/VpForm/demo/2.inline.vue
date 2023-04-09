---
## 行内表单
当垂直方向空间受限且表单较简单时，可以在一行内放置表单。
通过设置 `inline` 属性为 `true` 可以让表单域变为行内的表单域。
---

<script setup lang="ts">
import { VpForm, createFormItems } from '@vue-plus/element-plus'

const items = createFormItems(({ dict }) => {
  return [
    ['name', '活动名称'],
    ['region', '活动区域',
      dict([
        { label: '上海', value: 1 },
        { label: '北京', value: 2 },
      ]),
    ],
  ]
})

function onSubmit() {
  console.log('submit')
}
</script>

<template>
  <VpForm inline :items="items" :submit="onSubmit" />
</template>
