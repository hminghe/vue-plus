import type { UnwrapNestedRefs } from 'vue'
import { computed, reactive, ref, watchEffect } from 'vue'

import { omit } from 'lodash'
import type { SimpleItem } from '../../shared'
import { createItems } from '../../shared'
import type { FormItem } from '../VpForm'
import type { TableProItem } from './VpTablePro'
import { createTablePro } from './VpTablePro'
import type { ExposeStore } from './store'
import type { Utils } from './utils'
import { utils } from './utils'

let currentContext: {
  items: TableProItem[]
  searchItems?: FormItem[]
}

type CurrentContext = typeof currentContext

function initCurrentContext(): CurrentContext {
  return reactive({
    items: [],
    searchItems: undefined,
  })
}

function setCurrentContext(context) {
  currentContext = context
}

export function defineItems(items: SimpleItem<TableProItem>[]) {
  currentContext.items = createItems(items)
}

export function defineSearchItems(searchItems: SimpleItem<TableProItem>[]) {
  // TableProItem 转 FormItem
  const items = createItems(searchItems)
  currentContext.searchItems = items.map((item) => {
    const baseItem = omit(item, ['search'])
    return {
      ...baseItem,
      ...(typeof item.search === 'object' ? item.search : {}),
    }
  })
}

export type DefineTableProSetup = (utils: Utils) => void
export function defineTablePro<Row>(setup: DefineTableProSetup) {
  const context = initCurrentContext()

  watchEffect(() => {
    setCurrentContext(context)
    setup(utils)
    setCurrentContext(null)
  })

  const items = computed(() => context.items)
  const searchItems = computed(() => context.searchItems)

  const VpTablePro = createTablePro<Row>()

  const table = ref<UnwrapNestedRefs<ExposeStore<Row>>>()

  const VpTableProWarp = {
    name: 'VpTableProWarp',
    setup(_, ctx) {
      return () => <VpTablePro
        ref={table}
        items={items.value}
        searchItems={searchItems.value}
        api={async () => ({ total: 0, list: [] })}
      >
        {{ ...ctx.slots }}
      </VpTablePro>
    },
  } as unknown as typeof VpTablePro

  return {
    VpTablePro: VpTableProWarp,
    table,
  }
}
