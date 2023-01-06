import { defineComponent, nextTick, reactive, ref, watch } from 'vue'
import type { ExtractPropTypes, PropType, VNode } from 'vue'

import type { TagProps } from 'element-plus'
import { ElTable, ElTableColumn, ElTag } from 'element-plus'

import tableProps from 'element-plus/es/components/table/src/table/defaults'
import type elTableColumnProps from 'element-plus/es/components/table/src/table-column/defaults'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { useRender } from '../../shared'

type ElTableColumnProps = ExtractPropTypes<typeof elTableColumnProps>

type InstanceElType = InstanceType<typeof ElTable>

type a = Partial<TagProps>

export const tableSlotsPrefix = {
  column: 'item:',
  header: 'item:header:',
}

export interface TableItem {
  key: string
  label?: string
  props?: Partial<Omit<ElTableColumnProps, 'label'>>

  children?: TableItem[]
  dict?: {
    label: string | number
    value: string | number
    /** @description 使用ElTag显示，空/success/info/warning/danger */
    tag?: '' | 'success' | 'warning' | 'info' | 'danger' | true
  }[]
  formatter?: (
    elCtx: {
      row: any
      column: TableColumnCtx<any>
      cellValue
      index: number
    },
    tableColumn: TableItem
  ) => VNode | string
}

const tablePropKeys = Object.keys(tableProps)

export const VpTableProps = {
  ...tableProps,

  selection: [Boolean, String] as PropType<Boolean | 'reserve'>,

  /** @description table items */
  items: {
    required: true,
    type: Array as PropType<TableItem[]>,
  },

  tag: {
    type: Object as PropType<a>,
  },

  defaultFormatter: {
    type: Function as PropType<TableItem['formatter']>,
  },
}

export const VpTable = defineComponent({
  name: 'VpTable',

  // inheritAttrs: false,

  props: { ...VpTableProps },

  emits: [
    'select',
    'select-all',
    'selection-change',
    'cell-mouse-enter',
    'cell-mouse-leave',
    'cell-click',
    'cell-dblclick',
    'cell-contextmenu',
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
    const tableRef = ref<InstanceElType>()

    // 当表格列有变化，调用 doLayout 重新布局一下
    watch(() => props.items, async () => {
      await nextTick()
      tableRef.value?.doLayout()
    })

    // expose
    const exposeCtx = {
      tableRef,
    }

    function columnDefaultFormatter(ctx, column) {
      const value = ctx.cellValue
      if (column.dict) {
        for (const item of column.dict) {
          if (item.value === value) {
            if (item.tag) {
              return <ElTag {...props.tag} type={item.tag === true ? '' : item.tag} >{item.label}</ElTag>
            }
            return item.label
          }
        }
      } else {
        return value
      }
    }

    // renders
    function renderSlots(name, otherCtx?: Record<string, any>) {
      return context.slots[name]?.(reactive(
        !otherCtx
          ? exposeCtx
          : {
              ...exposeCtx,
              ...otherCtx,
            }),
      )
    }

    function renderTableColumns(items: TableItem[]) {
      return items.map((item) => {
        const slotNames = {
          column: `${tableSlotsPrefix.column}${item.key}`,
          header: `${tableSlotsPrefix.header}${item.key}`,
        }
        const slots: any = {
          default: item.children?.length ? () => renderTableColumns(item.children!) : context.slots[slotNames.column] ? ctx => renderSlots(slotNames.column, ctx) : null,
        }
        if (item.children?.length) {
          slots.default = () => renderTableColumns(item.children!)
        } else if (context.slots[slotNames.column]) {
          slots.default = ctx => renderSlots(slotNames.column, ctx)
        }

        if (context.slots[slotNames.header]) {
          slots.header = ctx => renderSlots(slotNames.header, ctx)
        }

        return (
          <ElTableColumn
            {...item.props}
            prop={item.key}
            label={item.label}
            formatter={(row, column, cellValue, index) => {
              const formatter = (item.formatter ?? props.defaultFormatter ?? columnDefaultFormatter)!
              return formatter({ row, column, cellValue, index }, item)
            }}
            v-slots={slots}
          >
          </ElTableColumn>
        )
      })
    }

    function renderSelection() {
      const { selection } = props

      if (!selection) {
        return null
      }

      return <ElTableColumn type="selection" reserve-selection={selection === 'reserve'}></ElTableColumn>
    }

    useRender(() => {
      const tableProps = {}
      tablePropKeys.forEach((key) => {
        tableProps[key] = props[key]
      })

      return (
        <ElTable
          {...tableProps}
          ref={tableRef}
        >
          {renderSelection()}
          {props.items && renderTableColumns(props.items)}
        </ElTable>
      )
    })

    return exposeCtx
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type VpTable = InstanceType<typeof VpTable>
