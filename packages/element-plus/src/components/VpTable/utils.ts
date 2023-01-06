import { computed } from 'vue'
import type { SimpleItem } from '../../shared'
import { createItems } from '../../shared'
import type { TableItem } from './VpTable'

function props(props: TableItem['props']) {
  return { props }
}

function dict(dict: TableItem['dict']) {
  return { dict }
}

function formatter(formatter: TableItem['formatter']) {
  return { formatter }
}

function children(
  options: TableSimpleItem[],
) {
  return {
    children: createItems(options),
  }
}

export const tableSimpleUtils = {
  props,
  dict,
  formatter,
  children,
}

export type TableSimpleItem = SimpleItem<TableItem>
type SimpleUtils = typeof tableSimpleUtils
type CreateTableItemsCallback = (simpleUtils: SimpleUtils) => TableSimpleItem[]

export function createTableItems(callback: CreateTableItemsCallback) {
  return computed(() => createItems(callback(tableSimpleUtils)))
}
