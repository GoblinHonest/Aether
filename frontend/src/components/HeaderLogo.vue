<template>
  <div
    class="relative group cursor-pointer"
    :class="containerClass"
  >
    <img
      src="/IMG_20260619_184826.png"
      alt="ManyCode"
      class="w-full h-full object-contain"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'h-7 w-auto',
  className: ''
})

const containerClass = `${props.size} ${props.className}`.trim()
</script>
