---
## 后端排序
将 `sortable` 设置为 `custom`，同时在 `Table` 上监听 `sort-change` 事件， 在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据。
---

<script lang="ts" setup>
import { ref } from 'vue'
import { VpTable, createTableItems } from '..'

import '../style'

const items = createTableItems(({ props }) => {
  return [
    ['date', 'Date', props({ sortable: 'custom' })],
    ['name', 'Name'],
    ['address', 'Address', props({ sortable: 'custom' })],
  ]
})

const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 111, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 114, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 119, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 110, Grove St, Los Angeles',
  },
])

async function onSortChange({ column, prop, order }) {
  // column：排序列的元数据
  // prop：排序字段
  // order：排序类型，'ascending' = 升序、'descending' = 降序、null = 取消排序
  console.log('column, prop, order', column, prop, order)
  // 在这里调用接口获取table数据
}
</script>

<template>
  <VpTable
    border
    :default-sort="{ prop: 'date', order: 'descending' }"
    :items="items"
    :data="tableData"
    @sort-change="onSortChange"
  />
</template>
