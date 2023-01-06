import type { MaybeRef } from '@vueuse/core'
import type { InjectionKey, Ref } from 'vue'
import { computed, inject, provide, ref, unref } from 'vue'

import type { ConfigProviderProps } from './VpConfigProvider'

const provideKey: InjectionKey<Ref<ConfigProviderProps>> = Symbol('VpConfigProvider')

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

export function useProps<T extends object>(
  props: T,
  name: string,
  defaultProps: Partial<T> = {},
) {
  const globalConfig = useGlobalConfig()

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

  return computed<T>(() => {
    const currentContext = unref(globalConfig)[name]
    return {
      ...defaultProps,
      ...removeUndefined(currentContext),
      ...removeUndefined(props),
    }
  })

  // return new Proxy<T>(props, {
  //   get(props, key) {
  //     if (props[key] !== undefined) {
  //       return props[key]
  //     }

  //     const currentContext = unref(context)[name]
  //     if (currentContext && currentContext[key]) {
  //       return currentContext[key]
  //     }

  //     return defaultProps[key]
  //   },
  // })
}
