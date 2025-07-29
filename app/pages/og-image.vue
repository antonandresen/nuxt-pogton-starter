<template>
  <div class="og-container">
    <!-- Main Content -->
    <div class="og-content">
      <!-- Background Pattern -->
      <div class="bg-pattern"/>
      
      <!-- Content Grid -->
      <div class="content-grid">
        <!-- Left Side - Logo and Branding -->
        <div class="branding-section">
          <div class="logo-container">
            <img src="/logo.png" alt="Pogton Logo" class="logo" >
          </div>
          <div class="company-info">
            <h1 class="company-name">Pogton</h1>
            <h2 class="company-subtitle">Starter</h2>
            <p class="tagline">The Ultimate Nuxt.js SaaS Starter Kit</p>
          </div>
        </div>
        
        <!-- Right Side - Features -->
        <div class="features-section">
          <div class="feature-item">
            <div class="feature-icon auth-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V2H9V4L3 7V9H21Z" fill="currentColor" fill-opacity="0.3"/>
                <path d="M12 7L18.64 9.35C18.84 9.42 19 9.61 19 9.83V12.17C19 12.39 18.84 12.58 18.64 12.65L12 15L5.36 12.65C5.16 12.58 5 12.39 5 12.17V9.83C5 9.61 5.16 9.42 5.36 9.35L12 7Z" fill="currentColor"/>
              </svg>
            </div>
            <span class="feature-text">Auth & Security</span>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon payment-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="4" width="22" height="16" rx="2" fill="currentColor" fill-opacity="0.3"/>
                <path d="m1 10 22 0" stroke="currentColor" stroke-width="2"/>
                <path d="M7 15h.01" fill="currentColor"/>
                <path d="M11 15h2" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="feature-text">Stripe Payments</span>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon ui-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" fill-opacity="0.3"/>
                <path d="M9 9h6v6H9z" fill="currentColor"/>
                <path d="M6 6h.01" fill="currentColor"/>
                <path d="M6 18h.01" fill="currentColor"/>
                <path d="M18 6h.01" fill="currentColor"/>
                <path d="M18 18h.01" fill="currentColor"/>
              </svg>
            </div>
            <span class="feature-text">Modern UI/UX</span>
          </div>
        </div>
      </div>
      
      <!-- Bottom Section -->
      <div class="bottom-section">
        <div class="companies-info">
          <span class="companies-text">Includes: Nuxt 4 • Drizzle • Tailwind • Shadcn/ui</span>
        </div>
        <div class="founder-info">
          <span class="founder-text">Ready for Production</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Disable layout for clean screenshot
definePageMeta({
  layout: false
})

// Prevent indexing
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.og-container {
  width: 1200px;
  height: 630px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1e3a8a 100%);
  font-family: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.og-content {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
  z-index: 1;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  flex: 1;
}

.branding-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  backdrop-filter: blur(10px);
}

.company-info {
  color: white;
}

.company-name {
  font-size: 72px;
  font-weight: 800;
  line-height: 0.9;
  margin: 0;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.company-subtitle {
  font-size: 72px;
  font-weight: 800;
  line-height: 0.9;
  margin: 0;
  color: #93c5fd;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.tagline {
  font-size: 24px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin: 20px 0 0 0;
  line-height: 1.3;
}

.features-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: flex-start;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 32px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 280px;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.auth-icon {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.payment-icon {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
}

.ui-icon {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.feature-text {
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.bottom-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.companies-info,
.founder-info {
  color: rgba(255, 255, 255, 0.8);
}

.companies-text,
.founder-text {
  font-size: 18px;
  font-weight: 500;
}

/* Decorative Elements */
.og-container::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
}

.og-container::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(147, 197, 253, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
}
</style> 