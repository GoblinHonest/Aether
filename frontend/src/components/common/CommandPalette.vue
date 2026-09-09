<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[300] flex items-start justify-center pt-[12vh]"
        @click.self="close"
      >
        <div class="absolute inset-0 bg-black/40" />

        <div
          ref="panelRef"
          class="relative w-[min(560px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-[#e5e6eb] bg-white shadow-[0_16px_36px_rgba(0,0,0,0.14)] dark:border-[#484849] dark:bg-[#232324]"
          role="dialog"
          aria-modal="true"
          :aria-label="t('palette.title')"
        >
          <div class="flex items-center gap-2 border-b border-[#e5e6eb] px-4 dark:border-[#484849]">
            <Search class="h-4 w-4 shrink-0 text-[#86909c]" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              class="h-12 w-full bg-transparent text-sm text-[#1d2129] outline-none placeholder:text-[#a9aeb8] dark:text-[#f6f6f6] dark:placeholder:text-[#78787a]"
              :placeholder="t('palette.placeholder')"
              @keydown.down.prevent="move(1)"
              @keydown.up.prevent="move(-1)"
              @keydown.enter.prevent="run(filtered[active])"
              @keydown.esc.prevent="close"
            />
            <kbd class="hidden shrink-0 rounded-sm border border-[#e5e6eb] bg-[#f2f3f5] px-1.5 py-0.5 text-[10px] text-[#86909c] sm:block dark:border-[#484849] dark:bg-[#2a2a2b]">ESC</kbd>
          </div>

          <div class="max-h-[52vh] overflow-y-auto overscroll-contain p-1.5">
            <template v-if="grouped.length">
              <div
                v-for="group in grouped"
                :key="group.key"
                class="mb-1 last:mb-0"
              >
                <div class="px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-[#838280] dark:text-[#929293]">
                  {{ group.label }}
                </div>
                <button
                  v-for="item in group.items"
                  :key="item.href"
                  type="button"
                  class="flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left text-[13px] transition-colors"
                  :class="active === flatIndex(item)
                    ? 'bg-[#e8f3ff] text-[#0e42d2] dark:bg-[#0e1d33] dark:text-[#4080ff]'
                    : 'text-[#1d2129] hover:bg-[#f2f3f5] dark:text-[#f6f6f6] dark:hover:bg-[#2a2a2b]'"
                  :data-active="active === flatIndex(item) ? '' : undefined"
                  @mousemove="active = flatIndex(item)"
                  @click="run(item)"
                >
                  <component
                    :is="item.icon"
                    class="h-4 w-4 shrink-0"
                    :class="active === flatIndex(item) ? 'text-[#165dff]' : 'text-[#86909c]'"
                  />
                  <span class="min-w-0 flex-1 truncate">{{ item.name }}</span>
                  <kbd
                    v-if="active === flatIndex(item)"
                    class="hidden shrink-0 rounded-sm border border-[#e5e6eb] bg-[#f2f3f5] px-1 text-[10px] text-[#86909c] sm:block dark:border-[#484849] dark:bg-[#2a2a2b]"
                  >↵</kbd>
                </button>
              </div>
            </template>
            <div
              v-else
              class="px-3 py-10 text-center text-[13px] text-[#a9aeb8]"
            >
              {{ t('palette.empty') }}
            </div>
          </div>

          <div class="flex items-center justify-between border-t border-[#e5e6eb] px-4 py-2 text-[11px] text-[#a9aeb8] dark:border-[#484849]">
            <span>{{ t('palette.hint') }}</span>
            <span class="hidden items-center gap-1 sm:flex">
              <kbd class="rounded-sm border border-[#e5e6eb] bg-[#f2f3f5] px-1 dark:border-[#484849] dark:bg-[#2a2a2b]">↑↓</kbd>
              <kbd class="rounded-sm border border-[#e5e6eb] bg-[#f2f3f5] px-1 dark:border-[#484849] dark:bg-[#2a2a2b]">↵</kbd>
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import type { Component } from 'vue'
import { useI18n } from '@/i18n'

export interface PaletteItem {
  name: string
  href: string
  icon?: Component
  groupKey: string
  groupLabel: string
}

const props = defineProps<{
  open: boolean
  items: PaletteItem[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'navigate', href: string): void
}>()

const { t } = useI18n()
const query = ref('')
const active = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.items
  return props.items.filter(i =>
    i.name.toLowerCase().includes(q) || i.groupLabel.toLowerCase().includes(q),
  )
})

const grouped = computed(() => {
  const order: string[] = []
  const map = new Map<string, { key: string; label: string; items: PaletteItem[] }>()
  for (const item of filtered.value) {
    if (!map.has(item.groupKey)) {
      order.push(item.groupKey)
      map.set(item.groupKey, { key: item.groupKey, label: item.groupLabel, items: [] })
    }
    map.get(item.groupKey)!.items.push(item)
  }
  return order.map(k => map.get(k)!)
})

const flat = computed(() => grouped.value.flatMap(g => g.items))

function flatIndex(item: PaletteItem): number {
  return flat.value.indexOf(item)
}

function move(delta: number) {
  if (!flat.value.length) return
  active.value = (active.value + delta + flat.value.length) % flat.value.length
  void nextTick(() => {
    panelRef.value?.querySelector('[data-active]')?.scrollIntoView({ block: 'nearest' })
  })
}

function run(item?: PaletteItem) {
  if (!item) return
  close()
  emit('navigate', item.href)
}

function close() {
  query.value = ''
  active.value = 0
  emit('close')
}

watch(() => props.open, (open) => {
  if (open) {
    void nextTick(() => inputRef.value?.focus())
  }
})

watch(query, () => { active.value = 0 })
</script>
