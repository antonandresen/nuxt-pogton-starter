<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Update Your Avatar</DialogTitle>
        <DialogDescription>
          Enter a URL for your avatar image or use your Gravatar
        </DialogDescription>
      </DialogHeader>
      
      <div class="space-y-4 py-4">
        <!-- Current Avatar Preview -->
        <div class="flex justify-center">
          <Avatar class="h-24 w-24">
            <AvatarImage :src="previewUrl" :alt="currentUser?.email" />
            <AvatarFallback class="text-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              {{ currentUser?.email?.charAt(0).toUpperCase() }}
            </AvatarFallback>
          </Avatar>
        </div>

        <!-- Avatar URL Input -->
        <div class="space-y-2">
          <Label for="avatar-url">Avatar URL</Label>
          <Input
            id="avatar-url"
            v-model="avatarUrl"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            @input="updatePreview"
          />
          <p class="text-xs text-muted-foreground">
            Enter a URL to a custom avatar image
          </p>
        </div>

        <!-- Gravatar Info -->
        <div class="rounded-lg border bg-muted/50 p-3">
          <div class="flex items-start gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <span class="text-lg">ℹ️</span>
            </div>
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium">Using Gravatar</p>
              <p class="text-xs text-muted-foreground">
                Leave empty to use your Gravatar associated with <strong>{{ currentUser?.email }}</strong>.
                <a href="https://gravatar.com" target="_blank" rel="noopener" class="text-primary hover:underline">
                  Create one here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter class="gap-2">
        <Button
          variant="outline"
          @click="clearAvatar"
          :disabled="isLoading"
        >
          Use Gravatar
        </Button>
        <Button
          @click="saveAvatar"
          :disabled="isLoading"
        >
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-vue-next'
import { api, useConvexMutation, useConvexQuery } from '~/composables/useConvex'
import { getAvatarUrl } from '@/utils/gravatar'
import { toast } from 'vue-sonner'

interface Props {
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { data: currentUser } = useConvexQuery(api.users.getCurrent, {})
const updateAvatarMutation = useConvexMutation(api.users.updateAvatarForCurrentUser)

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const avatarUrl = ref('')
const isLoading = ref(false)

// Initialize with current avatar
watch(() => props.open, (open) => {
  if (open && currentUser.value) {
    avatarUrl.value = currentUser.value.avatar || ''
  }
})

const previewUrl = computed(() => {
  if (avatarUrl.value) {
    return avatarUrl.value
  }
  return currentUser.value ? getAvatarUrl(currentUser.value.email, undefined, 200) : ''
})

const updatePreview = () => {
  // Preview is reactive through computed property
}

const saveAvatar = async () => {
  if (!currentUser.value) return
  
  isLoading.value = true
  try {
    await updateAvatarMutation.mutate({
      avatar: avatarUrl.value || undefined
    })
    toast.success('Avatar updated successfully!')
    isOpen.value = false
  } catch (error) {
    console.error('Failed to update avatar:', error)
    toast.error('Failed to update avatar')
  } finally {
    isLoading.value = false
  }
}

const clearAvatar = async () => {
  avatarUrl.value = ''
  await saveAvatar()
}
</script>
