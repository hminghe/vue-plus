import { mergeProps } from 'vue'

export type SimpleItem<Item> = [key: string, label: string, ...options: Partial<Item>[]]
| [key: string, ...options: Partial<Item>[]]
| Item
| false

export function createItems<Item>(options: SimpleItem<Item>[]) {
  const items: Item[] = []
  options.forEach((item) => {
    if (Array.isArray(item)) {
      const [key, label, ...options] = item

      const labelOrOption = (typeof label === 'string' ? { label } : label) as Partial<Item>

      items.push(mergeProps({ key }, labelOrOption, ...options) as unknown as Item)
    } else if (item) {
      items.push(item)
    }
  })
  return items
}
