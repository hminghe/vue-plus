import { h } from 'vue'

export function createWarpComponent<T extends new (...args: any) => any>(
  component: T,
  defaultProps: InstanceType<T>['$props'] & Record<string, unknown>,
) {
  return {
    name: component.name ? `${component.name}Wrap` : 'WarpComponent',
    render() {
      return h(component, defaultProps)
    },
  } as unknown as T
}
