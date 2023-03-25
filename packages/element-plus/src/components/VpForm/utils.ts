import { isPromise } from '@vue/shared'

import type { FormItemProps, FormItemRule } from 'element-plus'
import type { VNode } from 'vue'
import { computed, defineComponent, h } from 'vue'
import type { SimpleItem } from '../../shared'
import { createItems } from '../../shared'

import * as formComponents from './components'
import type { FormItem } from '.'

export function createRelationComponent<T>(Parent: T, Children, set?: {
  value?: string
  label?: string
  innerText?: string
}) {
  const { value, label, innerText } = {
    value: 'value',
    label: 'label',
    innerText: 'innerText',
    ...set,
  }

  const getOptionValue = (prop, option) => {
    if (typeof option === 'string') {
      return option
    }
    return option[prop]
  }

  return defineComponent((_props, { attrs }) => {
    return () => {
      const { dict = [], ...props } = attrs
      return h(
        Parent as any,
        props,
        () => (dict as any[]).map((option) => {
          const props = {
            value: getOptionValue(value, option),
            label: getOptionValue(label, option),
          }

          return h(Children, props, () => getOptionValue(innerText, option))
        }),
      )
    }
  }) as T
}

function component(key: keyof typeof formComponents, props?: Record<string, unknown>): { component: VNode }
function component<T extends new (...args: any) => any>(component: T, props?: Partial<InstanceType<T>['$props']> & Record<string, unknown>): { component: T }
function component(keyOrComponent, props?) {
  const component = typeof keyOrComponent === 'string' ? formComponents[keyOrComponent] : keyOrComponent
  return {
    component,
    componentProps: props,
  }
}

const simpleUtils = {
  layout(layout: FormItem['layout']) {
    return {
      layout,
    }
  },

  dict(dict: FormItem['dict']) {
    return {
      dict,
    }
  },

  props(props: FormItem['props']) {
    return {
      props,
    }
  },

  slot(slot: FormItem['slot']) {
    return {
      slot,
    }
  },

  rules(rules: FormItemProps['rules']) {
    return simpleUtils.props({
      rules,
    })
  },

  required(messageOrValidator: string | FormItemRule['validator']) {
    return simpleUtils.rules({
      required: true,
      message: typeof messageOrValidator === 'string' ? messageOrValidator : undefined,
      validator: typeof messageOrValidator === 'function' && !isPromise(messageOrValidator) ? messageOrValidator : undefined,
    })
  },

  component,
}

export type FormSimpleItem = SimpleItem<FormItem>
type SimpleUtils = typeof simpleUtils
type CreateFormItemsCallback = (simpleUtils: SimpleUtils) => FormSimpleItem[]

export function createFormItems(callback: CreateFormItemsCallback) {
  return computed(() => createItems(callback(simpleUtils)))
}
