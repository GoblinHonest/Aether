const PLAN_TYPE_LABELS: Record<string, string> = {
  self_serve_business_usage_based: 'Codex',
  free: 'Free',
  plus: 'Plus',
  team: 'Team',
  enterprise: 'Enterprise',
  paid: 'Paid',
  pro: 'Pro',
  'pro+': 'Pro+',
  power: 'Power',
  ultra: 'Ultra',
  basic: 'Basic',
  super: 'Super',
  heavy: 'Heavy',
}

const PLAN_TYPE_CLASS_NAMES: Record<string, string> = {
  plus: 'border-[#00b42a]/50 text-[#009a29] dark:text-[#23c343]',
  pro: 'border-[#4080ff]/50 text-[#165dff] dark:text-[#6aa1ff]',
  free: 'border-primary/50 text-primary',
  paid: 'border-[#4080ff]/50 text-[#165dff] dark:text-[#6aa1ff]',
  team: 'border-[#722ed1]/50 text-[#551db0] dark:text-[#914dd9]',
  enterprise: 'border-[#ff7d00]/50 text-[#d25f00] dark:text-[#ffb357]',
  ultra: 'border-[#ff7d00]/50 text-[#d25f00] dark:text-[#ffb357]',
  'pro+': 'border-[#722ed1]/50 text-[#551db0] dark:text-[#914dd9]',
  power: 'border-[#ff7d00]/50 text-[#d25f00] dark:text-[#ffb357]',
  basic: 'border-primary/50 text-primary',
  super: 'border-[#00b42a]/50 text-[#009a29] dark:text-[#23c343]',
  heavy: 'border-[#ff7d00]/50 text-[#d25f00] dark:text-[#ffb357]',
}

export function normalizeOAuthPlanType(planType?: string | null): string | null {
  if (typeof planType !== 'string') {
    return null
  }

  const normalized = planType.trim().toLowerCase()
  if (!normalized) {
    return null
  }
  return normalized
}

export function formatOAuthPlanType(planType?: string | null): string {
  const normalized = normalizeOAuthPlanType(planType)
  if (!normalized) {
    return ''
  }

  const knownLabel = PLAN_TYPE_LABELS[normalized]
  if (knownLabel) {
    return knownLabel
  }

  return normalized
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

export function getOAuthPlanTypeClass(planType?: string | null): string {
  const normalized = normalizeOAuthPlanType(planType)
  if (!normalized) {
    return ''
  }
  return PLAN_TYPE_CLASS_NAMES[normalized] || ''
}

export function isNonFreeOAuthPlan(planType?: string | null): boolean {
  const normalized = normalizeOAuthPlanType(planType)
  if (!normalized) {
    return false
  }
  return normalized !== 'free'
}
