<template>
  <ClientOnly>
    <Teleport to="body">
      <div
        v-if="shouldShow"
        class="fixed inset-x-0 bottom-0 z-50"
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent"
      >
        <div class="container mx-auto px-4 pb-6">
          <div class="rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur sm:p-6">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div class="space-y-1 text-sm text-muted-foreground">
                <p class="text-foreground font-medium">We use cookies</p>
                <p>
                  We use necessary cookies to run the site. Optional analytics and marketing cookies are
                  off until you consent. Read our
                  <NuxtLink to="/cookie-policy" class="text-primary hover:underline">Cookie Policy</NuxtLink>.
                </p>
              </div>
              <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Button class="w-full sm:w-auto" variant="outline" @click="deny">
                  Deny
                </Button>
                <Button class="w-full sm:w-auto" variant="secondary" @click="acceptNecessary">
                  Necessary only
                </Button>
                <Button class="w-full sm:w-auto" @click="acceptAll">
                  Accept all
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useCookieConsent } from '~/composables/useCookieConsent'

const { shouldShow, acceptAll, acceptNecessary, deny } = useCookieConsent()
</script>

