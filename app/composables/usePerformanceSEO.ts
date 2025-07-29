export interface PerformanceMetrics {
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay  
  cls?: number // Cumulative Layout Shift
  fcp?: number // First Contentful Paint
  ttfb?: number // Time to First Byte
}

export const usePerformanceSEO = () => {
  // 🚀 CORE WEB VITALS OPTIMIZATION
  const optimizeLCP = () => {
    // Largest Contentful Paint optimization
    useHead({
      link: [
        // Preload critical resources
        { rel: 'preload', as: 'font', href: '/fonts/figtree-400.woff2', type: 'font/woff2', crossorigin: '' },
        { rel: 'preload', as: 'image', href: '/logo.png' },
        
        // Preconnect to external domains
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://api.stripe.com' },
        
        // DNS prefetch for better performance
        { rel: 'dns-prefetch', href: 'https://checkout.stripe.com' },
        { rel: 'dns-prefetch', href: 'https://js.stripe.com' }
      ]
    })
  }

  // ⚡ MINIMIZE CUMULATIVE LAYOUT SHIFT
  const optimizeCLS = () => {
    // Add CSS for stable layouts
    useHead({
      style: [
        {
          innerHTML: `
            /* Prevent layout shifts */
            img { aspect-ratio: attr(width) / attr(height); }
            .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); }
            .fade-in { opacity: 0; animation: fadeIn 0.3s ease forwards; }
            @keyframes fadeIn { to { opacity: 1; } }
            
            /* Reserve space for dynamic content */
            .hero-section { min-height: 500px; }
            .pricing-section { min-height: 600px; }
            .testimonials-section { min-height: 400px; }
          `
        }
      ]
    })
  }

  // 🎯 FIRST INPUT DELAY OPTIMIZATION
  const optimizeFID = () => {
    // Use web workers for heavy computations
    const deferNonCriticalJS = () => {
      if (process.client) {
        // Defer non-critical JavaScript
        setTimeout(() => {
          // Load analytics after main content
          loadAnalytics()
        }, 2000)
      }
    }

    return { deferNonCriticalJS }
  }

  // 📊 PERFORMANCE MONITORING
  const measureCoreWebVitals = (): Promise<PerformanceMetrics> => {
    return new Promise((resolve) => {
      if (!process.client) {
        resolve({})
        return
      }

      const metrics: PerformanceMetrics = {}

      // Measure LCP
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            metrics.lcp = entry.startTime
          }
          if (entry.entryType === 'first-input') {
            metrics.fid = (entry as any).processingStart - entry.startTime
          }
          if (entry.entryType === 'layout-shift') {
            if (!(entry as any).hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + (entry as any).value
            }
          }
        })
      })

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })

      // Resolve after 5 seconds
      setTimeout(() => {
        observer.disconnect()
        resolve(metrics)
      }, 5000)
    })
  }

  // 🔧 RESOURCE OPTIMIZATION
  const optimizeResources = () => {
    // Critical resource hints
    useHead({
      link: [
        // Preload critical CSS
        { rel: 'preload', as: 'style', href: '/_nuxt/entry.css' },
        
        // Prefetch next page resources
        { rel: 'prefetch', href: '/about' },
        { rel: 'prefetch', href: '/pricing' },
        { rel: 'prefetch', href: '/blog' }
      ]
    })
  }

  // 🖼️ IMAGE PERFORMANCE OPTIMIZATION
  const optimizeImageLoading = () => {
    if (process.client) {
      // Implement intersection observer for lazy loading
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.add('fade-in')
              imageObserver.unobserve(img)
            }
          }
        })
      })

      // Apply to all images with data-src
      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img)
      })
    }
  }

  // 📱 MOBILE PERFORMANCE
  const optimizeForMobile = () => {
    if (process.client) {
      // Detect slow connections
      const connection = (navigator as any).connection
      if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
        // Reduce image quality for slow connections
        document.documentElement.classList.add('slow-connection')
      }
    }
  }

  // 🔍 PERFORMANCE AUDIT
  const auditPerformance = async () => {
    const metrics = await measureCoreWebVitals()
    
    const audit = {
      lcp: {
        value: metrics.lcp,
        status: (metrics.lcp || 0) < 2500 ? 'good' : (metrics.lcp || 0) < 4000 ? 'needs-improvement' : 'poor',
        recommendations: (metrics.lcp || 0) > 2500 ? [
          'Preload critical resources',
          'Optimize images',
          'Use CDN for static assets',
          'Minimize server response time'
        ] : []
      },
      fid: {
        value: metrics.fid,
        status: (metrics.fid || 0) < 100 ? 'good' : (metrics.fid || 0) < 300 ? 'needs-improvement' : 'poor',
        recommendations: (metrics.fid || 0) > 100 ? [
          'Minimize JavaScript execution time',
          'Use web workers for heavy tasks',
          'Defer non-critical JavaScript',
          'Optimize event handlers'
        ] : []
      },
      cls: {
        value: metrics.cls,
        status: (metrics.cls || 0) < 0.1 ? 'good' : (metrics.cls || 0) < 0.25 ? 'needs-improvement' : 'poor',
        recommendations: (metrics.cls || 0) > 0.1 ? [
          'Reserve space for images and videos',
          'Avoid inserting content above existing content',
          'Use CSS aspect-ratio for media',
          'Preload custom fonts'
        ] : []
      }
    }

    return audit
  }

  // 🎯 INITIALIZE ALL OPTIMIZATIONS
  const initPerformanceOptimizations = () => {
    optimizeLCP()
    optimizeCLS()
    optimizeResources()
    
    if (process.client) {
      optimizeImageLoading()
      optimizeForMobile()
    }

    return optimizeFID()
  }

  return {
    optimizeLCP,
    optimizeCLS,
    optimizeFID,
    optimizeResources,
    optimizeImageLoading,
    optimizeForMobile,
    measureCoreWebVitals,
    auditPerformance,
    initPerformanceOptimizations
  }
}

// 🚀 LAZY LOADING HELPER
export const useLazyLoading = () => {
  const createLazyImage = (src: string, alt: string, placeholder = '/placeholder.svg') => {
    return {
      'data-src': src,
      src: placeholder,
      alt,
      loading: 'lazy',
      class: 'lazy-image'
    }
  }

  const createLazyComponent = (component: string) => {
    return defineAsyncComponent({
      loader: () => import(`~/components/${component}.vue`),
      loadingComponent: () => h('div', { class: 'skeleton h-32 w-full' }),
      delay: 200,
      timeout: 3000
    })
  }

  return {
    createLazyImage,
    createLazyComponent
  }
}

// 📊 WEB VITALS TRACKING
export const useWebVitalsTracking = () => {
  const trackWebVitals = async () => {
    if (!process.client) return

    // Track and send metrics to analytics
    const sendToAnalytics = (metric: { name: string; value: number; id: string }) => {
      // Send to Google Analytics, PostHog, or your analytics service
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.value),
          non_interaction: true
        })
      }
    }

    // Dynamically import web-vitals if available
    try {
      const webVitals = await import('web-vitals')
      webVitals.getCLS(sendToAnalytics)
      webVitals.getFID(sendToAnalytics)
      webVitals.getFCP(sendToAnalytics)
      webVitals.getLCP(sendToAnalytics)
      webVitals.getTTFB(sendToAnalytics)
    } catch (error) {
      // Fallback if web-vitals is not available
      console.log('Web vitals tracking not available - install web-vitals package for full metrics')
    }
  }

  return { trackWebVitals }
}

// Helper function for analytics
const loadAnalytics = () => {
  // Placeholder for analytics loading
  console.log('Loading analytics...')
} 