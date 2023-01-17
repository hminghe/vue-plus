import { ref } from 'vue'

export function waitTime(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => [
      resolve(undefined),
    ], time)
  })
}

export interface ListRow {
  id: number
  date: string
  name: string
  address: string
  city: number
}

export async function mockGetList(query): Promise<{
  total: number
  list: ListRow[]
}> {
  const list: ListRow[] = []
  for (let i = (query.currentPage - 1) * query.pageSize; i < (query.currentPage - 1) * query.pageSize + query.pageSize; i++) {
    list.push({
      id: i,
      date: '2019-01-10',
      name: `${query.currentPage}-name${i}`,
      address: `address${i}`,
      city: i % 2 + 1,
    })
  }

  await waitTime(500)

  return {
    total: 999,
    list,
  }
}

