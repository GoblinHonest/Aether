<template>
  <div class="min-h-screen bg-white dark:bg-[#0a0a0a]">
    <!-- Nav -->
    <nav class="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-[#eee] dark:border-[#222]">
      <div class="max-w-[1200px] mx-auto px-8 h-16 flex items-center justify-between">
        <span class="text-base font-semibold text-[#1a1a1a] dark:text-[#e5e5e5]">{{ siteName || 'ManyCode' }}</span>
        <div class="flex items-center gap-6">
          <button @click="toggleDarkMode" class="w-8 h-8 flex items-center justify-center rounded-lg text-[#999] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5] transition-colors cursor-pointer">
            <Sun v-if="isDark" class="w-4 h-4" />
            <Moon v-else class="w-4 h-4" />
          </button>
          <router-link v-if="authStore.isAuthenticated" :to="dashboardPath" class="text-sm bg-[#1a1a1a] dark:bg-[#e5e5e5] text-white dark:text-[#0a0a0a] px-5 py-2 rounded-full font-medium hover:opacity-90 transition-opacity cursor-pointer">
            控制台
          </router-link>
          <button v-else @click="showLogin = true" class="text-sm bg-[#1a1a1a] dark:bg-[#e5e5e5] text-white dark:text-[#0a0a0a] px-5 py-2 rounded-full font-medium hover:opacity-90 transition-opacity cursor-pointer">
            登录
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero — split layout: left text, right CLI tabs -->
    <section class="py-20 md:py-28">
      <div class="max-w-[1200px] mx-auto px-8 flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
        <!-- Left -->
        <div class="flex-1 pt-4">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-normal text-[#1a1a1a] dark:text-[#e5e5e5] tracking-tight leading-tight">{{ siteName || 'ManyCode' }}</h1>
          <p class="mt-4 text-base md:text-lg text-[#666] dark:text-[#999] font-light max-w-md leading-relaxed">
            {{ siteSubtitle || 'AI 开发工具统一接入平台，整合多个 AI 编程助手' }}
          </p>
          <div class="mt-8 flex items-center gap-4">
            <router-link v-if="authStore.isAuthenticated" :to="dashboardPath" class="bg-[#1a1a1a] dark:bg-[#e5e5e5] text-white dark:text-[#0a0a0a] px-7 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">
              进入控制台
            </router-link>
            <button v-else @click="showLogin = true" class="bg-[#1a1a1a] dark:bg-[#e5e5e5] text-white dark:text-[#0a0a0a] px-7 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">
              开始使用
            </button>
          </div>
        </div>

        <!-- Right: API call example -->
        <div class="flex-1 w-full lg:max-w-[520px]">
          <!-- Tab buttons -->
          <div class="flex gap-1 mb-4">
            <button
              v-for="tab in codeTabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              class="px-4 py-2 rounded-xl text-[13px] font-medium transition-all cursor-pointer"
              :class="activeTab === tab.key
                ? 'bg-[#1a1a1a] dark:bg-[#e5e5e5] text-white dark:text-[#0a0a0a]'
                : 'text-[#666] dark:text-[#999] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a]'"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Code block -->
          <div class="bg-[#0a0a0a] rounded-2xl p-5 relative">
            <pre class="text-[13px] text-[#e5e5e5] font-mono overflow-x-auto whitespace-pre leading-relaxed">{{ codeExamples[activeTab] }}</pre>
            <button @click="copyToClipboard(codeExamples[activeTab])" class="absolute top-4 right-4 text-[#666] hover:text-white transition-colors cursor-pointer">
              <Copy class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-20 border-t border-[#eee] dark:border-[#222]">
      <div class="max-w-[1200px] mx-auto px-8">
        <div class="grid md:grid-cols-3 gap-5">
          <div class="bg-[#f5f5f5] dark:bg-[#111] rounded-2xl p-8">
            <p class="text-4xl font-normal text-[#1a1a1a] dark:text-[#e5e5e5]">99.9%</p>
            <p class="mt-2 text-sm text-[#999]">服务可用性</p>
            <p class="mt-4 text-[13px] text-[#666] dark:text-[#999] leading-relaxed">多节点冗余部署，自动故障转移，保障全天候稳定运行</p>
          </div>
          <div class="bg-[#f5f5f5] dark:bg-[#111] rounded-2xl p-8">
            <p class="text-4xl font-normal text-[#1a1a1a] dark:text-[#e5e5e5]">~180ms</p>
            <p class="mt-2 text-sm text-[#999]">平均响应延迟</p>
            <p class="mt-4 text-[13px] text-[#666] dark:text-[#999] leading-relaxed">智能路由选择最优链路，首字节极速返回</p>
          </div>
          <div class="bg-[#f5f5f5] dark:bg-[#111] rounded-2xl p-8">
            <p class="text-4xl font-normal text-[#1a1a1a] dark:text-[#e5e5e5]">42+</p>
            <p class="mt-2 text-sm text-[#999]">可用模型</p>
            <p class="mt-4 text-[13px] text-[#666] dark:text-[#999] leading-relaxed">覆盖 OpenAI、Claude、Gemini、DeepSeek 等主流厂商</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-24">
      <div class="max-w-[1200px] mx-auto px-8">
        <h2 class="text-3xl font-semibold text-[#1a1a1a] dark:text-[#e5e5e5] mb-12">核心能力</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div v-for="(feature, i) in features" :key="i" class="bg-[#f5f5f5] dark:bg-[#111] rounded-2xl p-7">
            <h3 class="text-base font-semibold text-[#1a1a1a] dark:text-[#e5e5e5] mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-[#666] dark:text-[#999] leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#1a1a1a] py-16">
      <div class="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span class="text-sm font-medium text-white">{{ siteName || 'ManyCode' }}</span>
        <div class="flex items-center gap-6 text-sm text-gray-400">
          <router-link to="/privacy-policy" class="hover:text-white transition-colors">隐私政策</router-link>
        </div>
        <span class="text-sm text-gray-500">&copy; {{ new Date().getFullYear() }} {{ siteName || 'ManyCode' }}</span>
      </div>
    </footer>

    <!-- Login Dialog -->
    <LoginDialog v-model="showLogin" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sun, Moon, Copy } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useDarkMode } from '@/composables/useDarkMode'
import { useClipboard } from '@/composables/useClipboard'
import { useSiteInfo } from '@/composables/useSiteInfo'
import LoginDialog from '@/features/auth/components/LoginDialog.vue'

const authStore = useAuthStore()
const { isDark, toggleDarkMode } = useDarkMode()
const { copyToClipboard } = useClipboard()
const { siteName, siteSubtitle } = useSiteInfo()

const showLogin = ref(false)
const activeTab = ref('curl')

const dashboardPath = computed(() =>
  authStore.canAccessAdmin ? '/admin/dashboard' : '/dashboard'
)

const baseUrl = computed(() => window.location.origin)

const codeTabs = [
  { key: 'curl', label: 'cURL' },
  { key: 'python', label: 'Python' },
  { key: 'node', label: 'Node.js' },
]

const codeExamples: Record<string, string> = {
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
}

const features = [
  { title: '统一接入', desc: '一个平台接入 Claude Code、Codex CLI、Gemini CLI 等多个 AI 编程助手' },
  { title: '智能路由', desc: '多渠道负载均衡、自动故障转移、按优先级和权重分配请求' },
  { title: '用量管控', desc: '细粒度的 Token 用量统计、成本分析、配额管理和账单追踪' },
  { title: '格式转换', desc: '自动在 OpenAI、Claude、Gemini 等不同 API 格式间无缝转换' },
]
</script>
