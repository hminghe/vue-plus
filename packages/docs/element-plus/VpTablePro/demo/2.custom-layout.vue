---
## 自定义布局
使用 `layout` 插槽实现自定义布局，插槽提供 `Search` `Table` `Pagination` 三个主要组件，怎么布局你做主！

::: warning
使用了 `layout` 后，除了 `item:` 前缀的插槽，其它都再不生效！
:::
---

<script lang="ts" setup>
import '@vue-plus/element-plus/es/components/VpTablePro/style'
import { defineItems, defineTablePro } from '@vue-plus/element-plus'
import type { TableItem } from '@vue-plus/element-plus'

const cityDict: TableItem['dict'] = [
  { label: '上海', value: 1, tag: true },
  { label: '北京', value: 2, tag: 'danger' },
]

interface Row {
  id: number
  date: string
  name: string
  address: string
  city: number
}

const { VpTablePro } = defineTablePro<Row>((
  {
    sort,
    searchDate,
    search,
    searchMultiple,
    dict,
  },
) => {
  defineItems([
    ['date', 'Date', sort(), searchDate()],
    ['name', 'Name', search()],
    ['address', 'Address', search(), sort()],
    ['city', 'City', dict(cityDict), searchMultiple()],
    ['operate', 'Operate'],
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

function onClickEdit(row: Row) {
  ElMessage.success(`点击了修改 ${row.id}`)
}

function onClickRemove(row: Row) {
  ElMessage.success(`点击了删除 ${row.id}`)
}
</script>

<template>
  <VpTablePro
    selection="reserve"
    row-key="id"
    :api="getList"
    :default-sort="{ prop: 'date', order: 'descending' }"
    :default-search-query="{ name: '444', city: [1] }"
    :tag="{ effect: 'light', hit: false, round: true, size: 'small' }"
  >
    <template #layout="{ Search, Table, Pagination }">
      <ElRow :gutter="24">
        <ElCol :span="8">
          <!-- 搜索组件 -->
          <component :is="Search" />
        </ElCol>

        <ElCol :span="16">
          <!-- 分页组件 -->
          <component :is="Pagination" />
        </ElCol>
      </ElRow>

      <!-- 表格组件 -->
      <component :is="Table" />
    </template>

    <template #item:operate="{ row }">
      <ElSpace>
        <ElLink type="primary" @click="onClickEdit(row)">
          修改
        </ElLink>
        <ElLink type="danger" @click="onClickRemove(row)">
          删除
        </ElLink>
      </ElSpace>
    </template>
  </VpTablePro>
</template>
