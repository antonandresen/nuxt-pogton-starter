import { api, useConvexQuery } from '~/composables/useConvex'

export function useUsage() {
  const { data: metrics } = useConvexQuery(api.usage.listForCurrentOrg, {})

  const getMetric = (key: string) => {
    return metrics.value?.find((metric) => metric.metric === key) ?? null
  }

  return {
    metrics,
    getMetric,
  }
}

