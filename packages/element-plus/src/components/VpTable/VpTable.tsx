import { defineComponent, nextTick, reactive, ref, watch } from 'vue'
import type { ExtractPropTypes, PropType, VNode } from 'vue'

import type { TagProps } from 'element-plus'
import { ElTable, ElTableColumn, ElTag } from 'element-plus'

import tableProps from 'element-plus/es/components/table/src/table/defaults'
import type elTableColumnProps from 'element-plus/es/components/table/src/table-column/defaults'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { useRender } from '../../shared'
import { useProps } from '../VpConfigProvider'

type ElTableColumnProps = ExtractPropTypes<typeof elTableColumnProps>

export const tableSlotsPrefix = {
  column: 'item:',
  header: 'item:header:',
}

export interface TableItemFormatterCtx {
  row: any
  column: TableColumnCtx<any>
  cellValue
  index: number
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
    elCtx: TableItemFormatterCtx,
    tableColumn: TableItem,
  ) => VNode | string
}

const tablePropKeys = Object.keys(tableProps)

export const vpTableProps = {
  ...tableProps,

  selection: [Boolean, String] as PropType<Boolean | 'reserve'>,

  /** @description table items */
  items: {
    required: true,
    type: Array as PropType<TableItem[]>,
  },

  tag: {
    type: Object as PropType<Partial<TagProps>>,
  },

  defaultFormatter: {
    type: Function as PropType<TableItem['formatter']>,
  },
}

export type VpTableProps = ExtractPropTypes<typeof vpTableProps>

const vpTableDefaultProps: Record<string, any> = {}

Object.keys(vpTableProps).forEach((key) => {
  const item = vpTableProps[key]

  // 获取 props default 的value
  if (item.default) {
    vpTableDefaultProps[key] = item.default
  }

  // Boolean 类型的会默认自动设置为 false，所以加个 default = undefined
  if (item === Boolean || item.type === Boolean) {
    tableProps[key] = {
      type: Boolean,
      default: () => undefined,
    }
  }
})

// elTable 的事件，手动穿透
const emits = [
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
]

export const VpTable = defineComponent({
  name: 'VpTable',

  // inheritAttrs: false,

  props: vpTableProps,

  emits,

  setup(_props, context) {
    const tableRef = ref<InstanceType<typeof ElTable>>()

    const computedProps = useProps(_props, 'table', vpTableDefaultProps)

    // 当表格列有变化，调用 doLayout 重新布局一下
    watch(() => computedProps.value.items, async () => {
      await nextTick()
      tableRef.value?.doLayout()
    })

    // 事件穿透
    const emitAttrs: Record<string, (...args: any[]) => any> = {}
    emits.forEach((name) => {
      emitAttrs[`on${name.slice(0, 1).toUpperCase()}${name.slice(1)}`] = (...args) => context.emit(name, ...args)
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
            if (item.tag || item.tag === '') {
              return <ElTag {...computedProps.value.tag} type={item.tag === true ? '' : item.tag} >{item.label}</ElTag>
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
              const ctx = { row, column, cellValue, index }
              const formatter = (item.formatter ?? computedProps.value.defaultFormatter ?? columnDefaultFormatter)
              return formatter(ctx, item) ?? columnDefaultFormatter(ctx, item)
            }}
            v-slots={slots}
          >
          </ElTableColumn>
        )
      })
    }

    function renderSelection() {
      const { selection } = computedProps.value

      if (!selection) {
        return null
      }

      return <ElTableColumn type="selection" reserve-selection={selection === 'reserve'}></ElTableColumn>
    }

    useRender(() => {
      const tableProps = {}
      tablePropKeys.forEach((key) => {
        tableProps[key] = computedProps.value[key]
      })

      return (
        <ElTable
          {...tableProps}
          {...emitAttrs}
          ref={tableRef}
        >
          {renderSelection()}
          {computedProps.value.items && renderTableColumns(computedProps.value.items)}
        </ElTable>
      )
    })

    return exposeCtx
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type VpTable = InstanceType<typeof VpTable>
