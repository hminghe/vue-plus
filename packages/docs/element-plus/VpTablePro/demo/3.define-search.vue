---
## 复杂的搜索
- 使用 `defineSearchItems` 独立定义搜索
- 使用 `#item:search:` 前缀的插槽自定义搜索组件
---

<script lang="ts" setup>
import { ElTimeSelect } from 'element-plus'
import { useAsyncState } from '@vueuse/core'
import { defineItems, defineSearchItems, defineTablePro } from '@vue-plus/element-plus'
import type { TableItem } from '@vue-plus/element-plus'

interface Row {
  id: number
  date: string
  name: string
  address: string
  city: number
}

const { state: cityDict } = useAsyncState<TableItem['dict']>(async () => {
  await wait(1000)
  return [
    { label: '上海', value: 1, tag: true },
    { label: '北京', value: 2, tag: 'danger' },
  ]
}, [])

const { VpTablePro } = defineTablePro<Row>((
  {
    sort,
    searchDate,
    searchMultiple,
    dict,
  },
) => {
  defineItems([
    ['date', 'Date', sort()],
    ['name', 'Name'],
    ['address', 'Address', sort()],
    ['city', 'City', dict(cityDict.value)],
    ['operate', 'Operate'],
  ])

  defineSearchItems([
    ['keyword', 'Keyword'], // 新字段
    ['city', searchMultiple()], // 使用和表格一样的名称，第二个参数可以省略
    ['date', 'Date2', searchDate()], // 修改显示名称
    ['dateTime', 'DateTime'],
  ])
})

function wait(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => [
      resolve(undefined),
    ], time)
  })
}

// 模拟接口获取数据
async function getList(query) {
  const list: Row[] = []
  const start = (query.currentPage - 1) * query.pageSize
  const end = (query.currentPage - 1) * query.pageSize + query.pageSize
  for (let i = start; i < end; i++) {
    list.push({
      id: i,
      date: '2019-01-10',
      name: `${query.currentPage}-name${i}`,
      address: `address${i}`,
      city: i % 2 + 1,
    })
  }

  await wait(500)

  return {
    total: 999,
    list,
  }
}
</script>

<template>
  <VpTablePro
    title="基础表格"
    selection="reserve"
    row-key="id"
    :api="getList"
  >
    <template #item:search:dateTime="{ attrs }">
      <ElTimeSelect
        v-bind="attrs"
        start="08:30"
        step="00:15"
        end="18:30"
        placeholder="请选择时间"
      />
    </template>
  </VpTablePro>
</template>
