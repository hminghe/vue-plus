import { useAsyncState, useDebounceFn } from '@vueuse/core'
import type { ElTable } from 'element-plus'
import { cloneDeep } from 'lodash'
import type { Ref, RendererElement, RendererNode, SetupContext, VNode } from 'vue'
import { computed, inject, provide, reactive, ref, toRaw, useSlots, watch } from 'vue'

import { useProps } from '../VpConfigProvider'
import type { FormItem } from '../VpForm'
import { tableSlotsPrefix } from '../VpTable'

import type { TableProApi, VpTableProProps } from './VpTablePro'

export type SortOrder = 'ascending' | 'descending' | ''
export type SearchQuery = Record<string, any>

export type Store<Row> = ReturnType<typeof createStore<Row>>

export type ExposeStore<Row> = Omit<Store<Row>, 'onSearch' | 'onSortChange' | 'renderSlots' | 'tableRef' | 'tableSlot' | 'searchSlots'>

const rxTwoCNChar = /^[\u4E00-\u9FA5]{2}$/
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar)

const injectionKey = Symbol('VpTableProStore')

type RenderSlots = (name: string, otherCtx?: Record<string, any>) => VNode<RendererNode, RendererElement, {
  [key: string]: any
}>[] | undefined

function useTable(props: Ref<VpTableProProps>, renderSlots: RenderSlots) {
  const _tableRef = ref()
  const tableRef = computed<InstanceType<typeof ElTable>>({
    get() {
      return _tableRef.value?.tableRef
    },
    set(ref) {
      _tableRef.value = ref
    },
  })

  const tableItems = computed(() => {
    return props.value.items?.filter(item => !item.hide).map((item) => {
      item = cloneDeep(item)
      if (!item.props) {
        item.props = {}
      }
      if (item.sort) {
        item.props.sortable = 'custom'
      }

      return item
    })
  })

  const slots = useSlots()
  const tableSlots = computed(() => {
    const prefix = Object.values(tableSlotsPrefix)
    const tableSlots = {}
    Object.keys(slots).forEach((name) => {
      if (prefix.some(value => name.indexOf(value) === 0)) {
        tableSlots[name] = expose => renderSlots(name, expose)
      }
    })
    return tableSlots
  })

  return {
    tableRef,
    tableItems,
    tableSlots,
  }
}

function useSearch(props: Ref<VpTableProProps>) {
  const {
    defaultSearchQuery,
  } = props.value
  const searchQuery = ref<SearchQuery>(defaultSearchQuery ? cloneDeep(defaultSearchQuery) : {})
  const searchModel = ref<SearchQuery>(defaultSearchQuery ? cloneDeep(defaultSearchQuery) : {})

  const slotPrefix = 'item:search:'

  const searchItems = computed<FormItem[]>(() => {
    const {
      searchItems,
      items,
    } = props.value

    // 1.有传入 searchItems 优先用
    if (searchItems) {
      const itemMap = {}
      items?.forEach((item) => {
        itemMap[item.key] = item
      })

      return searchItems.map((item) => {
        return {
          ...itemMap[item.key],
          ...item,
          slot: `${slotPrefix}${item.key}`,
        }
      })
    }

    // 2.用 items 生成
    return items?.filter(item => !!item.search).map(item => ({
      key: item.key,
      label: item.label,
      dict: item.dict,
      ...(typeof item.search === 'object' ? item.search : {}),
      slot: `${slotPrefix}${item.key}`,
    })) ?? []
  })

  // 自动计算 label 宽度, TODO：这样计算应该是有问题的，迟点再改
  const searchLabelWidth = computed(() => {
    let max = 0
    searchItems.value.forEach(({ label }) => {
      let length = 0
      Array.from(label!).forEach((str) => {
        if (isTwoCNChar(str)) {
          length++
        } else {
          length += 0.5
        }
      })
      max = Math.max(max, length)
    })

    return `${max + 2.5}em`
  })

  const slots = useSlots()
  const searchSlots = computed(() => {
    const searchSlots = {}
    Object.keys(slots).forEach((name) => {
      if (name.indexOf('item:search:') === 0) {
        searchSlots[name] = slots[name]
      }
    })

    return searchSlots
  })

  return {
    searchItems,
    searchQuery,
    searchLabelWidth,
    searchModel,
    searchSlots,
  }
}

function usePagination(_props: Ref<VpTableProProps>) {
  const pagination = ref({
    pageSize: 10,
    currentPage: 1,
  })

  return {
    pagination,
  }
}

function useSort(props: Ref<VpTableProProps>) {
  const sortField = ref<string | undefined>(props.value.defaultSort?.prop)
  const sortOrder = ref<SortOrder>(props.value.defaultSort?.order || '')

  return {
    sortField,
    sortOrder,
  }
}

