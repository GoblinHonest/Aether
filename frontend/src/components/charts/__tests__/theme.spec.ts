import { describe, expect, it } from 'vitest'
import { chartSeriesPalette, chartUiColors, hexToRgba, CHART_FALLBACK, chartThemeVersion } from '../theme'

describe('chart theme util', () => {
  it('hexToRgba converts 6-digit hex to rgba', () => {
    expect(hexToRgba('#165dff', 0.6)).toBe('rgba(22, 93, 255, 0.6)')
    expect(hexToRgba('#ffffff', 1)).toBe('rgba(255, 255, 255, 1)')
  })

  it('hexToRgba passes rgb()/rgba() through unchanged', () => {
    expect(hexToRgba('rgba(1,2,3,0.5)', 0.9)).toBe('rgba(1,2,3,0.5)')
  })

  it('fallback palette returns 8 Arco colors in jsdom', () => {
    const series = chartSeriesPalette()
    expect(series).toHaveLength(8)
    expect(series[0]).toBe(CHART_FALLBACK.series[0])
    expect(new Set(series).size).toBe(8)
  })

  it('chrome fallbacks match Arco light values in jsdom', () => {
    const ui = chartUiColors()
    expect(ui.muted).toBe(CHART_FALLBACK.muted)
    expect(ui.tooltipBg).toBe(CHART_FALLBACK.popover)
    expect(ui.tooltipFg).toBe(CHART_FALLBACK.popoverFg)
    expect(ui.primary).toBe(CHART_FALLBACK.primary)
  })

  it('chartThemeVersion starts at zero and bumps when ensureChartThemeWatcher fires', async () => {
    chartThemeVersion.value = 0
    const { ensureChartThemeWatcher } = await import('../theme')
    ensureChartThemeWatcher()
    // jsdom implements MutationObserver; toggling the class attribute must bump the version
    document.documentElement.classList.add('dark')
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(chartThemeVersion.value).toBeGreaterThanOrEqual(1)
    document.documentElement.classList.remove('dark')
  })
})
