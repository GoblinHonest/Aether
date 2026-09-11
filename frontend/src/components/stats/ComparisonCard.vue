<template>
  <Card class="p-4 space-y-2">
    <div class="text-xs text-muted-foreground">
      {{ label }}
    </div>
    <div class="text-lg font-semibold">
      {{ value }}
    </div>
    <div
      class="text-xs"
      :class="changeClass"
    >
      <span v-if="changePercent !== null">{{ changePercent }}%</span>
      <span v-else>--</span>
      <span class="ml-1 text-muted-foreground">vs 对比期</span>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '@/components/ui'

interface Props {
  label: string
  value: string
  changePercent: number | null
}

const props = defineProps<Props>()

const changeClass = computed(() => {
  if (props.changePercent === null) return 'text-muted-foreground'
  if (props.changePercent > 0) return 'text-[#00b42a]'
  if (props.changePercent < 0) return 'text-[#f53f3f]'
  return 'text-muted-foreground'
})
</script>
