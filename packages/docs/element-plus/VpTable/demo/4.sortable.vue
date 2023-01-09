---
## 排序

在列中设置 `sortable` 属性即可实现以该列为基准的排序， 接受一个 `Boolean`，默认为 `false`。 可以通过 `Table` 的 `default-sort` 属性设置默认的排序列和排序顺序。 可以使用 `sort-method` 或者 `sort-by` 使用自定义的排序规则。 如果需要后端排序，需将 `sortable` 设置为 `custom`，同时在 `Table` 上监听 `sort-change` 事件， 在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据。
---

<script lang="ts" setup>
import { VpTable, createTableItems } from '@vue-plus/element-plus'

import '@vue-plus/element-plus/es/components/VpTable/style'

const items = createTableItems(({ props }) => {
  return [
    ['date', 'Date', props({ sortable: true })],
    ['name', 'Name'],
    ['address', 'Address', props({ sortable: true })],
  ]
})

const tableData = [
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
]
</script>

<template>
  <VpTable
    border
    :default-sort="{ prop: 'date', order: 'descending' }"
    :items="items"
    :data="tableData"
  />
</template>
