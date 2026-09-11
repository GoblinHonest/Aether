<template>
  <div class="min-h-screen bg-white dark:bg-[#17171a]">
    <!-- Nav -->
    <nav class="sticky top-0 z-50 border-b border-[#e5e6eb] bg-white/85 dark:border-[#2e2e2f] dark:bg-[#17171a]/85">
      <div class="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 md:px-8">
        <router-link
          to="/"
          class="flex items-center gap-2"
        >
          <HeaderLogo class="h-7 w-7" />
          <span class="text-[15px] font-semibold text-[#1d2129] dark:text-[#f6f6f6]">{{ siteName || 'ManyCode' }}</span>
        </router-link>
        <div class="flex items-center gap-3">
          <button
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#4e5969] transition-colors hover:bg-[#f2f3f5] hover:text-[#1d2129] dark:text-[#ababac] dark:hover:bg-[#2a2a2b] dark:hover:text-[#f6f6f6]"
            :aria-label="t('common.theme')"
            @click="toggleDarkMode"
          >
            <Sun
              v-if="isDark"
              class="h-4 w-4"
            />
            <Moon
              v-else
              class="h-4 w-4"
            />
          </button>
          <router-link
            v-if="authStore.isAuthenticated"
            :to="dashboardPath"
            class="rounded-md bg-[#165dff] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#4080ff] dark:hover:bg-[#0e42d2]"
          >
            {{ t('home.openConsole') }}
          </router-link>
          <button
            v-else
            class="cursor-pointer rounded-md bg-[#165dff] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#4080ff] dark:hover:bg-[#0e42d2]"
            @click="showLogin = true"
          >
            {{ t('common.signIn') }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div
        class="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div class="absolute -right-[20%] -top-[30%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(22,93,255,0.10),transparent_65%)]" />
        <div class="absolute -left-[15%] top-[35%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,180,42,0.06),transparent_65%)]" />
      </div>

      <div class="relative mx-auto flex max-w-[1200px] flex-col items-start gap-12 px-6 py-20 md:px-8 lg:flex-row lg:gap-16 lg:py-28">
        <!-- Left -->
        <div class="flex-1 pt-2">
          <div class="mb-6 flex flex-wrap gap-2">
            <span
              v-for="tag in techTags"
              :key="tag.label"
              class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium"
              :class="tag.class"
            >{{ tag.label }}</span>
          </div>
          <h1 class="text-4xl font-semibold leading-[1.15] tracking-tight text-[#1d2129] dark:text-[#f6f6f6] md:text-5xl">
            {{ siteName || 'ManyCode' }}
          </h1>
          <p class="mt-5 max-w-md text-base leading-relaxed text-[#4e5969] dark:text-[#a9aeb8]">
            {{ siteSubtitle || t('home.tagline') }}
          </p>
          <div class="mt-9 flex items-center gap-4">
            <router-link
              v-if="authStore.isAuthenticated"
              :to="dashboardPath"
              class="rounded-md bg-[#165dff] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#4080ff] dark:hover:bg-[#0e42d2]"
            >
              {{ t('home.enterConsole') }}
            </router-link>
            <button
              v-else
              class="cursor-pointer rounded-md bg-[#165dff] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#4080ff] dark:hover:bg-[#0e42d2]"
              @click="showLogin = true"
            >
              {{ t('home.getStart') }}
            </button>
            <router-link
              to="/dashboard/endpoint-status"
              class="rounded-md border border-[#e5e6eb] bg-white px-6 py-2.5 text-sm font-medium text-[#1d2129] transition-colors hover:border-[#165dff] hover:text-[#165dff] dark:border-[#484849] dark:bg-[#232324] dark:text-[#f6f6f6] dark:hover:border-[#4080ff] dark:hover:text-[#4080ff]"
            >
              {{ t('home.viewStatus') }}
            </router-link>
          </div>
        </div>

        <!-- Right: API call example -->
        <div class="w-full flex-1 lg:max-w-[520px]">
          <div class="overflow-hidden rounded border border-[#e5e6eb] bg-white shadow-[0_4px_10px_rgba(29,33,41,0.04)] dark:border-[#2e2e2f] dark:bg-[#1d2129]">
            <!-- Window bar -->
            <div class="flex items-center gap-2 border-b border-[#e5e6eb] bg-[#f7f8fa] px-4 dark:border-[#2e2e2f] dark:bg-[#232324]">
              <span class="h-2.5 w-2.5 rounded-full bg-[#f76965]" />
              <span class="h-2.5 w-2.5 rounded-full bg-[#fdb945]" />
              <span class="h-2.5 w-2.5 rounded-full bg-[#33c67c]" />
              <span class="ml-2 font-mono text-xs text-[#86909c] dark:text-[#929293]">{{ apiEndpoint }}</span>
            </div>
            <!-- Tabs -->
            <div class="flex border-b border-[#e5e6eb] dark:border-[#2e2e2f]">
              <button
                v-for="tab in codeTabs"
                :key="tab.key"
                type="button"
                class="relative cursor-pointer px-4 py-2.5 text-[13px] font-medium transition-colors"
                :class="activeTab === tab.key
                  ? 'text-[#165dff] dark:text-[#4080ff]'
                  : 'text-[#4e5969] hover:text-[#1d2129] dark:text-[#a9aeb8] dark:hover:text-[#f6f6f6]'"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
                <span
                  v-if="activeTab === tab.key"
                  class="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#165dff] dark:bg-[#4080ff]"
                />
              </button>
              <button
                class="ml-auto flex cursor-pointer items-center gap-1 px-3 text-[13px] text-[#86909c] transition-colors hover:text-[#165dff] dark:text-[#929293] dark:hover:text-[#4080ff]"
                :title="t('common.copy')"
                @click="copyToClipboard(codeExamples[activeTab])"
              >
                <Copy class="h-3.5 w-3.5" />
              </button>
            </div>
            <!-- Code -->
            <pre class="overflow-x-auto whitespace-pre bg-[#1d2129] p-4 font-mono text-[12.5px] leading-relaxed text-[#e5e6eb] dark:bg-[#17171a]">{{ codeExamples[activeTab] }}</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="border-t border-[#e5e6eb] dark:border-[#2e2e2f]">
      <div class="mx-auto max-w-[1200px] px-6 py-16 md:px-8">
        <div class="grid gap-4 md:grid-cols-3">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="flex items-start gap-4 rounded border border-[#e5e6eb] bg-white p-6 transition-shadow hover:shadow-[0_4px_14px_rgba(29,33,41,0.06)] dark:border-[#2e2e2f] dark:bg-[#1d2129]"
          >
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              :class="stat.iconClass"
            >
              <component
                :is="stat.icon"
                class="h-5 w-5"
                :class="stat.iconColor"
              />
            </span>
            <div class="min-w-0">
              <p class="text-2xl font-semibold tracking-tight text-[#1d2129] dark:text-[#f6f6f6]">
                {{ stat.value }}
              </p>
              <p class="mt-0.5 text-sm font-medium text-[#4e5969] dark:text-[#a9aeb8]">
                {{ stat.label }}
              </p>
              <p class="mt-1.5 text-[13px] leading-relaxed text-[#86909c] dark:text-[#929293]">
                {{ stat.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="border-t border-[#e5e6eb] dark:border-[#2e2e2f]">
      <div class="mx-auto max-w-[1200px] px-6 py-16 md:px-8 lg:py-20">
        <h2 class="text-2xl font-semibold tracking-tight text-[#1d2129] dark:text-[#f6f6f6] lg:text-3xl">
          {{ t('home.coreFeatures') }}
        </h2>
        <p class="mt-2 text-sm text-[#86909c] dark:text-[#929293]">
          {{ t('home.coreFeaturesSub') }}
        </p>
        <div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group rounded border border-[#e5e6eb] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#165dff]/40 hover:shadow-[0_8px_24px_rgba(22,93,255,0.08)] dark:border-[#2e2e2f] dark:bg-[#1d2129] dark:hover:border-[#4080ff]/40"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
              :class="feature.iconBg"
            >
              <component
                :is="feature.icon"
                class="h-5 w-5"
                :class="feature.iconColor"
              />
            </span>
            <h3 class="mt-4 text-[15px] font-semibold text-[#1d2129] dark:text-[#f6f6f6]">
              {{ feature.title }}
            </h3>
            <p class="mt-1.5 text-[13px] leading-relaxed text-[#86909c] dark:text-[#929293]">
              {{ feature.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA band -->
    <section class="border-t border-[#e5e6eb] dark:border-[#2e2e2f]">
      <div class="mx-auto max-w-[1200px] px-6 py-16 md:px-8">
        <div class="flex flex-col items-center gap-6 rounded-lg border border-[#bedaff] bg-[#e8f3ff] px-8 py-12 text-center dark:border-[#0e2a6e] dark:bg-[#0e1d33]">
          <h2 class="text-2xl font-semibold tracking-tight text-[#0e42d2] dark:text-[#94bfff]">
            {{ t('home.ctaTitle') }}
          </h2>
          <p class="max-w-lg text-sm text-[#20439f] dark:text-[#7da2e8]">
            {{ t('home.ctaSub') }}
          </p>
          <button
            v-if="!authStore.isAuthenticated"
            class="cursor-pointer rounded-md bg-[#165dff] px-8 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#4080ff]"
            @click="showLogin = true"
          >
            {{ t('home.getStart') }}
          </button>
          <router-link
            v-else
            :to="dashboardPath"
            class="rounded-md bg-[#165dff] px-8 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#4080ff]"
          >
            {{ t('home.enterConsole') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-[#e5e6eb] bg-[#f7f8fa] dark:border-[#2e2e2f] dark:bg-[#1d2129]">
      <div class="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row md:px-8">
        <div class="flex items-center gap-2">
          <HeaderLogo class="h-5 w-5" />
          <span class="text-sm font-medium text-[#4e5969] dark:text-[#a9aeb8]">{{ siteName || 'ManyCode' }}</span>
        </div>
        <div class="flex items-center gap-6 text-sm text-[#86909c] dark:text-[#929293]">
          <router-link
            to="/privacy-policy"
            class="transition-colors hover:text-[#1d2129] dark:hover:text-[#f6f6f6]"
          >
            {{ t('footer.privacy') }}
          </router-link>
          <span class="text-[#a9aeb8] dark:text-[#78787a]">&copy; {{ new Date().getFullYear() }} {{ siteName || 'ManyCode' }}</span>
        </div>
      </div>
    </footer>

    <!-- Login Dialog -->
    <LoginDialog v-model="showLogin" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconSun as Sun, IconMoon as Moon, IconCopy as Copy, IconSafe as ShieldCheck, IconDashboard as Gauge, IconArchive as Boxes, IconBranch as GitBranch, IconLanguage as Languages } from '@arco-design/web-vue/es/icon'
import { Shuffle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useDarkMode } from '@/composables/useDarkMode'
import { useClipboard } from '@/composables/useClipboard'
import { useSiteInfo } from '@/composables/useSiteInfo'
import { useI18n } from '@/i18n'
import HeaderLogo from '@/components/HeaderLogo.vue'
import LoginDialog from '@/features/auth/components/LoginDialog.vue'

const authStore = useAuthStore()
const { isDark, toggleDarkMode } = useDarkMode()
const { copyToClipboard } = useClipboard()
const { siteName, siteSubtitle } = useSiteInfo()
const { t } = useI18n()

const showLogin = ref(false)
const activeTab = ref('curl')

const dashboardPath = computed(() =>
  authStore.canAccessAdmin ? '/admin/dashboard' : '/dashboard',
)

const baseUrl = computed(() => window.location.origin)
const apiEndpoint = computed(() => `${baseUrl.value.replace(/^https?:\/\//, '')}/v1/chat/completions`)

const codeTabs = [
  { key: 'curl', label: 'cURL' },
  { key: 'python', label: 'Python' },
  { key: 'node', label: 'Node.js' },
]

const techTags = [
  { label: 'OpenAI Compatible', class: 'border-[#bedaff] bg-[#e8f3ff] text-[#0e42d2] dark:border-[#0e2a6e] dark:bg-[#0e1d33] dark:text-[#94bfff]' },
  { label: 'Claude', class: 'border-[#ffcf8b] bg-[#fff7e8] text-[#d25f00] dark:border-[#6e3305] dark:bg-[#4a1021] dark:text-[#ffcf8b]' },
  { label: 'Gemini', class: 'border-[#aff0b5] bg-[#e8ffea] text-[#009a29] dark:border-[#02571d] dark:bg-[#032913] dark:text-[#aff0b5]' },
  { label: 'Cline · Codex · Roo · Kilo', class: 'border-[#c3e7fe] bg-[#e8f7ff] text-[#0c4a6e] dark:border-[#06284f] dark:bg-[#02162e] dark:text-[#9fd4fd]' },
]

const codeExamples = computed<Record<string, string>>(() => ({
  curl: `curl ${baseUrl.value}/v1/chat/completions \\
  -H "Authorization: Bearer sk-your-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "stream": true
  }'`,
  python: `from openai import OpenAI

client = OpenAI(
    api_key="sk-your-key",
    base_url="${baseUrl.value}/v1"
)

response = client.chat.completions.create(
    model="claude-sonnet-4-20250514",
    messages=[{"role": "user", "content": "Hello!"}],
    stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content, end="")`,
  node: `import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'sk-your-key',
  baseURL: '${baseUrl.value}/v1'
});

const stream = await client.chat.completions.create({
  model: 'gemini-2.5-flash',
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}`,
}))

const stats = [
  {
    value: '99.9%',
    label: '服务可用性',
    desc: '多节点冗余部署，自动故障转移，全天候稳定运行',
    icon: ShieldCheck,
    iconClass: 'bg-[#e8ffea] dark:bg-[#032913]',
    iconColor: 'text-[#00b42a] dark:text-[#7be188]',
  },
  {
    value: '~180ms',
    label: '平均响应延迟',
    desc: '智能路由选择最优链路，首字节极速返回',
    icon: Gauge,
    iconClass: 'bg-[#e8f3ff] dark:bg-[#0e1d33]',
    iconColor: 'text-[#165dff] dark:text-[#4080ff]',
  },
  {
    value: '42+',
    label: '可用模型',
    desc: '覆盖 OpenAI、Claude、Gemini、DeepSeek 等主流厂商',
    icon: Boxes,
    iconClass: 'bg-[#fff7e8] dark:bg-[#4a1021]',
    iconColor: 'text-[#ff7d00] dark:text-[#ffb65d]',
  },
]

const features = [
  {
    title: '统一接入',
    desc: '一个平台接入 Claude Code、Codex CLI、Gemini CLI 等多个 AI 编程助手',
    icon: Boxes,
    iconBg: 'bg-[#e8f3ff] dark:bg-[#0e1d33]',
    iconColor: 'text-[#165dff] dark:text-[#4080ff]',
  },
  {
    title: '智能路由',
    desc: '多渠道负载均衡、自动故障转移、按优先级和权重分配请求',
    icon: GitBranch,
    iconBg: 'bg-[#e8ffea] dark:bg-[#032913]',
    iconColor: 'text-[#00b42a] dark:text-[#7be188]',
  },
  {
    title: '用量管控',
    desc: '细粒度的 Token 用量统计、成本分析、配额管理和账单追踪',
    icon: Shuffle,
    iconBg: 'bg-[#fff7e8] dark:bg-[#4a1021]',
    iconColor: 'text-[#ff7d00] dark:text-[#ffb65d]',
  },
  {
    title: '格式转换',
    desc: '自动在 OpenAI、Claude、Gemini 等不同 API 格式间无缝转换',
    icon: Languages,
    iconBg: 'bg-[#f5e8ff] dark:bg-[#2a0a4d]',
    iconColor: 'text-[#722ed1] dark:text-[#c396ed]',
  },
]
</script>
