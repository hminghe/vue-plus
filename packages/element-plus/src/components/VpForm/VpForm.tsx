import { computed, defineComponent, reactive, ref } from 'vue'
import type { Component, PropType, Ref } from 'vue'
import { ElButton, ElCol, ElForm, ElFormItem, ElRow } from 'element-plus'
import type { FormItemProps, FormRules, RowProps } from 'element-plus'

import type { VueInstance } from '@vueuse/core'
import { useElementSize, useVModel } from '@vueuse/core'

import { isPromise } from '@vue/shared'
import { get, omit, set } from 'lodash'
import { useRender } from '../../shared'
import { initProps, useProps } from '../VpConfigProvider'
import { breakpoints } from './breakpoints'
import { input, select } from './components'

export type FormItemLayout = number | {
  span?: number
  offset?: number
  push?: number
  pull?: number
  sm?: FormItemLayout
  md?: FormItemLayout
  lg?: FormItemLayout
  xl?: FormItemLayout
}

export interface FormItem {
  key: string
  label?: string
  slot?: string
  props?: Partial<FormItemProps>
  layout?: FormItemLayout // number = col.span
  component?: Component
  componentProps?: Record<string, any>
  dict?: ({
    label: string | number
    value: unknown
  } | string | Record<string, any>)[]
}

// 如果引入 ElForm 提供的 props 类型判断有问题, TODO: 迟点找原因
const elFormProps = {
  model: Object,
  rules: Object as PropType<FormRules>,
  labelPosition: {
    type: String as PropType<'left' | 'right' | 'top'>,
    default: 'right',
  },
  requireAsteriskPosition: {
    type: String as PropType<'left' | 'right'>,
    default: 'left',
  },
  labelWidth: {
    type: [String, Number],
    default: '',
  },
  labelSuffix: {
    type: String,
    default: '',
  },
  inline: Boolean,
  inlineMessage: Boolean,
  statusIcon: Boolean,
  showMessage: {
    type: Boolean,
    default: true,
  },
  size: String as PropType<'' | 'default' | 'small' | 'large'>,
  disabled: Boolean,
  validateOnRuleChange: {
    type: Boolean,
    default: true,
  },
  hideRequiredAsterisk: {
    type: Boolean,
    default: false,
  },
  scrollToError: Boolean,
}

const formPropKeys = Object.keys(elFormProps)

const formProps = {
  ...elFormProps,

  /** @description 表单值, 可以不绑定 */
  modelValue: Object as PropType<Record<string, any>>,

  /** @description form items */
  items: {
    required: true,
    type: Array as PropType<FormItem[]>,
  },

  /**
   * @description ElRow props
   * @docs https://element-plus.org/zh-CN/component/layout.html#row-%E5%B1%9E%E6%80%A7
   * */
  row: Object as PropType<Partial<RowProps>>,

  /**
   * @description ElCol 公用 props, value = number == { span: value }
   * @docs https://element-plus.org/zh-CN/component/layout.html#col-%E5%B1%9E%E6%80%A7
   * */
  layout: Object as PropType<FormItemLayout>,

  layoutBreakpoints: {
    type: Object as PropType<Partial<typeof breakpoints>>,
    default: () => ({ ...breakpoints }),
  },

  /**
   * @description ElFormItem 公用 props
   * @docs https://element-plus.org/zh-CN/component/form.html#form-item-%E5%B1%9E%E6%80%A7
   * */
  formItem: {
    default: () => ({} as Partial<FormItemProps>),
  },

  submit: {
    type: Function as PropType<(formData: Record<string, any>) => void | Promise<unknown>>,
  },

  submitButtonText: {
    type: String,
    default: '提交',
  },

  buttonLayout: Object as PropType<FormItemLayout>,

  buttonAlign: String as PropType<'left' | 'center' | 'right'>,

  getDefaultInputComponent: {
    default: () => (item: FormItem): Component => item.dict ? select : input,
  },
}
initProps('form', formProps)

