import { onBeforeUnmount } from "vue";
import { getCurrentWindow } from ".";

const createHook =
  (hooksName: 'refreshCallback' | 'closeCallback') =>
  (hook: (next: () => void) => void, window = getCurrentWindow()) => {
    if (!window) {
      return () => null
    }

    const hooks = window[hooksName]

    hooks.push(hook)

    function removeEvent() {
      const index = hooks.indexOf(hook)
      if (index > -1) {
        hooks.splice(index, 1)
      }
    }
  
    onBeforeUnmount(() => removeEvent())
  
    return removeEvent
  }


export const onRefresh = createHook('refreshCallback')
export const onClose = createHook('closeCallback')