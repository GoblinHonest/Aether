import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiClientMocks = vi.hoisted(() => ({
  get: vi.fn(),
}))

vi.mock('@/api/client', () => ({
  default: apiClientMocks,
}))

describe('useSiteInfo', () => {
  beforeEach(() => {
    vi.resetModules()
    apiClientMocks.get.mockReset()
    document.title = ''
  })

  it('loads public site info', async () => {
    apiClientMocks.get.mockResolvedValue({
      data: {
        site_name: 'Custom ManyCode',
        site_subtitle: 'Gateway',
      },
    })

    const { useSiteInfo } = await import('../useSiteInfo')
    const { siteName, siteSubtitle, siteInfoLoaded, refreshSiteInfo } = useSiteInfo()
    await refreshSiteInfo()

    expect(siteName.value).toBe('Custom ManyCode')
    expect(siteSubtitle.value).toBe('Gateway')
    expect(siteInfoLoaded.value).toBe(true)
    expect(document.title).toBe('Custom ManyCode')
  })

  it('shows default site text until public site info resolves', async () => {
    let resolveRequest: (value: { data: { site_name: string; site_subtitle: string } }) => void = () => {}
    apiClientMocks.get.mockReturnValue(new Promise((resolve) => {
      resolveRequest = resolve
    }))

    const { useSiteInfo } = await import('../useSiteInfo')
    const { siteName, siteSubtitle, siteInfoLoaded } = useSiteInfo()

    expect(siteName.value).toBe('ManyCode')
    expect(siteSubtitle.value).toBe('AI API Gateway')
    expect(siteInfoLoaded.value).toBe(false)
    expect(document.title).toBe('ManyCode')

    resolveRequest({
      data: {
        site_name: 'Configured Site',
        site_subtitle: 'Configured Gateway',
      },
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(siteName.value).toBe('Configured Site')
    expect(siteSubtitle.value).toBe('Configured Gateway')
    expect(siteInfoLoaded.value).toBe(true)
    expect(document.title).toBe('Configured Site')
  })

  it('keeps default site text when public site info fails', async () => {
    apiClientMocks.get.mockRejectedValue(new Error('network unavailable'))

    const { useSiteInfo } = await import('../useSiteInfo')
    const { siteName, siteSubtitle, siteInfoLoaded, refreshSiteInfo } = useSiteInfo()

    expect(siteName.value).toBe('ManyCode')
    expect(siteSubtitle.value).toBe('AI API Gateway')

    await refreshSiteInfo()

    expect(siteName.value).toBe('ManyCode')
    expect(siteSubtitle.value).toBe('AI API Gateway')
    expect(siteInfoLoaded.value).toBe(true)
    expect(document.title).toBe('ManyCode')
  })
})