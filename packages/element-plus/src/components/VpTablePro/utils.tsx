import type { Component } from 'vue'

import { tableSimpleUtils } from '../VpTable'
import { dateRange, dateTimeRange, selectMultiple } from '../VpForm'
import type { TableProItem } from './VpTablePro'

export const utils = {
  ...tableSimpleUtils,

  sort(sort: TableProItem['sort'] = true) {
    return {
      sort,
    }
  },

  search(search: TableProItem['search'] = true) {
    return {
      search,
    }
  },

  searchComponent(component: Component, search?: TableProItem['search']) {
    if (search === false) {
      return {}
    } else {
      search = typeof search === 'object' ? search : {}

      return utils.search({
        ...search,
        component,
      })
    }
  },

  /**
   * 多选搜索
   * @param search 搜索配置
   * @returns
   */
  searchMultiple(search?: TableProItem['search']) {
    return utils.searchComponent(selectMultiple, search)
  },

  /**
   * 日期搜索
   * @param search 搜索配置
   * @returns
   */
  searchDate(search?: TableProItem['search']) {
    return utils.searchComponent(dateRange, search)
  },

  /**
   * 日期时间搜索
   * @param search 搜索配置
   * @returns
   */
  searchDateTime(search?: TableProItem['search']) {
    return utils.searchComponent(dateTimeRange, search)
  },
}

export type Utils = typeof utils

