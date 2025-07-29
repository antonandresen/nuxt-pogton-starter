export interface VoiceSearchOptimization {
  questionKeywords: string[]
  conversationalPhrases: string[]
  localQueries: string[]
  featuredSnippetTargets: string[]
}

export const useVoiceSearchSEO = () => {
  // 🎙️ VOICE SEARCH OPTIMIZATION
  const optimizeForVoiceSearch = (content: {
    title: string
    description: string
    content: string
    location?: string
  }) => {
    const { title, description, content: pageContent, location } = content

    // Generate question-based keywords
    const questionWords = ['what', 'how', 'when', 'where', 'why', 'who', 'which']
    const questionKeywords = questionWords.map(word => 
      `${word} is ${title.toLowerCase()}`
    )

    // Generate conversational phrases
    const conversationalPhrases = [
      `tell me about ${title.toLowerCase()}`,
      `explain ${title.toLowerCase()}`,
      `${title.toLowerCase()} near me`,
      `best ${title.toLowerCase()}`,
      `how to use ${title.toLowerCase()}`
    ]

    // Local voice search optimization
    const localQueries = location ? [
      `${title.toLowerCase()} in ${location}`,
      `${title.toLowerCase()} near ${location}`,
      `find ${title.toLowerCase()} ${location}`,
      `${location} ${title.toLowerCase()}`
    ] : []

    return {
      questionKeywords,
      conversationalPhrases,
      localQueries,
      featuredSnippetTargets: generateFeaturedSnippetTargets(pageContent)
    }
  }

  // 📋 FEATURED SNIPPET OPTIMIZATION
  const generateFeaturedSnippetTargets = (content: string) => {
    // Extract potential featured snippet content
    const snippetPatterns = [
      /^(.*?) is (.*?)\.$/gm, // Definition patterns
      /^(How to .*?)[:.](.*)$/gm, // How-to patterns
      /^(\d+\..*?)$/gm, // Numbered lists
      /^[•\-\*]\s*(.*?)$/gm // Bullet points
    ]

    const targets: string[] = []
    snippetPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern)
      for (const match of matches) {
        if (match[0] && match[0].length < 160) {
          targets.push(match[0].trim())
        }
      }
    })

    return targets.slice(0, 5) // Top 5 targets
  }

  // 🎯 FAQ OPTIMIZATION FOR VOICE SEARCH
  const optimizeFAQsForVoice = (faqs: Array<{
    question: string
    answer: string
  }>) => {
    return faqs.map(faq => ({
      question: optimizeQuestionForVoice(faq.question),
      answer: optimizeAnswerForVoice(faq.answer),
      voiceVariations: generateVoiceVariations(faq.question)
    }))
  }

  const optimizeQuestionForVoice = (question: string) => {
    // Make questions more conversational
    const patterns = [
      { from: /^What is/, to: 'What is' },
      { from: /^How do/, to: 'How do I' },
      { from: /^Can I/, to: 'Can I' },
      { from: /^Will/, to: 'Will' }
    ]

    let optimized = question
    patterns.forEach(pattern => {
      optimized = optimized.replace(pattern.from, pattern.to)
    })

    return optimized
  }

  const optimizeAnswerForVoice = (answer: string) => {
    // Keep answers concise for voice (30-50 words)
    const sentences = answer.split('.')
    if (sentences.length === 0) return answer
    
    let optimized = sentences[0]?.trim() || ''
    if (!optimized) return answer
    
    // Add more sentences if under 30 words
    let wordCount = optimized.split(' ').length
    let sentenceIndex = 1
    
    while (wordCount < 30 && sentenceIndex < sentences.length) {
      const nextSentence = sentences[sentenceIndex]?.trim()
      if (nextSentence) {
        optimized += '. ' + nextSentence
        wordCount += nextSentence.split(' ').length
      }
      sentenceIndex++
    }

    return optimized + '.'
  }

  const generateVoiceVariations = (question: string) => {
    const variations = [
      question.replace(/\?$/, ''),
      `Tell me ${question.toLowerCase().replace(/^(what|how|when|where|why|who)/, '')}`,
      `I want to know ${question.toLowerCase().replace(/\?$/, '')}`,
      question.replace(/^What/, 'What exactly'),
      question.replace(/^How/, 'How exactly')
    ]

    return variations.filter(v => v !== question)
  }

  // 📱 MOBILE VOICE SEARCH OPTIMIZATION
  const optimizeForMobileVoice = () => {
    // Mobile-specific voice search patterns
    const mobilePatterns = [
      'near me',
      'open now',
      'directions to',
      'phone number for',
      'hours for',
      'reviews for'
    ]

    return {
      mobilePatterns,
      generateMobileQueries: (businessName: string, location?: string) => {
        return mobilePatterns.map(pattern => {
          if (location && pattern.includes('near')) {
            return `${businessName} ${pattern.replace('near me', `near ${location}`)}`
          }
          return `${businessName} ${pattern}`
        })
      }
    }
  }

  // 🎵 NATURAL LANGUAGE PROCESSING
  const optimizeForNLP = (content: string) => {
    // Optimize content for NLP understanding
    const nlpOptimizations = {
      // Use entity recognition patterns
      entities: extractEntities(content),
      // Create topic clusters
      topics: extractTopics(content),
      // Generate semantic keywords
      semanticKeywords: generateSemanticKeywords(content)
    }

    return nlpOptimizations
  }

  const extractEntities = (content: string) => {
    // Simple entity extraction (in production, use proper NLP library)
    const patterns = {
      dates: /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/g,
      emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phones: /\b\d{3}-\d{3}-\d{4}\b|\b\(\d{3}\)\s*\d{3}-\d{4}\b/g,
      urls: /https?:\/\/[^\s]+/g
    }

    const entities: Record<string, string[]> = {}
    Object.entries(patterns).forEach(([type, pattern]) => {
      entities[type] = content.match(pattern) || []
    })

    return entities
  }

  const extractTopics = (content: string) => {
    // Extract main topics from content
    const words = content.toLowerCase().split(/\W+/)
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])
    
    const wordCount: Record<string, number> = {}
    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1
      }
    })

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
  }

  const generateSemanticKeywords = (content: string) => {
    // Generate semantic variations of main keywords
    const mainTopics = extractTopics(content)
    const semanticVariations: string[] = []

    mainTopics.forEach(topic => {
      // Add common variations
      semanticVariations.push(
        `${topic} guide`,
        `${topic} tutorial`,
        `${topic} tips`,
        `${topic} benefits`,
        `${topic} examples`,
        `how to ${topic}`,
        `best ${topic}`,
        `${topic} vs`,
        `${topic} comparison`
      )
    })

    return semanticVariations.slice(0, 20)
  }

  return {
    optimizeForVoiceSearch,
    optimizeFAQsForVoice,
    optimizeForMobileVoice,
    optimizeForNLP,
    generateFeaturedSnippetTargets
  }
} 