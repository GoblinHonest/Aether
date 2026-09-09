/**
 * Runtime-resolved chart palette shared by canvas chart components and views.
 *
 * Tokens live in src/style.css (:root / .dark); the canvas cannot consume CSS
 * variables, so every caller resolves them at draw time. In test environments
 * (jsdom) getComputedStyle returns empty strings — so callers use the
 * {@link chartUiColors} / {@link chartSeriesPalette} helpers which fall back
 * to the Arco light palette defined here.
 *
 * The version bumps whenever the `.dark` class toggles; Vue computed refs
 * that read it re-evaluate, keeping dataset colors in sync when the theme
 * flips without needing per-view observers.
 */
import { computed, ref } from 'vue'

/** Bumped on every html[class] change (theme toggle). */
export const chartThemeVersion = ref(0)

/** Light-mode fallbacks (Arco Design) for environments without real CSS. */
export const CHART_FALLBACK = {
  muted: '#86909c',
  border: '#e5e6eb',
  popover: '#ffffff',
  popoverFg: '#1d2129',
  primary: '#165dff',
  series: ['#165dff', '#14c9c9', '#722ed1', '#ff7d00', '#00b42a', '#f7ba1e', '#f53f3f', '#86909c'],
} as const

export interface ChartUiColors {
  /** axis ticks + legend labels */
  muted: string
  /** grid lines and tooltip border */
  border: string
  /** tooltip background */
  tooltipBg: string
  /** tooltip title/body text */
  tooltipFg: string
  /** accent used for crosshair and primary line defaults */
  primary: string
}

function cssVar(name: string): string {
  if (typeof document === 'undefined') return ''
  const v = getComputedStyle(document.documentElement).getPropertyValue(name)
  return v ? v.trim() : ''
}

function readSeries(): string[] {
  if (typeof document === 'undefined') return [...CHART_FALLBACK.series]
  const out: string[] = []
  for (let i = 1; i <= 8; i++) {
    out.push(cssVar(`--chart-${i}`) || CHART_FALLBACK.series[i - 1] || '#86909c')
  }
  return out
}

/** Resolve the chrome (axis/legend/tooltip) colors of the active theme. */
export function chartUiColors(): ChartUiColors {
  return {
    muted: cssVar('--muted-foreground') || CHART_FALLBACK.muted,
    border: cssVar('--border') || CHART_FALLBACK.border,
    tooltipBg: cssVar('--popover') || CHART_FALLBACK.popover,
    tooltipFg: cssVar('--popover-foreground') || CHART_FALLBACK.popoverFg,
    primary: cssVar('--primary') || CHART_FALLBACK.primary,
  }
}

/** 8-color Arco series palette, resolved from the active theme. */
export function chartSeriesPalette(): string[] {
  return readSeries()
}

/** hex `#rrggbb` (or `rgb()` string passed through) -> `rgba(r,g,b,a)`. */
export function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(22, 93, 255, ${alpha})`
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i)
  if (!m) return hex // already rgb()/rgba()/hsl() — pass through
  const n = parseInt(m[1], 16)
  const r = (n >> 16) & 0xff
  const g = (n >> 8) & 0xff
  const b = n & 0xff
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

let themeObserver: MutationObserver | null = null

/**
 * Idempotent global watcher: bumps `chartThemeVersion` when the `.dark` class
 * on `<html>` toggles. Call it from `useChartThemeVersion()` — or early in
 * setup blocks that consume the palette — so dataset computeds re-run.
 */
export function ensureChartThemeWatcher(): void {
  if (themeObserver || typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return
  }
  themeObserver = new MutationObserver(() => {
    chartThemeVersion.value += 1
  })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
}

/** Version ref that changes whenever the theme flips. */
export function useChartThemeVersion() {
  ensureChartThemeWatcher()
  return chartThemeVersion
}

/** Reactive 8-color palette; recomputes on theme flip. */
export function useChartPalette() {
  const themeVersion = useChartThemeVersion()
  return computed(() => {
    void themeVersion.value
    return chartSeriesPalette()
  })
}