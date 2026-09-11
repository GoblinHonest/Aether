<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 overflow-hidden pointer-events-none"
      :style="{ zIndex: containerZIndex }"
    >
      <!-- 背景遮罩 -->
      <Transition
        enter-active-class="duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          class="fixed inset-0 bg-[#1d2129]/60 transition-opacity pointer-events-auto"
          :style="{ zIndex: backdropZIndex }"
          @click="handleBackdropClick"
        />
      </Transition>

      <div class="relative flex h-full items-end justify-center overflow-hidden text-center sm:items-center sm:p-0 pointer-events-none">
        <!-- 对话框内容 -->
        <Transition
          enter-active-class="duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2 scale-95 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-2 scale-95 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="isOpen"
            class="relative flex max-h-[100dvh] w-full transform flex-col overflow-hidden rounded-t bg-background text-left shadow-[0_4px_16px_rgba(29,33,41,0.12)] transition-all pointer-events-auto sm:my-8 sm:w-full sm:max-h-[calc(100dvh-4rem)] sm:rounded dark:shadow-[0_8px_24px_rgba(0,0,0,0.55)]"
            :style="{ zIndex: contentZIndex }"
            :class="maxWidthClass"
            @click.stop
          >
            <!-- Header 区域：优先使用 slot，否则使用 title prop -->
            <slot name="header">
              <div
                v-if="title"
                class="relative shrink-0 px-5 pb-3 pt-4"
              >
                <div class="flex items-center gap-3">
                  <div
                    v-if="icon"
                    class="flex h-8 w-8 items-center justify-center rounded bg-[#e8f3ff] flex-shrink-0 dark:bg-[#0e1d33]"
                    :class="iconClass"
                  >
                    <component
                      :is="icon"
                      class="h-4 w-4 text-[#165dff] dark:text-[#4080ff]"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="break-words text-balance text-base font-medium leading-tight text-foreground">
                      {{ title }}
                    </h3>
                    <p
                      v-if="description"
                      class="mt-1 break-words text-pretty text-xs leading-4 text-muted-foreground"
                    >
                      {{ description }}
                    </p>
                  </div>
                  <slot name="header-actions" />
                  <button
                    v-if="!persistent"
                    type="button"
                    class="-mr-2 flex h-7 w-7 shrink-0 items-center justify-center self-start rounded text-[#86909c] transition-colors hover:bg-[#f2f3f5] hover:text-[#4e5969] dark:text-[#929293] dark:hover:bg-[#2a2a2b]"
                    aria-label="Close"
                    @click="handleClose"
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </slot>

            <!-- 内容区域：可选添加 padding -->
            <div :class="contentBodyClass">
              <slot />
            </div>

            <!-- Footer 区域：如果有 footer 插槽，自动添加样式 -->
            <div
              v-if="slots.footer"
              class="flex shrink-0 flex-col-reverse items-stretch gap-3 px-5 pb-5 pt-1 [&>button]:min-h-min [&>button]:w-full [&>button]:whitespace-normal [&>button]:py-2 sm:flex-row-reverse sm:flex-wrap sm:items-center [&>button]:w-auto"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, provide, useSlots, type Component } from 'vue'
import { IconClose as X } from '@arco-design/web-vue/es/icon'
import { useEscapeKey } from '@/composables/useEscapeKey'
import { DIALOG_CONTEXT_KEY } from './context'

// Props 定义
const props = defineProps<{
  open?: boolean
  modelValue?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  title?: string
  description?: string
  icon?: Component // Lucide icon component
  iconClass?: string // Custom icon color class
  zIndex?: number // Custom z-index for nested dialogs (default: 60)
  noPadding?: boolean // Disable default content padding
  persistent?: boolean // Prevent closing on backdrop click
  closeOnBackdrop?: boolean // Allow closing on backdrop click (default: true)
}>()

// Emits 定义
const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: boolean]
}>()

provide(DIALOG_CONTEXT_KEY, true)

// 获取 slots 以便在模板中使用
const slots = useSlots()

// 统一处理 open 状态
const isOpen = computed(() => {
  if (props.modelValue === true) {
    return true
  }
  if (props.open === true) {
    return true
  }
  return false
})

// 统一处理关闭事件
function handleClose() {
  if (props.open !== undefined) {
    emit('update:open', false)
  }
  if (props.modelValue !== undefined) {
    emit('update:modelValue', false)
  }
}

// 处理背景点击
function handleBackdropClick() {
  if (!props.persistent && props.closeOnBackdrop !== false) {
    handleClose()
  }
}

const maxWidthClass = computed(() => {
  const sizeValue = props.maxWidth || props.size || 'md'
  const sizes = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl',
    '6xl': 'sm:max-w-6xl',
    '7xl': 'sm:max-w-7xl'
  }
  return sizes[sizeValue]
})

const contentBodyClass = computed(() => [
  'min-h-0 min-w-0 overflow-y-auto overscroll-contain',
  props.noPadding ? '' : 'px-5 py-5',
].filter(Boolean).join(' '))

// Z-index computed values for nested dialogs support
const containerZIndex = computed(() => props.zIndex || 60)
const backdropZIndex = computed(() => props.zIndex || 60)
const contentZIndex = computed(() => (props.zIndex || 60) + 10)

// 添加 ESC 键监听
useEscapeKey(() => {
  if (isOpen.value && !props.persistent) {
    handleClose()
    return true  // 阻止其他监听器（如父级抽屉的 ESC 监听器）
  }
  return false
}, {
  disableOnInput: true,
  once: false
})
</script>
