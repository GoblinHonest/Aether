<template>
  <div class="w-full h-full">
    <canvas ref="chartRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from '@/i18n'
import { chartUiColors, hexToRgba, useChartThemeVersion } from './theme'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions
} from 'chart.js'

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  options: undefined
})

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
)

interface Props {
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
  height?: number
}
const chartRef = ref<HTMLCanvasElement>()
const { locale } = useI18n()
const themeVersion = useChartThemeVersion()
let chart: ChartJS<'line'> | null = null

function makeDefaultOptions(): ChartOptions<'line'> {
  const ui = chartUiColors()
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: hexToRgba(ui.border, 0.6) },
        ticks: { color: ui.muted },
      },
      y: {
        grid: { color: hexToRgba(ui.border, 0.6) },
        ticks: { color: ui.muted },
      },
    },
    plugins: {
      legend: {
        labels: { color: ui.muted },
      },
      tooltip: {
        backgroundColor: ui.tooltipBg,
        titleColor: ui.tooltipFg,
        bodyColor: ui.tooltipFg,
        borderColor: ui.border,
        borderWidth: 1,
      },
    },
  }
}

function buildChartOptions(): ChartOptions<'line'> {
  return {
    ...makeDefaultOptions(),
    locale: locale.value,
    ...props.options,
    ...(props.options?.plugins
      ? { plugins: { ...makeDefaultOptions().plugins, ...props.options.plugins } }
      : {}),
    ...(props.options?.scales
      ? { scales: { ...makeDefaultOptions().scales, ...props.options.scales } }
      : {}),
  }
}

function createChart() {
  if (!chartRef.value) return

  chart = new ChartJS(chartRef.value, {
    type: 'line',
    data: props.data,
    options: buildChartOptions()
  })
}

function updateChart() {
  if (chart) {
    chart.data = props.data
    chart.update('none') // 禁用动画以提高性能
  }
}

onMounted(async () => {
  await nextTick()
  createChart()
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})

// 监听引用变化，避免深监听触发整图重算
watch(() => props.data, updateChart)
watch([() => props.options, locale, themeVersion], () => {
  if (chart) {
    chart.options = buildChartOptions()
    chart.update('none')
  }
})
</script>
