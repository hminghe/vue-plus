---
## 提供全局默认属性
---

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableItem } from '../../VpTable'
import { defineItems, defineTablePro } from '../../VpTablePro'
import { VpConfigProvider } from '..'

import '../../VpTablePro/style'

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

const { VpTablePro, table } = defineTablePro<Row>(({ sort, searchDate, search, searchMultiple, dict }) => {
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

async function getList(query) {
  const list: Row[] = []
  for (let i = (query.currentPage - 1) * query.pageSize; i < (query.currentPage - 1) * query.pageSize + query.pageSize; i++) {
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

const batchDeleteLoading = ref(false)
async function batchDelete(rows) {
  batchDeleteLoading.value = true
  await wait(500)
  batchDeleteLoading.value = false
  ElMessage.success('删除成功')

  // 清空选择
  table.value?.clearSelection()

  // 刷新列表
  table.value?.refresh()
}

function onClickEdit(row: Row) {
  ElMessage.success(`点击了修改 ${row.id}`)
}

function onClickRemove(row: Row) {
  ElMessage.success(`点击了删除 ${row.id}`)
}
</script>

<template>
  <VpConfigProvider
    :table-pro="{
      border: false,
      tag: { effect: 'light', hit: false, round: true, size: 'small' },
    }"
  >
    <VpTablePro
      title="基础表格"
      selection="reserve"
      row-key="id"
      :api="getList"
      :default-sort="{ prop: 'date', order: 'descending' }"
      :default-search-query="{ name: '444', city: [1] }"
    >
      <template #default="{ selectionRows, clearSelection }">
        <ElAlert title="#default" effect="dark" />

        <div v-if="selectionRows.length">
          <ElAlert type="success" show-icon :closable="false">
            <template #title>
              <div class="display-flex items-center space-x-2">
                <div>已选择 <strong>{{ selectionRows.length }}</strong> 项</div>
                <ElPopconfirm
                  :title="`确认删除 ${selectionRows.length} 条记录吗？`"
                  confirm-button-text="删除"
                  confirm-button-type="danger"
                  @confirm="batchDelete(selectionRows)"
                >
                  <template #reference>
                    <ElLink
                      v-loading="batchDeleteLoading"
                      element-loading-background="transparent"
                      type="danger"
                      size="small"
                    >
                      批量删除
                    </ElLink>
                  </template>
                </ElPopconfirm>
                <ElLink size="small" @click="clearSelection">
                  取消选择
                </ElLink>
              </div>
            </template>
          </ElAlert>
        </div>
      </template>

      <template #table:before>
        <ElAlert title="#table:before" effect="dark" />
      </template>
      <template #table:after>
        <ElAlert title="#table:after" effect="dark" />
      </template>

      <template #before>
        <ElAlert title="#before" effect="dark" />
      </template>
      <template #after>
        <ElAlert title="#after" effect="dark" />
      </template>

      <template #item:header:name>
        #item:header:name
      </template>

      <template #item:name="{ row, search }">
        <ElPopover
          title="#item:name={ row, search }"
          trigger="hover"
          placement="top"
          width="300px"
        >
          <template #default>
            点击调用 search({ name: row.name }) 用名称搜索
          </template>
          <template #reference>
            <ElLink type="primary" @click="search({ name: row.name })">
              {{ row.name }}
            </ElLink>
          </template>
        </ElPopover>
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

      <template #buttons>
        <ElButton type="primary">
          添加
        </ElButton>
        <ElButton>导入</ElButton>
        <ElButton>导出</ElButton>
      </template>
    </VpTablePro>
  </VpConfigProvider>
</template>
