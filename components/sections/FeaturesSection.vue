<template>
  <section id="features" class="relative py-24 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5" />
    <div class="absolute right-0 top-1/4 -translate-y-1/2 w-1/2 aspect-square bg-primary/10 rounded-full blur-3xl" />
    <div class="absolute left-0 bottom-1/4 translate-y-1/2 w-1/2 aspect-square bg-secondary/10 rounded-full blur-3xl" />

    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Features that empower your team
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          Everything you need to manage your business, boost productivity, and grow faster.
        </p>
      </div>

      <!-- Feature Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card
v-for="feature in features" :key="feature.title" 
          class="group relative overflow-hidden transition-all hover:shadow-lg"
          :class="{ 'md:col-span-2 lg:col-span-1': feature.highlight }"
        >
        <CardHeader>
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <component :is="feature.icon" class="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{{ feature.title }}</CardTitle>
                <CardDescription>{{ feature.description }}</CardDescription>
              </div>
            </div>
        </CardHeader>
          <CardContent class="space-y-4">
            <ul class="space-y-2">
              <li v-for="item in feature.items" :key="item" class="flex items-start gap-2">
                <CheckCircle2 class="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span class="text-sm">{{ item }}</span>
              </li>
            </ul>

            <div class="pt-4">
              <Button variant="ghost" class="group-hover:translate-x-1 transition-transform">
                Learn more
                <ArrowRight class="ml-2 h-4 w-4" />
              </Button>
            </div>
        </CardContent>

          <!-- Decorative corner gradient -->
          <div class="absolute right-0 top-0 -z-10 h-24 w-24 rounded-bl-full bg-primary/10 transition-all group-hover:scale-150" />
      </Card>
      </div>

      <!-- Integration Logos -->
      <div class="mt-24">
        <p class="text-center text-sm font-medium text-muted-foreground mb-8">
          Trusted by leading companies worldwide
        </p>
        <div class="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
          <div v-for="i in 5" :key="i" class="col-span-1 flex justify-center">
            <div class="h-8 w-32 rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { 
  LayoutDashboard, 
  Users, 
  LineChart, 
  Shield, 
  Zap,
  Database,
  CheckCircle2,
  ArrowRight
} from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const features = [
  {
    title: 'Analytics Dashboard',
    description: 'Get real-time insights into your business',
    icon: LineChart,
    highlight: true,
    items: [
      'Real-time data visualization',
      'Custom reports and dashboards',
      'Performance metrics tracking',
      'Export and share insights'
    ]
  },
  {
    title: 'Team Management',
    description: 'Streamline your team operations',
    icon: Users,
    items: [
      'Role-based access control',
      'Team collaboration tools',
      'Task assignment and tracking',
      'Performance analytics'
    ]
  },
  {
    title: 'Advanced Security',
    description: 'Enterprise-grade security features',
    icon: Shield,
    items: [
      'Two-factor authentication',
      'End-to-end encryption',
      'Regular security audits',
      'Compliance monitoring'
    ]
  },
  {
    title: 'Automation Tools',
    description: 'Save time with smart automation',
    icon: Zap,
    items: [
      'Workflow automation',
      'Scheduled tasks',
      'Integration capabilities',
      'Custom triggers'
    ]
  },
  {
    title: 'Smart Integrations',
    description: 'Connect with your favorite tools',
    icon: Database,
    items: [
      'API access',
      'Third-party integrations',
      'Custom webhooks',
      'Data synchronization'
    ]
  },
  {
    title: 'Powerful Dashboard',
    description: 'Everything in one place',
    icon: LayoutDashboard,
    items: [
      'Customizable widgets',
      'Drag-and-drop interface',
      'Dark/light mode',
      'Mobile responsive'
    ]
  }
]
</script>

<style scoped>
/* Styles for Features Section */
</style>