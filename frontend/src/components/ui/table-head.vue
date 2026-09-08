<script setup lang="ts">
import { cn } from '@/lib/utils'
import { computed } from 'vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

const headClass = computed(() =>
  cn(
    'sticky top-0 z-10 h-12 bg-card px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
    props.class
  )
)
</script>

<template>
  <th :class="headClass">
    <slot />
  </th>
</template>
