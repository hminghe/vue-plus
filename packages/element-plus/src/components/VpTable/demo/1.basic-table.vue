---
## 基础表格
基础的表格展示用法。
---

<script lang="ts" setup>
import { VpTable, createTableItems } from '../'

import '../style'

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
    :items="items"
    :data="tableData"
    :tag="{ type: 'success' }"
  />
</template>
