<template>
  <div
    role="alert"
    class="relative flex w-full items-start gap-2 overflow-hidden rounded bg-white px-4 py-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.08)] max-w-md dark:bg-[#232324] dark:shadow-[0_4px_16px_rgba(0,0,0,0.45)]"
  >
    <!-- 图标 -->
    <component
      :is="icon"
      class="mt-0.5 h-4 w-4 shrink-0"
      :class="iconClasses"
    />

    <!-- 内容 -->
    <div class="flex-1 min-w-0">
      <p
        v-if="toast.title"
        class="text-sm font-medium text-[#1d2129] dark:text-[#f6f6f6]"
      >
        {{ toast.title }}
      </p>
      <p
        v-if="toast.message"
        class="mt-0.5 break-words text-xs leading-5 text-[#4e5969] dark:text-[#ababac]"
      >
        {{ toast.message }}
      </p>
    </div>

    <!-- 关闭按钮 -->
    <button
      class="shrink-0 rounded p-0.5 text-[#c9cdd4] transition-colors hover:bg-[#f2f3f5] hover:text-[#4e5969] dark:text-[#6b7785] dark:hover:bg-[#2a2a2b] dark:hover:text-[#ababac]"
      type="button"
      aria-label="关闭"
      @click="$emit('remove')"
    >
      <X class="h-3.5 w-3.5" />
    </button>

    <!-- 底部倒计时进度线 -->
    <div
      v-if="toast.duration && toast.duration > 0"
      class="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden"
    >
      <div
        class="h-full transition-[width] duration-75 ease-linear"
        :style="{ width: progress + '%' }"
        :class="progressColorClasses"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { IconCheckCircle as CheckCircle2, IconCloseCircle as XCircle, IconExclamationCircle as AlertTriangle, IconInfo as Info, IconClose as X } from '@arco-design/web-vue/es/icon'

interface Toast {
  id: string
  title?: string
  message?: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const props = defineProps<{
  toast: Toast
}>()

const emit = defineEmits<{
  remove: []
}>()

const progress = ref(100)
let startTime = 0
let rafId: number | null = null
let timeoutId: ReturnType<typeof setTimeout> | null = null

const updateProgress = () => {
  if (!props.toast.duration || props.toast.duration <= 0) return

  const elapsed = Date.now() - startTime
  const remaining = Math.max(0, 100 - (elapsed / props.toast.duration) * 100)

  progress.value = remaining

  if (remaining <= 0) {
    emit('remove')
  } else {
    rafId = requestAnimationFrame(updateProgress)
  }
}

onMounted(() => {
  if (props.toast.duration && props.toast.duration > 0) {
    startTime = Date.now()
    rafId = requestAnimationFrame(updateProgress)
    // 保底 timeout，确保即使在后台也能移除
    timeoutId = setTimeout(() => {
      emit('remove')
    }, props.toast.duration + 100)
  }
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (timeoutId) clearTimeout(timeoutId)
})

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
}

const icon = computed(() => icons[props.toast.variant || 'info'])

const iconClasses = computed(() => {
  const variant = props.toast.variant || 'info'
  const classes: Record<string, string> = {
    success: 'text-[#00b42a] dark:text-[#9fdb1d]',
    error: 'text-[#f53f3f] dark:text-[#f76965]',
    warning: 'text-[#ff7d00] dark:text-[#ff9a2e]',
    info: 'text-[#165dff] dark:text-[#4080ff]'
  }
  return classes[variant]
})

const progressColorClasses = computed(() => {
  const variant = props.toast.variant || 'info'
  const classes: Record<string, string> = {
    success: 'bg-[#00b42a] dark:bg-[#9fdb1d]',
    error: 'bg-[#f53f3f] dark:bg-[#f76965]',
    warning: 'bg-[#ff7d00] dark:bg-[#ff9a2e]',
    info: 'bg-[#165dff] dark:bg-[#4080ff]'
  }
  return classes[variant]
})
</script>