import { ElButton } from 'element-plus'
import { defineComponent } from 'vue'
import { VpForm } from '../VpForm'
import { useStore } from './store'

export const VpTableProSearch = defineComponent({
  setup() {
    const {
      computedProps,
      searchSlots,

      searchModel,
      searchItems,
      searchLabelWidth,
      onSearch,

      isLoading,
    } = useStore()

    return () => {
      const layout = computedProps.value.searchLayout!

      const buttonLayout = {}
      Object.keys(layout).forEach((size) => {
        const span = layout[size]
        buttonLayout[size] = 24 - (searchItems.value.length % (24 / span)) * span
      })

      return (
          <VpForm
            modelValue={searchModel.value}
            items={searchItems.value}
            labelWidth={searchLabelWidth.value}
            layout={layout}
            buttonLayout={buttonLayout}
            buttonAlign="right"
            submit={onSearch}
            onUpdate:modelValue={value => searchModel.value = value}
          >{{
            ...searchSlots.value,
            button: ({ formRef }) => (
              <>
                <ElButton
                  type="primary"
                  nativeType="submit"
                  loading={isLoading.value}
                >查询</ElButton>
                <ElButton onClick={() => formRef.resetFields()}>重置</ElButton>
              </>
            ),
          }}</VpForm>
      )
    }
  },
})
