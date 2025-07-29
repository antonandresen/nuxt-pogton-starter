<template>
  <footer class="border-t bg-background">
    <div class="container mx-auto px-4 py-12">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <!-- Brand Section -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <img src="/logo.png" alt="Pogton Logo" class="h-6 w-6 object-contain" />
            <span class="text-xl font-bold">Pogton</span>
          </div>
          <p class="text-sm text-muted-foreground">
            Building the future of web development, one component at a time.
          </p>
          <div class="flex space-x-4">
            <Button variant="ghost" size="icon">
              <a href="https://twitter.com/antonandresen" target="_blank" rel="noopener noreferrer">
                <Twitter class="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon">
              <a href="https://github.com/antonandresen/nuxt-pogton-starter" target="_blank" rel="noopener noreferrer">
                <Github class="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon">
              <a href="https://linkedin.com/in/antonandresen" target="_blank" rel="noopener noreferrer">
                <Linkedin class="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>

        <!-- Product Links -->
        <div>
          <h3 class="text-sm font-semibold mb-4">Product</h3>
          <ul class="space-y-3 text-sm text-muted-foreground">
            <li><a href="#features" class="hover:text-primary">Features</a></li>
            <li><a href="#pricing" class="hover:text-primary">Pricing</a></li>
            <li><a href="#testimonials" class="hover:text-primary">Testimonials</a></li>
            <li><a href="#faq" class="hover:text-primary">FAQ</a></li>
          </ul>
        </div>

        <!-- Company Links -->
        <div>
          <h3 class="text-sm font-semibold mb-4">Company</h3>
          <ul class="space-y-3 text-sm text-muted-foreground">
            <li><a href="/about" class="hover:text-primary">About</a></li>
            <li><a href="/blog" class="hover:text-primary">Blog</a></li>
            <li><a href="/careers" class="hover:text-primary">Careers</a></li>
            <li><a href="/contact" class="hover:text-primary">Contact</a></li>
          </ul>
        </div>

        <!-- Newsletter Section -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold">Stay up to date</h3>
          <p class="text-sm text-muted-foreground">
            Get the latest updates and news straight to your inbox.
          </p>
          <div class="flex space-x-2">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              class="max-w-[200px]"
            />
            <Button>
              Subscribe
              <ArrowRight class="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 pt-8 border-t">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-sm text-muted-foreground">
            © {{ new Date().getFullYear() }} Pogton. All rights reserved.
          </p>
          <div class="flex items-center space-x-4 text-sm text-muted-foreground">
            <a href="/privacy-policy" class="hover:text-primary">Privacy</a>
            <a href="/terms-of-service" class="hover:text-primary">Terms</a>
            <a href="/cookie-policy" class="hover:text-primary">Cookies</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowRight, 
  Twitter, 
  Github, 
  Linkedin 
} from 'lucide-vue-next'
</script>

<style>

</style>