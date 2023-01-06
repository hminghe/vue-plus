import type { ExtractPropTypes, PropType } from 'vue'
import { defineComponent } from 'vue'
import type { VpTableProProps } from '../VpTablePro'
import { provideGlobalConfig } from './utils'

const props = {
  tablePro: Object as PropType<Partial<Omit<VpTableProProps, 'api' | 'items'>>>,
}

export type ConfigProviderProps = ExtractPropTypes<typeof props>

export const VpConfigProvider = defineComponent({
  name: 'VpConfigProvider',

  props,

  setup(props, { slots }) {
    provideGlobalConfig(props)
    return slots.default
  },
})
