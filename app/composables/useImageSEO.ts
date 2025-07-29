export interface ImageSEOOptions {
  src: string
  alt: string
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpg' | 'png'
  loading?: 'lazy' | 'eager'
  priority?: boolean
  sizes?: string
  caption?: string
  credit?: string
}

export const useImageSEO = () => {
  // 🖼️ OPTIMIZED IMAGE GENERATION
  const generateOptimizedImage = (options: ImageSEOOptions) => {
    const {
      src,
      alt,
      width,
      height,
      quality = 80,
      format = 'webp',
      loading = 'lazy',
      priority = false,
      sizes,
      caption,
      credit
    } = options

    // Generate srcset for responsive images
    const generateSrcSet = () => {
      if (!width) return ''
      
      const breakpoints = [320, 640, 768, 1024, 1280, 1920]
      return breakpoints
        .filter(bp => bp <= width)
        .map(bp => {
          const scale = bp / width
          const scaledHeight = height ? Math.round(height * scale) : undefined
          return `${generateImageUrl(src, { width: bp, height: scaledHeight, quality, format })} ${bp}w`
        })
        .join(', ')
    }

    // Generate optimized image URL (placeholder for actual image service)
    const generateImageUrl = (src: string, params: { width?: number; height?: number; quality?: number; format?: string }) => {
      // This would integrate with your image optimization service
      // For now, return the original src
      return src
    }

    // 📊 IMAGE STRUCTURED DATA
    const generateImageSchema = () => {
      if (!caption && !credit) return null

      return {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        contentUrl: src,
        description: alt,
        width: width,
        height: height,
        ...(caption && { caption }),
        ...(credit && { 
          creator: {
            '@type': 'Person',
            name: credit
          }
        })
      }
    }

    // 🚀 PERFORMANCE OPTIMIZATION
    const optimizeForPerformance = () => {
      if (priority) {
        // Preload critical images
        useHead({
          link: [
            {
              rel: 'preload',
              as: 'image',
              href: src,
              type: `image/${format}`
            }
          ]
        })
      }
    }

    return {
      src: generateImageUrl(src, { width, height, quality, format }),
      srcset: generateSrcSet(),
      alt,
      width,
      height,
      loading,
      sizes,
      schema: generateImageSchema(),
      optimize: optimizeForPerformance
    }
  }

  // 🎯 SOCIAL MEDIA IMAGE OPTIMIZATION
  const generateSocialImage = (options: {
    title: string
    description?: string
    background?: string
    logo?: string
  }) => {
    const { title, description, background = '#3b82f6', logo = '/logo.png' } = options
    
    // This would generate dynamic OG images
    // For now, return the static og-image
    return '/og-image.png'
  }

  // 📱 FAVICON OPTIMIZATION
  const generateFavicons = () => {
    return {
      appleTouchIcon: '/favicon/apple-touch-icon.png',
      favicon32: '/favicon/favicon-32x32.png',
      favicon16: '/favicon/favicon-16x16.png',
      manifest: '/favicon/site.webmanifest',
      maskIcon: '/favicon/safari-pinned-tab.svg',
      msIcon: '/favicon/mstile-144x144.png'
    }
  }

  // 🔍 IMAGE ALT TEXT OPTIMIZATION
  const generateOptimizedAltText = (context: {
    mainSubject: string
    action?: string
    setting?: string
    style?: string
    keywords?: string[]
  }) => {
    const { mainSubject, action, setting, style, keywords = [] } = context
    
    let altText = mainSubject
    
    if (action) altText += ` ${action}`
    if (setting) altText += ` in ${setting}`
    if (style) altText += ` (${style})`
    
    // Add relevant keywords naturally
    if (keywords.length > 0) {
      const relevantKeywords = keywords.slice(0, 2) // Limit to 2 keywords
      altText += ` - ${relevantKeywords.join(', ')}`
    }
    
    // Keep under 125 characters for optimal SEO
    return altText.length > 125 ? altText.substring(0, 122) + '...' : altText
  }

  // 🏞️ GALLERY OPTIMIZATION
  const optimizeImageGallery = (images: Array<{
    src: string
    alt: string
    caption?: string
  }>) => {
    // Generate gallery structured data
    const gallerySchema = {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: 'Image Gallery',
      image: images.map(img => ({
        '@type': 'ImageObject',
        contentUrl: img.src,
        description: img.alt,
        ...(img.caption && { caption: img.caption })
      }))
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(gallerySchema)
        }
      ]
    })

    return gallerySchema
  }

  return {
    generateOptimizedImage,
    generateSocialImage,
    generateFavicons,
    generateOptimizedAltText,
    optimizeImageGallery
  }
}

// 🎨 PRODUCT IMAGE SEO HELPER
export const useProductImageSEO = (product: {
  name: string
  images: string[]
  category?: string
  brand?: string
}) => {
  const { generateOptimizedImage, generateOptimizedAltText } = useImageSEO()
  
  const optimizeProductImages = () => {
    return product.images.map((src, index) => {
      const isMainImage = index === 0
      
      const altText = generateOptimizedAltText({
        mainSubject: product.name,
        setting: product.category,
        keywords: product.brand ? [product.brand] : [],
        action: isMainImage ? 'product photo' : `view ${index + 1}`
      })
      
      return generateOptimizedImage({
        src,
        alt: altText,
        priority: isMainImage,
        loading: isMainImage ? 'eager' : 'lazy',
        width: 800,
        height: 800,
        quality: 85
      })
    })
  }
  
  return { optimizeProductImages }
}

// 🖼️ BLOG IMAGE SEO HELPER  
export const useBlogImageSEO = (article: {
  title: string
  category?: string
  author?: string
}) => {
  const { generateOptimizedImage, generateOptimizedAltText } = useImageSEO()
  
  const optimizeFeaturedImage = (src: string) => {
    const altText = generateOptimizedAltText({
      mainSubject: `Featured image for "${article.title}"`,
      setting: article.category,
      keywords: article.author ? [article.author] : []
    })
    
    return generateOptimizedImage({
      src,
      alt: altText,
      priority: true,
      loading: 'eager',
      width: 1200,
      height: 630,
      quality: 85,
      credit: article.author
    })
  }
  
  return { optimizeFeaturedImage }
} 