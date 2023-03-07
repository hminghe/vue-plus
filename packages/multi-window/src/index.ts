import type { Window } from './useMultiWindowStore'
import { useMultiWindowStore } from './useMultiWindowStore'
import MultiWindowKeepAlive from './components/MultiWindowKeepAlive.vue'
import MultiWindowRouter from './components/MultiWindowRouter.vue'

export * from './setupMultiWindow'
export * from './useMultiWindowStore'
export * from './apiLifecycle'

export {
  MultiWindowRouter,
  MultiWindowKeepAlive,
}

export function getCurrentWindow(): Window {
  const store = useMultiWindowStore()
  return store.currentWindow!
}
