---
## 带边框表格
使用带斑马纹的表格，可以更容易区分出不同行的数据。

默认情况下，`Table` 组件是不具有竖直方向的边框的， 如果需要，可以使用 `border` 属性，把该属性设置为 `true` 即可启用。
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
    border
    :items="items"
    :data="tableData"
  />
</template>
