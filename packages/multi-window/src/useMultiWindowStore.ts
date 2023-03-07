import { watchOnce } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, h, markRaw, reactive, ref, watch } from 'vue'
import { type RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router'

export interface Window {
  key: string
  fullPath: string
  name: string | null
  scrollTop: number
  scrollLeft: number
  refreshKey: number
  refreshCallback: ((refresh: () => void) => void)[]
  closeCallback: ((close: () => void) => void)[]
  componentName: string
  component?: any
  baseComponent?: any
  close: (command?: string) => void
  refresh: () => void
  rename: (name: string) => void
}
// export type Window = any

export const useMultiWindowStore = defineStore('multiWindow', () => {
  const router = useRouter()
  const route = useRoute()

  const windows = reactive<Window[]>([])
  const currentWindow = computed<Window | undefined>(() => findWindowByFullPath(route.fullPath))
  const lastWindow = ref<Window>()

  watch(() => route.fullPath, () => {
    if (route.meta.multiWindow && !findWindowByFullPath(route.fullPath)) {
      createWindow(route)
    }
  }, { immediate: true })
  watch(currentWindow, (_, old) => {
    lastWindow.value = old
  })
  const keepAliveInclude = computed(() => windows.map(window => `${window.fullPath}-${window.refreshKey}`))

  function findWindow(windowOrKey: Window | string) {
    const key = typeof windowOrKey === 'string' ? windowOrKey : windowOrKey.key
    return windows.find(item => item.key === key)
  }

  function findWindowByFullPath(fullPath: string) {
    return windows.find(item => item.fullPath === fullPath)
  }

  function findWindowIndex(windowOrKey: Window | string) {
    const key = typeof windowOrKey === 'string' ? windowOrKey : windowOrKey.key
    return windows.findIndex(item => item.key === key)
  }

  function hasCurrentWindow(windowOrKey: Window | string) {
    const current = currentWindow.value
    if (!current) {
      return false
    }

    const key = typeof windowOrKey === 'string' ? windowOrKey : windowOrKey.key

    return key === current.key
  }

  function switchWindow(windowOrKey: Window | string) {
    const window = findWindow(windowOrKey)!

    if (route.fullPath !== window.fullPath) {
      router.push(window!.fullPath)
    }

    return findWindowByFullPath(window.fullPath)
  }

  function createWindowComponent(window: Window) {
    window.component = markRaw({
      name: `${window.fullPath}-${window.refreshKey}`,
      setup() {
        return () => h(window.baseComponent!)
      },
    })
  }

  function createWindow(to: RouteLocationNormalizedLoaded) {
    const {
      fullPath,
      meta,
      matched,
    } = to

    const key = `${fullPath}-${Date.now().toString()}`
    const window = reactive({
      key,
      fullPath,
      name: typeof meta.name === 'string' ? meta.name : '未设置名称',
      scrollTop: 0,
      scrollLeft: 0,
      refreshKey: 1,
      refreshCallback: [],
      closeCallback: [],
      componentName: route.name as string,
      baseComponent: markRaw(matched[matched.length - 1].components!.default),
      close(command = 'self') {
        if (command === 'self') {
          closeWindow(key)
        } else {
          closeWindowForOther(window, command)
        }
      },
      refresh() {
        refreshWindow(key)
      },
      rename(name: string) {
        windowRename(key, name)
      },
    })

    if (lastWindow.value) {
      windows.splice(findWindowIndex(lastWindow.value) + 1, 0, window)
    } else {
      windows.push(window)
    }

    // const window = windows[windows.length - 1]
    createWindowComponent(window)

    return window
  }

  function openWindow(to: RouteLocationNormalizedLoaded) {
    const window = findWindowByFullPath(to.fullPath) || createWindow(to)

    return switchWindow(window)!
  }

  async function closeWindow(windowOrKey: Window | string) {
    const window = findWindow(windowOrKey)
    if (!window) {
      return
    }

    const close = () => {
      if (hasCurrentWindow(windowOrKey)) {
        watchOnce(currentWindow, close)
        router.back()
      } else {
        windows.splice(findWindowIndex(window), 1)
      }
    }

    const runStep = (i = 0) => {
      if (window.closeCallback && window.closeCallback[i]) {
        window.closeCallback[i](() => runStep(i + 1))
      } else {
        close()
      }
    }
    runStep()
  }

  function closeWindowForOther(window = currentWindow.value, command = 'other') {
    if (!window) {
      return
    }
    if (!hasCurrentWindow(window)) {
      switchWindow(window)
    }

    const index = findWindowIndex(window)

    switch (command) {
      case 'other':
        for (let i = 0; i < windows.length; i++) {
          if (i === index) {
            continue
          }
          closeWindow(windows[i].key)
        }
        break
      case 'left':
        for (let i = 0; i < index; i++) {
          closeWindow(windows[i].key)
        }
        break
      case 'right':
        for (let i = index + 1; i < windows.length - index - 1; i++) {
          closeWindow(windows[i].key)
        }
        break
    }
  }

  function refreshWindow(windowOrKey: Window | string) {
    const window = findWindow(windowOrKey)
    if (window) {
      const runStep = (i = 0) => {
        if (window.refreshCallback && window.refreshCallback[i]) {
          window.refreshCallback[i](() => runStep(i + 1))
        } else {
          window.refreshKey++
          createWindowComponent(window)
        }
      }
      runStep()
    }
  }

  function windowRename(windowOrKey: Window | string, name: string) {
    const window = findWindow(windowOrKey)
    if (window) {
      window.name = name
    }
  }

  return {
    currentWindow,
    lastWindow,
    windows,
    keepAliveInclude,
    hasCurrentWindow,
    findWindow,
    findWindowByFullPath,
    findWindowIndex,
    switchWindow,
    createWindow,
    openWindow,
    closeWindow,
    closeWindowForOther,
    refreshWindow,
    windowRename,
  }
})

// export type   = typeof useMultiWindowStore

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMultiWindowStore, import.meta.hot))
}
