<template>
  <Dialog :open="isOpen" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Password Reset Link Sent</DialogTitle>
        <DialogDescription>
          We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
        </DialogDescription>
      </DialogHeader>
      <div class="flex items-center space-x-2">
        <div class="grid flex-1 gap-2">
          <p class="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or try again.
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button @click="$emit('update:open', false)">
          Got it
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  'update:open': [value: boolean]
}>()
</script>