---
## 带斑马纹表格
使用带斑马纹的表格，可以更容易区分出不同行的数据。

`stripe` 属性可以创建带斑马纹的表格。 如果 `true`, 表格将会带有斑马纹。
---

<script lang="ts" setup>
import { VpTable, createTableItems } from '@vue-plus/element-plus'

import '@vue-plus/element-plus/es/components/VpTable/style'

const items = createTableItems(() => {
  return [
    ['date', 'Date'],
    ['name', 'Name'],
    ['address', 'Address'],
  ]
})

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<template>
  <VpTable
    stripe
    :items="items"
    :data="tableData"
  />
</template>
