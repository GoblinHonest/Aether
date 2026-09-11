/**
 * 公告类型相关工具函数
 */
import type { Component } from 'vue'
import { IconExclamationCircle as AlertCircle, IconExclamationCircle as AlertTriangle, IconTool as Wrench, IconInfo as Info } from '@arco-design/web-vue/es/icon'

export type AnnouncementType = 'important' | 'warning' | 'maintenance' | 'info'

interface AnnouncementTypeConfig {
  icon: Component
  iconColor: string
  label: string
  bgColor: string
  borderColor: string
  textColor: string
}

const announcementTypeConfigs: Record<AnnouncementType, AnnouncementTypeConfig> = {
  important: {
    icon: AlertCircle,
    iconColor: 'text-[#cb272d] dark:text-[#f76560]',
    label: '重要公告',
    bgColor: 'bg-[#ffece8] dark:bg-[#4a000a]/30',
    borderColor: 'border-[#fbaca3] dark:border-[#770813]',
    textColor: 'text-[#770813] dark:text-[#fbaca3]'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-[#d25f00] dark:text-[#ffb357]',
    label: '警告通知',
    bgColor: 'bg-[#fff7e8] dark:bg-[#4a2000]/30',
    borderColor: 'border-[#ffe4ba] dark:border-[#783400]',
    textColor: 'text-[#783400] dark:text-[#ffe4ba]'
  },
  maintenance: {
    icon: Wrench,
    iconColor: 'text-[#d25f00] dark:text-[#ffb357]',
    label: '维护通知',
    bgColor: 'bg-[#fff7e8] dark:bg-[#4a2000]/30',
    borderColor: 'border-[#ffe4ba] dark:border-[#783400]',
    textColor: 'text-[#783400] dark:text-[#ffe4ba]'
  },
  info: {
    icon: Info,
    iconColor: 'text-primary dark:text-primary',
    label: '系统公告',
    bgColor: 'bg-primary/5',
    borderColor: 'border-primary/20',
    textColor: 'text-foreground'
  }
}

/**
 * 获取公告类型配置
 */
export function getAnnouncementConfig(type: string): AnnouncementTypeConfig {
  return announcementTypeConfigs[type as AnnouncementType] || announcementTypeConfigs.info
}

/**
 * 获取公告图标组件
 */
export function getAnnouncementIcon(type: string): Component {
  return getAnnouncementConfig(type).icon
}

/**
 * 获取公告图标颜色
 */
export function getAnnouncementIconColor(type: string): string {
  return getAnnouncementConfig(type).iconColor
}

/**
 * 获取公告类型标签
 */
export function getAnnouncementTypeLabel(type: string): string {
  return getAnnouncementConfig(type).label
}

/**
 * 获取公告背景颜色
 */
export function getAnnouncementBgColor(type: string): string {
  return getAnnouncementConfig(type).bgColor
}

/**
 * 获取公告边框颜色
 */
export function getAnnouncementBorderColor(type: string): string {
  return getAnnouncementConfig(type).borderColor
}

/**
 * 获取公告文字颜色
 */
export function getAnnouncementTextColor(type: string): string {
  return getAnnouncementConfig(type).textColor
}

/**
 * 将 Markdown 内容转换为纯文本摘要
 */
export function getPlainTextSummary(content: string, maxLength = 120): string {
  const cleaned = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\(([^)]*)\)/g, '$1')
    .replace(/[#>*_~]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleaned.length <= maxLength) {
    return cleaned
  }

  return `${cleaned.slice(0, maxLength).trim()}...`
}
