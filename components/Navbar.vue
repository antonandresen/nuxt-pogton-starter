<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto">
      <!-- Mobile Navigation -->
      <div class="flex items-center justify-between py-4 md:hidden">
        <NuxtLink to="/" class="text-xl font-bold">
          MyCompany
        </NuxtLink>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu class="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" class="w-[300px] overflow-y-auto">
              <nav class="flex flex-col gap-6">
                <div v-for="item in mainNavItems" :key="item.title" class="space-y-3">
                  <h4 class="font-medium">{{ item.title }}</h4>
                  <div v-if="item.items?.length" class="pl-3 space-y-2">
                    <NuxtLink
                      v-for="subItem in item.items"
                      :key="subItem.title"
                      :to="subItem.href"
                      class="block text-sm text-muted-foreground hover:text-primary"
                    >
                      <div class="font-medium">{{ subItem.title }}</div>
                      <p class="text-xs text-muted-foreground">{{ subItem.description }}</p>
                    </NuxtLink>
                  </div>
                  <NuxtLink
                    v-else
                    :to="item.href"
                    class="block pl-3 text-sm text-muted-foreground hover:text-primary"
                  >
                    View Pricing
                  </NuxtLink>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center justify-between py-4">
        <NuxtLink to="/" class="text-xl font-bold">
          MyCompany
        </NuxtLink>
        
        <div class="flex items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem v-for="item in mainNavItems" :key="item.title">
                <NavigationMenuTrigger v-if="item.items?.length">
                  {{ item.title }}
                </NavigationMenuTrigger>
                <NavigationMenuLink v-else :href="item.href" class="px-4 py-2">
                  {{ item.title }}
                </NavigationMenuLink>

                <NavigationMenuContent v-if="item.items?.length">
                  <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li v-for="subItem in item.items" :key="subItem.title">
                      <NavigationMenuLink asChild>
                        <a
                          class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          :href="subItem.href"
                        >
                          <div class="text-sm font-medium leading-none">{{ subItem.title }}</div>
                          <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {{ subItem.description }}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-vue-next'
import ThemeToggle from './ThemeToggle.vue'

const mainNavItems = [
  {
    title: 'Features',
    href: '#features',
    items: [
      {
        title: 'Analytics',
        description: 'Get detailed insights into your business performance',
        href: '#features/analytics',
      },
      {
        title: 'Security',
        description: 'Keep your data safe and secure with our enterprise solutions',
        href: '#features/security',
      },
      {
        title: 'Automation',
        description: 'Automate your workflow and save time',
        href: '#features/automation',
      },
      {
        title: 'Integrations',
        description: 'Connect with your favorite tools and services',
        href: '#features/integrations',
      },
    ],
  },
  {
    title: 'Pricing',
    href: '#pricing',
  },
  {
    title: 'Resources',
    items: [
      {
        title: 'Documentation',
        description: 'Learn how to integrate and use our products',
        href: '/docs',
      },
      {
        title: 'Blog',
        description: 'Latest updates and industry insights',
        href: '/blog',
      },
      {
        title: 'Support',
        description: '24/7 customer support for all your needs',
        href: '/support',
      },
    ],
  },
  {
    title: 'Company',
    items: [
      {
        title: 'About Us',
        description: 'Learn about our mission and values',
        href: '/about',
      },
      {
        title: 'Careers',
        description: 'Join our team and make an impact',
        href: '/careers',
      },
      {
        title: 'Contact',
        description: 'Get in touch with our team',
        href: '/contact',
      },
    ],
  },
]
</script>

<style scoped>
/* Add Navbar styles here */
</style>