export function createStore<T>(props: Readonly<VpTableProProps>, context: SetupContext) {
  const emit = context.emit

  const defaultProps: Partial<VpTableProProps> = {
    apiQueryProps: {
      pageSize: 'pageSize',
      currentPage: 'currentPage',
      sortField: 'sortField',
      sortOrder: 'sortOrder',
      ascending: 'ascending',
      descending: 'descending',
    },
    searchLayout: { lg: 6, md: 8, sm: 12 },
  }

  const computedProps = useProps(props, 'tablePro', defaultProps)

  const {
    tableRef,
    tableItems,
    tableSlots,
  } = useTable(computedProps, renderSlots)

  const {
    searchItems,
    searchQuery,
    searchModel,
    searchLabelWidth,
    searchSlots,
  } = useSearch(computedProps)

  const {
    pagination,
  } = usePagination(computedProps)

  const {
    sortField,
    sortOrder,
  } = useSort(computedProps)

  const selectionRows = computed<T[]>({
    get() {
      return tableRef.value?.getSelectionRows() ?? []
    },
    set(rows) {
      tableRef.value.clearSelection()
      rows.forEach((row) => {
        tableRef.value.toggleRowSelection(row, true)
      })
    },
  })

  function clearSelection() {
    tableRef.value.clearSelection()
  }

  const { state, execute, isLoading } = useAsyncState(() => {
    // 深度复制一下，避免调用者直接修改原数据
    const query = cloneDeep(searchQuery.value)

    const { apiQueryProps } = computedProps.value

    if (apiQueryProps) {
      // 分页
      query[apiQueryProps.currentPage] = pagination.value.currentPage
      query[apiQueryProps.pageSize] = pagination.value.pageSize

      // 排序
      if (sortOrder.value) {
        query[apiQueryProps.sortField] = sortField.value
        query[apiQueryProps.sortOrder] = apiQueryProps[sortOrder.value]
      }
    }

    // TODO 考虑一下要不要处理 undefined 参数

    return computedProps.value.api!(query) as ReturnType<TableProApi<T>>
  }, { total: 0, list: [] }, { resetOnExecute: false, delay: 50 })

  const total = computed(() => state.value.total)
  const list = computed(() => state.value.list)

  const fetchData = useDebounceFn(execute, 1)

  // utils
  /**
   * 刷新接口数据
   * @param currentPage 刷新页数，不传刷新当前页面
   */
  function refresh(currentPage?: number) {
    if (currentPage) {
      // toRaw 修改直接源数据不会触发 watch
      toRaw(pagination.value).currentPage = currentPage
    }

    return fetchData()
  }

  function onSearch(query: SearchQuery) {
    searchQuery.value = cloneDeep(query)

    return refresh(1)
  }

  /**
   * 搜索
   * @param query 搜索参数
   */
  function search(query: SearchQuery) {
    searchModel.value = cloneDeep(query)

    return onSearch(query)
  }

  function onSortChange(data) {
    const { prop, order } = data
    sortField.value = prop
    sortOrder.value = order

    emit('sort-change', data)
    console.log('sort-change', data)
    return refresh(1)
  }

  /**
   * 排序
   * @param prop
   * @param order
   */
  function sort(prop: string, order: SortOrder) {
    tableRef.value.sort(prop, order ?? '')
    refresh(1)
  }

  // watch
  watch(pagination, () => refresh(), { deep: true })

  const publicStore = {
    computedProps,
    tableItems,
    searchItems,
    searchQuery,
    searchModel,
    searchLabelWidth,
    /**
     * 搜索
     * @param query 搜索参数
     */
    search,

    pagination,
    sort,
    selectionRows,
    clearSelection,
    total,
    list,

    /**
     * 刷新接口数据
     * @param currentPage 刷新页数，不传刷新当前页面
     */
    refresh,
    isLoading,
  }

  // 私有的，不对外显露
  const privateStore = {
    onSearch,
    onSortChange,
    tableRef,
    tableSlots,
    searchSlots,
  }

  function renderSlots(name: string, otherCtx?: Record<string, any>) {
    return context.slots[name]?.(reactive(
      otherCtx
        ? {
            ...publicStore,
            ...otherCtx,
          }
        : publicStore),
    )
  }

  const store = {
    ...publicStore,
    ...privateStore,
    publicStore,
    renderSlots,
  }

  provide(injectionKey, store)

  return store
}

export function useStore<Row>(): Store<Row> {
  const injectStore = inject(injectionKey, {})

  return injectStore as Store<Row>
}
