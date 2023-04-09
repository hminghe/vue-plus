/* eslint-disable vue/one-component-per-file */

import { defineComponent, h } from 'vue'
import {
  ElCascader,
  ElCheckbox,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElTreeSelect,
} from 'element-plus'
import { createWarpComponent } from '../../shared'
import type { FormItem } from './VpForm'
import { createRelationComponent } from './utils'

type TypeElCascader = typeof ElCascader
// type TypeElCheckbox = typeof ElCheckbox
type TypeElCheckboxGroup = typeof ElCheckboxGroup
type TypeElColorPicker = typeof ElColorPicker
type TypeElDatePicker = typeof ElDatePicker
type TypeElInput = typeof ElInput
type TypeElInputNumber = typeof ElInputNumber
// type TypeElOption = typeof ElOption
// type TypeElRadio = typeof ElRadio
type TypeElRadioGroup = typeof ElRadioGroup
type TypeElRate = typeof ElRate
type TypeElSelect = typeof ElSelect
type TypeElSlider = typeof ElSlider
type TypeElSwitch = typeof ElSwitch
type TypeElTimePicker = typeof ElTimePicker
type TypeElTimeSelect = typeof ElTimeSelect
type TypeElTransfer = typeof ElTransfer
type TypeElTreeSelect = typeof ElTreeSelect

const input: TypeElInput = ElInput

const password: TypeElInput = createWarpComponent(ElInput, {
  type: 'password',
  placeholder: '请输入密码',
})

const textarea: TypeElInput = createWarpComponent(ElInput, {
  type: 'textarea',
  rows: 5,
})

const select: TypeElSelect = createWarpComponent(createRelationComponent(ElSelect, ElOption), { clearable: true })

const selectMultiple: TypeElSelect = createWarpComponent(select, { multiple: true, style: { width: '100%' } })

const checkbox: TypeElCheckboxGroup = createRelationComponent(ElCheckboxGroup, ElCheckbox, { label: 'value', innerText: 'label' })

const radio: TypeElRadioGroup = createRelationComponent(ElRadioGroup, ElRadio, { label: 'value', innerText: 'label' })

const rate: TypeElRate = ElRate

const date: TypeElDatePicker = ElDatePicker

const dateRange: TypeElDatePicker = createWarpComponent(date, {
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
  type: 'daterange',
})
const dateTime: TypeElDatePicker = createWarpComponent(date, {
  type: 'datetime',
  placeholder: '请选择',
  valueFormat: 'YYYY-MM-DD HH:mm:ss',
})
const dateTimeRange: TypeElDatePicker = createWarpComponent(date, {
  type: 'datetimerange',
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
})

const time: TypeElTimePicker = ElTimePicker
const timeSelect: TypeElTimeSelect = ElTimeSelect

const number: TypeElInputNumber = ElInputNumber
const cascader: TypeElCascader = ElCascader
const color: TypeElColorPicker = ElColorPicker
const slider: TypeElSlider = ElSlider

const treeSelect: TypeElTreeSelect = defineComponent({
  name: 'TreeSelectWrap',
  setup(_, { attrs }) {
    const { dict, ...props } = attrs
    props.data = dict
    return () => h(ElTreeSelect, props)
  },
}) as unknown as TypeElTreeSelect

const transfer: TypeElTransfer = defineComponent({
  name: 'TransferWrap',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { dict, ...props } = attrs
    props.data = (dict as FormItem['dict'])!.map(option => ({
      key: typeof option === 'string' ? option : option.value,
      label: typeof option === 'string' ? option : option.label,
    }))
    return () => h(ElTransfer, props)
  },
}) as unknown as TypeElTransfer

const _switch: TypeElSwitch = createWarpComponent(ElSwitch, {
  activeText: '是',
  inactiveText: '否',
  activeValue: 1,
  inactiveValue: 0,
  inlinePrompt: true,
})

export const formComponents: {
  input: typeof input
  password: typeof password
  textarea: typeof textarea
  select: typeof select
  selectMultiple: typeof selectMultiple
  checkbox: typeof checkbox
  radio: typeof radio
  rate: typeof rate
  date: typeof date
  dateRange: typeof dateRange
  dateTime: typeof dateTime
  dateTimeRange: typeof dateTimeRange
  time: typeof time
  timeSelect: typeof timeSelect
  number: typeof number
  cascader: typeof cascader
  color: typeof color
  slider: typeof slider
  switch: typeof _switch
  treeSelect: typeof treeSelect
  transfer: typeof transfer
} = {
  input,
  password,
  textarea,
  select,
  selectMultiple,
  checkbox,
  radio,
  rate,
  date,
  dateRange,
  dateTime,
  dateTimeRange,
  time,
  timeSelect,
  number,
  cascader,
  color,
  slider,
  switch: _switch,
  treeSelect,
  transfer,
}
