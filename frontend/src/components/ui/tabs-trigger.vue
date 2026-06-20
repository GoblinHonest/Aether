<template>
  <button
    :class="triggerClass"
    :data-state="isActive ? 'active' : 'inactive'"
    :data-value="props.value"
    type="button"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  class?: string
}

const props = defineProps<Props>()

const activeTab = inject<Ref<string>>('activeTab')
const setActiveTab = inject<(value: string) => void>('setActiveTab')

const isActive = computed(() => activeTab?.value === props.value)

const handleClick = () => {
  setActiveTab?.(props.value)
}

const triggerClass = computed(() => {
  return cn(
    'relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors cursor-pointer focus-visible:outline-none',
    isActive.value
      ? 'text-[#1a1a1a] dark:text-[#e5e5e5] font-medium'
      : 'text-[#999] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5]',
    props.class
  )
})
</script>
