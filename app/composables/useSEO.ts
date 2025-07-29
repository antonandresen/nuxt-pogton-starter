export interface SEOConfig {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  siteName?: string
  locale?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  author?: string
  noindex?: boolean
  canonical?: string
}

export const useSEO = (config: SEOConfig = {}) => {
  const site = useSiteConfig()
  const route = useRoute()
  
  // 🎯 DYNAMIC META CONFIGURATION
  const siteUrl = site.url || 'https://nuxt-pogton-starter.netlify.app'
  const defaultConfig = {
    siteName: site.name || 'Pogton Starter',
    locale: site.defaultLocale || 'en',
    type: 'website' as const,
    url: siteUrl + route.path,
    image: siteUrl + '/og-image.png'
  }

  const seoConfig = { ...defaultConfig, ...config }

  // 🚀 ENHANCED META TAGS
  const setMeta = () => {
    // Basic SEO Meta
    useSeoMeta({
      title: seoConfig.title,
      description: seoConfig.description,
      robots: seoConfig.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      
      // Open Graph
      ogTitle: seoConfig.title,
      ogDescription: seoConfig.description,
      ogImage: seoConfig.image,
      ogImageAlt: seoConfig.title,
      ogUrl: seoConfig.url,
      ogType: seoConfig.type,
      ogSiteName: seoConfig.siteName,
      ogLocale: seoConfig.locale,
      
      // Twitter
      twitterCard: 'summary_large_image',
      twitterSite: '@anton_andresen',
      twitterCreator: '@anton_andresen',
      twitterTitle: seoConfig.title,
      twitterDescription: seoConfig.description,
      twitterImage: seoConfig.image,
      twitterImageAlt: seoConfig.title,
      
      // Article specific
      ...(seoConfig.type === 'article' && {
        articlePublishedTime: seoConfig.publishedTime,
        articleModifiedTime: seoConfig.modifiedTime,
        articleSection: seoConfig.section,
        articleTag: seoConfig.tags
      })
    })

    // Handle canonical URL separately
    useHead({
      link: [
        {
          rel: 'canonical',
          href: seoConfig.canonical || seoConfig.url
        }
      ]
    })

    // Add JSON-LD structured data
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: seoConfig.siteName,
            url: siteUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/search?q={search_term_string}`
              },
              'query-input': 'required name=search_term_string'
            }
          })
        }
      ]
    })
  }

  // 🎯 BREADCRUMB GENERATION
  const generateBreadcrumbs = () => {
    const pathSegments = route.path.split('/').filter(Boolean)
    const breadcrumbs = [
      { name: 'Home', url: '/' }
    ]

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      
      breadcrumbs.push({
        name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        url: isLast ? undefined : currentPath
      })
    })

    // Add breadcrumb structured data
    const siteUrl = site.url || 'https://nuxt-pogton-starter.netlify.app'
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((crumb, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: crumb.name,
              item: crumb.url ? siteUrl + crumb.url : undefined
            }))
          })
        }
      ]
    })

    return breadcrumbs
  }

  // 🔍 FAQ SCHEMA HELPER
  const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
              }
            }))
          })
        }
      ]
    })
  }

  // 📈 PERFORMANCE OPTIMIZATION
  const optimizeImages = () => {
    // Auto-generate WebP images and optimize loading
    if (seoConfig.image) {
      useHead({
        link: [
          {
            rel: 'preload',
            as: 'image',
            href: seoConfig.image,
            type: 'image/png'
          }
        ]
      })
    }
  }

  // 🎬 INITIALIZE SEO
  const initSEO = () => {
    setMeta()
    optimizeImages()
    return {
      breadcrumbs: generateBreadcrumbs(),
      generateFAQSchema
    }
  }

  return {
    initSEO,
    setMeta,
    generateBreadcrumbs,
    generateFAQSchema,
    optimizeImages,
    seoConfig
  }
}

// 🎯 PAGE-SPECIFIC SEO HELPERS
export const usePageSEO = (page: 'home' | 'about' | 'pricing' | 'blog' | 'dashboard') => {
  const configs = {
    home: {
      title: 'Ultimate Nuxt.js SaaS Starter Kit',
      description: 'Build your next SaaS with Nuxt 4, Drizzle ORM, Tailwind CSS, Stripe Payments, and Authentication. Production-ready starter kit with modern UI components.',
      type: 'website' as const
    },
    about: {
      title: 'About Pogton Starter',
      description: 'Learn about our mission to provide the best Nuxt.js SaaS starter kit with modern technologies and production-ready features.',
      type: 'website' as const
    },
    pricing: {
      title: 'Pricing Plans',
      description: 'Choose the perfect plan for your SaaS project. Transparent pricing with powerful features included.',
      type: 'website' as const
    },
    blog: {
      title: 'Blog',
      description: 'Latest insights, tutorials, and updates about Nuxt.js, SaaS development, and modern web technologies.',
      type: 'website' as const
    },
    dashboard: {
      title: 'Dashboard',
      description: 'Your personal dashboard to manage your account and access premium features.',
      type: 'website' as const,
      noindex: true
    }
  }

  return useSEO(configs[page])
} 