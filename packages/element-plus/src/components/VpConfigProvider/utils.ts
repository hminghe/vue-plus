import type { MaybeRef } from '@vueuse/core'
import type { InjectionKey, Ref } from 'vue'
import { computed, inject, provide, ref, unref } from 'vue'

import type { ConfigProviderProps } from './VpConfigProvider'

const provideKey: InjectionKey<Ref<ConfigProviderProps>> = Symbol('VpConfigProvider')

function removeUndefined<T extends object>(obj: T): Partial<T> {
  const newObj = {}
  if (obj) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== undefined) {
        newObj[key] = obj[key]
      }
    })
  }
  return newObj
}

export function useGlobalConfig() {
  return inject(provideKey, ref({}))
}

export function provideGlobalConfig(config: MaybeRef<ConfigProviderProps>) {
  // 继承上级的config
  const configs = [useGlobalConfig(), config]

  provide(provideKey, computed(() => {
    const computedContext = {}
    configs.forEach((context) => {
      if (context) {
        const unrefContext = unref(context)
        Object.keys(unrefContext).forEach((key) => {
          computedContext[key] = unrefContext[key]
        })
      }
    })
    return computedContext
  }))
}

const defaultPropsMap: Record<string, Record<string, any>> = {}

export function useProps<T extends Record<string, any>>(
  name: string,
  props: T,
) {
  const globalConfig = useGlobalConfig()

  const defaultProps = defaultPropsMap[name] || {}

  const _defaultProps: Record<string, any> = {}
  Object.keys(defaultProps).forEach((key) => {
    const value = defaultProps[key]
    _defaultProps[key] = typeof value === 'function' ? value() : value
  })

  return computed<T>(() => {
    const currentContext = unref(globalConfig)[name]
    return {
      ..._defaultProps,
      ...removeUndefined(currentContext),
      ...removeUndefined(props),
    }
  })
}

export function initProps(name, props) {
  defaultPropsMap[name] = {}

  Object.keys(props).forEach((key) => {
    const item = props[key]
    // 获取 props default 的value
    if (item?.default) {
      defaultPropsMap[name][key] = item.default
      delete item.default
    }

    // Boolean 类型的会默认自动设置为 false，所以加个 default = undefined
    if (item === Boolean || item.type === Boolean) {
      props[key] = {
        type: Boolean,
        default: () => undefined,
      }
    }
  })
}
