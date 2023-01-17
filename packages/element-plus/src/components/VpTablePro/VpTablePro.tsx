import { ElCard, ElPagination, vLoading } from 'element-plus'
import { omit } from 'lodash'
import { defineComponent } from 'vue'
import type { ExtractPropTypes, PropType } from 'vue'
import { useRender } from '../../shared'

import type { FormItem, FormItemLayout } from '../VpForm'

import type { TableItem } from '../VpTable'
import { VpTable, vpTableProps } from '../VpTable'

import { createStore } from './store'
import { VpTableProSearch } from './VpTableProSearch'

const tableProps = omit(vpTableProps, ['items'])

const tablePropKeys = Object.keys(tableProps)

export type TableProApi<Row> = (query) => Promise<{
  total: number
  list: Row[]
}>

export interface TableProItem extends TableItem {
  search?: Partial<FormItem> | boolean
  sort?: boolean
  hide?: boolean
}

const tableProProps = {
  title: String,

  items: Array as PropType<TableProItem[]>,

  searchItems: Array as PropType<FormItem[]>,

  api: {
    required: true,
    type: Function as PropType<TableProApi<any>>,
  },

  defaultSearchQuery: Object,

  searchLayout: {
    type: Object as PropType<FormItemLayout>,
    default: { xl: 6, md: 8, sm: 12 },
  },

  apiQueryProps: {
    type: Object as PropType<{
      pageSize: string
      currentPage: string
      sortField: string
      sortOrder: string
      ascending: string
      descending: string
    }>,
    default: () => ({
      pageSize: 'pageSize',
      currentPage: 'currentPage',
      sortField: 'sortField',
      sortOrder: 'sortOrder',
      ascending: 'ascending',
      descending: 'descending',
    }),
  },

  ...tableProps,
}

export const defaultProps: Record<string, any> = {}

Object.keys(tableProProps).forEach((key) => {
  const item = tableProProps[key]

  // 获取 props default 的value
  if (item.default) {
    defaultProps[key] = item.default
  }

  // Boolean 类型的会默认自动设置为 false，所以加个 default = undefined
  if (item === Boolean || item.type === Boolean) {
    tableProProps[key] = {
      type: Boolean,
      default: () => undefined,
    }
  }
})

export function createTablePro<Row>() {
  return defineComponent({
    name: 'VpTablePro',

    directives: {
      loading: vLoading,
    },

    props: {
      ...tableProProps,

      api: {
        required: true,
        type: Function as PropType<TableProApi<Row>>,
      },
    },

    emits: [
      'select',
      'select-all',
      'selection-change',
      'cell-mouse-enter',
      'cell-mouse-leave',
      'cell-contextmenu',
      'cell-click',
      'cell-dblclick',
      'row-click',
      'row-contextmenu',
      'row-dblclick',
      'header-click',
      'header-contextmenu',
      'sort-change',
      'filter-change',
      'current-change',
      'header-dragend',
      'expand-change',
    ],

    setup(props, context) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const store = createStore<Row>(props, context)

      const {
        computedProps,
        tableRef,
        tableItems,
        pagination,
        isLoading,
        onSortChange,
        list,
        total,
        tableSlots,
        renderSlots,
        searchItems,

        publicStore,
      } = store

      // renders
      function renderTableHeader() {
        if (!context.slots.buttons && !context.slots['table:header']) {
          return null
        }

        const { title } = computedProps.value

        return (
            <div class="vp-table-header">
              {title && <div>{title}</div>}
              {renderSlots('table:header')}
              {<div style="flex: 1"></div>}
              <div class="vp-table-header-buttons">
                {renderSlots('buttons')}
              </div>
            </div>
        )
      }

      function renderSearch() {
        return <VpTableProSearch />
      }

      function renderTable() {
        const tableProps = {}
        tablePropKeys.forEach((key) => {
          tableProps[key] = computedProps.value[key]
        })
        return <VpTable
          ref={ tableRef }
          {...tableProps}
          items={ tableItems.value }
          data={ list.value }
          onSort-change={ onSortChange }
          v-loading={ isLoading.value }
          v-slots={ tableSlots.value }
        />
      }

      function renderPagination() {
        return <ElPagination
          background
          layout="total, sizes, prev, pager, next"
          total={ total.value }
          current-page={ pagination.value.currentPage }
          pageSize={ pagination.value.pageSize }
          onUpdate:current-page={ currentPage => pagination.value.currentPage = currentPage }
          onUpdate:page-size={ pageSize => pagination.value.pageSize = pageSize }
        />
      }

      useRender(() => {
        if (context.slots.layout) {
          return (
            <>
              {renderSlots('layout', {
                Search: renderSearch,
                Table: renderTable,
                Pagination: renderPagination,
              })}
            </>
          )
        }

        const search = searchItems.value.length
          ? (<ElCard shadow="never">
              {renderSearch()}
            </ElCard>)
          : null

        return (
          <div class="vp-table">
            {renderSlots('before')}

            {search}

            {renderSlots('default')}

            <ElCard
              shadow="never"
              header={ computedProps.value?.title }
              v-slots={{
                header: renderTableHeader,
              }}
            >
              {renderSlots('table:before')}

              {renderTable()}

              <div class="vp-table-pagination">
                {renderPagination()}
              </div>

              {renderSlots('table:after')}
            </ElCard>
            {renderSlots('after')}
          </div>
        )
      })

      return publicStore
    },
  })
}

export type VpTableProProps = ExtractPropTypes<typeof tableProProps>

