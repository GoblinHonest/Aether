<template>
  <button
    :type="props.type"
    :class="buttonClass"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { ClassValue } from 'clsx'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  class?: ClassValue
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  class: undefined,
  type: 'button'
})

const buttonClass = computed(() => {
  const baseClass =
    'inline-flex min-w-0 max-w-full items-center justify-center rounded-md text-[13px] font-medium leading-5 [overflow-wrap:anywhere] [&_svg]:shrink-0 transition-colors duration-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/85',
    outline:
      'border border-border/60 bg-card/60 text-foreground hover:border-primary/60 hover:text-primary hover:bg-primary/10 transition-all',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  }

  const sizeClasses = {
    default: 'h-9 px-4',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-6 text-sm',
    icon: 'h-9 w-9 shrink-0 rounded-md',
  }

  return cn(
    baseClass,
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.class
  )
})
</script>
