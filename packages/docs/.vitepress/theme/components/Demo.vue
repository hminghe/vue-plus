<script setup lang="ts">
import { useClipboard, useToggle } from '@vueuse/core'
import { CaretTop } from '@element-plus/icons-vue'

import DemoExample from './DemoExample.vue'
import DemoSourceCode from './DemoSourceCode.vue'

const props = defineProps<{
  demo: object
  source: string
}>()

// const vm = getCurrentInstance()!

const { copy, isSupported } = useClipboard({
  source: decodeURIComponent(props.source),
  read: false,
})

const [sourceVisible, toggleSourceVisible] = useToggle()

const copyCode = async () => {
  await copy()
}
</script>

<template>
  <ClientOnly>
    <!-- danger here DO NOT USE INLINE SCRIPT TAG -->
    <!-- <p text="sm" v-html="decodedDescription" /> -->

    <div class="example">
      <DemoExample :demo="demo" />

      <ElDivider class="!m-0" />

      <div class="op-btns">
        <!-- <ElTooltip :content="locale['edit-in-editor']" :show-arrow="false">
          <ElIcon :size="16" class="op-btn">
            <i-ri-flask-line @click="onPlaygroundClick" />
          </ElIcon>
        </ElTooltip>
        <ElTooltip :content="locale['edit-on-github']" :show-arrow="false">
          <ElIcon
            :size="16"
            class="op-btn github"
            style="color: var(--text-color-light)"
          >
            <a :href="demoSourceUrl" rel="noreferrer noopener" target="_blank">
              <i-ri-github-line />
            </a>
          </ElIcon>
        </ElTooltip>
        <ElTooltip :content="locale['copy-code']" :show-arrow="false">
          <ElIcon :size="16" class="op-btn" @click="copyCode">
            <i-ri-file-copy-line />
          </ElIcon>
        </ElTooltip> -->

        <ElLink @click="toggleSourceVisible()">
          查看源代码
        </ElLink>
      </div>

      <ElCollapseTransition>
        <DemoSourceCode v-show="sourceVisible" :source="source" />
      </ElCollapseTransition>

      <Transition name="el-fade-in-linear">
        <div
          v-show="sourceVisible"
          class="example-float-control"
          @click="toggleSourceVisible(false)"
        >
          <ElIcon :size="16">
            <CaretTop />
          </ElIcon>
          <span>查看源代码</span>
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
.example {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);

  .op-btns {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 2.5rem;

    .el-icon {
      &:hover {
        color: var(--text-color);
      }
    }

    .op-btn {
      margin: 0 0.5rem;
      cursor: pointer;
      color: var(--text-color-lighter);
      transition: 0.2s;

      &.github a {
        transition: 0.2s;
        color: var(--text-color-lighter);

        &:hover {
          color: var(--text-color);
        }
      }
    }
  }

  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--border-color);
    height: 44px;
    box-sizing: border-box;
    background-color: var(--bg-color, #fff);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    span {
      font-size: 14px;
      margin-left: 10px;
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
