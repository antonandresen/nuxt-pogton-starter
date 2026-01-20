interface CookieConsentState {
  choice: CookieConsentChoice
  updatedAt: string
  version: number
}

type CookieConsentChoice = 'necessary' | 'all' | 'deny'

const COOKIE_CONSENT_VERSION = 1

export function useCookieConsent() {
  const consent = useCookie<CookieConsentState | null>('cookie_consent', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
  })

  const choice = computed(() => consent.value?.choice ?? null)
  const hasDecision = computed(
    () => consent.value?.version === COOKIE_CONSENT_VERSION && !!consent.value?.choice,
  )

  const shouldShow = computed(() => process.client && !hasDecision.value)

  const setChoice = (nextChoice: CookieConsentChoice) => {
    consent.value = {
      choice: nextChoice,
      updatedAt: new Date().toISOString(),
      version: COOKIE_CONSENT_VERSION,
    }
  }

  const acceptAll = () => setChoice('all')
  const acceptNecessary = () => setChoice('necessary')
  const deny = () => setChoice('deny')

  const grants = computed(() => ({
    necessary: true,
    analytics: choice.value === 'all',
    marketing: choice.value === 'all',
  }))

  return {
    acceptAll,
    acceptNecessary,
    deny,
    grants,
    hasDecision,
    choice,
    shouldShow,
  }
}