export const VpForm = defineComponent({
  name: 'VpForm',

  // inheritAttrs: false,

  props: formProps,

  emits: [
    'validate',
    'validateError',
    'update:modelValue',
  ],

  setup(_props, context) {
    const formData = ((_props.modelValue ? useVModel(_props, 'modelValue') : ref({})) as Ref<Record<string, any>>)

    const computedProps = useProps('form', _props)

    const formRef = ref<InstanceType<typeof ElForm>>()

    const isSubmitIng = ref(false)

    async function submitForm(event) {
      event.preventDefault?.()

      isSubmitIng.value = true

      if (await validateForm()) {
        const submitResult = computedProps.value.submit?.(formData.value)
        if (isPromise(submitResult)) {
          try {
            await submitResult
          } catch (error) {
            console.error(error)
          }
        }
      }

      isSubmitIng.value = false
    }

    async function validateForm() {
      try {
        await formRef.value?.validate()
        return true
      } catch (error) {
        console.error(error)
        context.emit('validateError', error)
        return false
      }
    }

    function setFormValue(value, prop) {
      set(formData.value, prop, value)
    }

    const { width: formWidth } = useElementSize(formRef as unknown as VueInstance)

    // 从大到小
    const sizeList = ['xl', 'lg', 'md', 'sm'] as const
    const currentBreakpoint = computed(() => {
      for (const size of sizeList) {
        const minSize = computedProps.value.layoutBreakpoints[size]
        if (minSize && minSize <= formWidth.value) {
          return size
        }
      }
      return null
    })

    function getColProps(layout?: FormItemLayout) {
      // const colCommonProps = typeof props.layout === 'number' ? { span: props.layout } : props.layout
      layout = layout ?? computedProps.value.layout

      const colProps: FormItemLayout = {}

      if (typeof layout === 'number') {
        colProps.span = layout
      } else if (typeof layout === 'object') {
        Object.assign(colProps, layout)
      }

      // 响应适
      if (currentBreakpoint.value) {
        const index = sizeList.indexOf(currentBreakpoint.value)
        for (let i = index; i <= sizeList.length; i++) {
          const size = sizeList[i]
          if (colProps[size]) {
            const current = colProps[size]
            if (typeof current === 'number') {
              colProps.span = current
            } else {
              Object.assign(colProps, colProps[size])
            }
            break
          }
        }
      }

      return omit(colProps, sizeList)
    }

    // expose
    const exposeCtx = {
      formRef,
      formData,
      isSubmitIng,
      submitForm,
      validateForm,
    }
    context.expose(reactive(exposeCtx))

    // renders
    function renderSlots(name, otherCtx?: Record<string, any>) {
      return context.slots[name]?.(reactive(
        !otherCtx
          ? exposeCtx
          : {
              ...exposeCtx,
              ...otherCtx,
            }),
      )
    }

    function renderFormItem(item: FormItem) {
      return (
        <ElFormItem
          {...computedProps.value.formItem}
          {...item.props}
          prop={item.key}
          key={item.key}
          label={item.label}
        >
          {renderInputComponent(item)}
        </ElFormItem>
      )
    }

    function renderInputComponent(item: FormItem) {
      const value = get(formData.value, item.key)

      const attrs = {
        ...item.componentProps,
        'dict': item.dict,
        'modelValue': value,
        'onUpdate:modelValue': value => setFormValue(value, item.key),
      }

      const slotName = item.slot ?? `item:${item.key}`
      if (context.slots[slotName]) {
        return renderSlots(slotName, {
          nativeAttrs: {
            value,
            onInput: $event => $event.target && setFormValue($event.target.value, item.key),
          },
          attrs,
          item,
          value,
        })
      }

      let inputComponent = item.component
      if (!inputComponent) {
        inputComponent = computedProps.value.getDefaultInputComponent(item)
      }

      return <inputComponent {...attrs} />
    }

    function renderContent() {
      const { inline, items } = computedProps.value
      if (inline) {
        return (
          <>
            {items?.map(item => renderFormItem(item))}
            {renderButtons()}
          </>
        )
      } else {
        return (
          <ElRow {...computedProps.value.row}>
            {items?.map((item) => {
              return (
                <ElCol
                  {...getColProps(item.layout)}
                  key={item.key}
                >
                  {renderFormItem(item)}
                </ElCol>
              )
            })}
            {renderButtons()}
          </ElRow>
        )
      }
    }

    function renderSubmitButton() {
      return (
        <ElButton
          type="primary"
          nativeType="submit"
          loading={isSubmitIng.value}
        >{ computedProps.value.submitButtonText }</ElButton>
      )
    }

    function renderButtons() {
      const { slots } = context

      // if (!props.submit && !slots['button-append']) {
      //   return null
      // }

      const buttons = slots.button
        ? renderSlots('button')
        : <>
            {computedProps.value.submit && renderSubmitButton()}
            {renderSlots('button-append')}
          </>

      if (computedProps.value.inline) {
        return <ElFormItem>{buttons}</ElFormItem>
      }

      return (
        <ElCol
          { ...getColProps(computedProps.value.buttonLayout) }
          style={{
            textAlign: computedProps.value.buttonAlign,
            marginLeft: computedProps.value.buttonAlign ? null : computedProps.value.labelWidth,
          }}
        >{ buttons }</ElCol>
      )
    }

    useRender(() => {
      const formProps = {
        scrollToError: true,
        validateOnRuleChange: false,
      }
      formPropKeys.forEach((key) => {
        formProps[key] = computedProps.value[key]
      })

      return (
        <ElForm
          {...formProps}
          onValidate={(...args) => context.emit('validate', ...args)}
          disabled={computedProps.value.disabled || isSubmitIng.value}
          ref={formRef}
          model={formData.value}
          onSubmit={event => submitForm(event)}
        >
          {renderContent()}
        </ElForm>
      )
    })

    return {
      formRef,
      formData,
      isSubmitIng,
      currentBreakpoint,
      submitForm,
      validateForm,
    }
  },
})

// export type VpForm = InstanceType<typeof VpForm>
