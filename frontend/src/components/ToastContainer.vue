<template>
  <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex w-[min(448px,calc(100vw-2rem))] flex-col items-center gap-2">
    <TransitionGroup
      name="toast"
      tag="div"
      class="flex flex-col items-center gap-2"
    >
      <ToastWithProgress
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        @remove="removeToast(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import ToastWithProgress from './ToastWithProgress.vue'
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
/* 进入动画 - 从上方弹入 */
.toast-enter-active {
  transition: all 0.2s ease-out;
}

.toast-enter-from {
  transform: translateY(-12px);
  opacity: 0;
}

.toast-enter-to {
  transform: translateY(0);
  opacity: 1;
}

/* 弹出动画 - 向上消失 */
.toast-leave-active {
  transition: all 0.15s ease-in;
}

.toast-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.toast-leave-to {
  transform: translateY(-12px);
  opacity: 0;
}

/* 移动动画 */
.toast-move {
  transition: all 0.2s ease-out;
}

/* 响应式调整 */
@media (max-width: 640px) {
  div.fixed {
    top: 1rem;
    left: 1rem;
    right: 1rem;
    transform: none;
  }
}
</style>