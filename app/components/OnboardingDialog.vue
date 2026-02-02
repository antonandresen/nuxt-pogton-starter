<template>
  <Dialog :open="shouldShowDialog" @update:open="() => {}">
    <DialogContent 
      class="max-w-2xl max-h-[90vh] overflow-y-auto p-0" 
      :show-close="false"
      @interact-outside="(e: Event) => e.preventDefault()"
      @escape-key-down="(e: Event) => e.preventDefault()"
    >
      <div class="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 border-b">
        <DialogHeader>
          <DialogTitle class="text-3xl font-bold">Welcome to Pogton</DialogTitle>
          <DialogDescription class="text-base mt-2">Let's get your workspace set up in just a few steps.</DialogDescription>
        </DialogHeader>
      </div>

      <div class="p-6 space-y-8">
        <Stepper :model-value="currentStep" class="w-full gap-2">
          <StepperItem v-for="(step, index) in steps" :key="step.key" :step="index" class="relative flex-1">
            <StepperTrigger 
              class="flex flex-col items-center gap-2 group"
              :class="{ 'cursor-default': true }"
            >
              <div 
                class="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all"
                :class="{
                  'bg-primary border-primary text-primary-foreground': index <= currentStep,
                  'bg-muted border-muted-foreground/25 text-muted-foreground': index > currentStep
                }"
              >
                <Check v-if="index < currentStep" class="h-5 w-5" />
                <span v-else class="text-sm font-semibold">{{ index + 1 }}</span>
              </div>
              <div class="text-center">
                <StepperTitle 
                  class="text-sm font-medium transition-colors"
                  :class="{
                    'text-foreground': index <= currentStep,
                    'text-muted-foreground': index > currentStep
                  }"
                >
                  {{ step.title }}
                </StepperTitle>
                <StepperDescription 
                  class="hidden sm:block text-xs mt-0.5"
                  :class="{
                    'text-muted-foreground': index <= currentStep,
                    'text-muted-foreground/60': index > currentStep
                  }"
                >
                  {{ step.description }}
                </StepperDescription>
              </div>
            </StepperTrigger>
            <div 
              v-if="index < steps.length - 1"
              class="absolute left-[calc(50%+20px)] right-[calc(-50%+20px)] top-5 h-0.5 -translate-y-1/2"
              :class="{
                'bg-primary': index < currentStep,
                'bg-muted': index >= currentStep
              }"
            />
          </StepperItem>
        </Stepper>

        <div class="min-h-[280px]">
          <div v-if="currentStep === 0" class="space-y-5">
            <div class="space-y-2">
              <Label for="name" class="text-sm font-medium">
                Your name <span class="text-destructive">*</span>
              </Label>
              <Input 
                id="name" 
                v-model="form.name" 
                placeholder="Jane Doe"
                :class="{ 'border-destructive': errors.name }"
                @input="errors.name = ''"
              />
              <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
            </div>
            <div class="space-y-2">
              <Label for="role" class="text-sm font-medium">
                Role <span class="text-destructive">*</span>
              </Label>
              <Select v-model="form.role" @update:model-value="errors.role = ''">
                <SelectTrigger id="role" :class="{ 'border-destructive': errors.role }">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="founder">Founder</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <p v-if="errors.role" class="text-sm text-destructive">{{ errors.role }}</p>
            </div>
          </div>

          <div v-else-if="currentStep === 1" class="space-y-5">
            <div class="space-y-2">
              <Label for="orgName" class="text-sm font-medium">
                Workspace name <span class="text-destructive">*</span>
              </Label>
              <Input 
                id="orgName" 
                v-model="form.orgName" 
                placeholder="Acme Inc."
                :class="{ 'border-destructive': errors.orgName }"
                @input="errors.orgName = ''"
              />
              <p v-if="errors.orgName" class="text-sm text-destructive">{{ errors.orgName }}</p>
              <p v-else class="text-sm text-muted-foreground">Give your workspace a memorable name.</p>
            </div>
            <div class="space-y-2">
              <Label for="website" class="text-sm font-medium">Website (optional)</Label>
              <Input 
                id="website" 
                v-model="form.website" 
                placeholder="https://acme.com"
                type="url"
              />
              <p class="text-sm text-muted-foreground">Your company or project website.</p>
            </div>
          </div>

          <div v-else-if="currentStep === 2" class="space-y-5">
            <div class="space-y-2">
              <Label for="useCase" class="text-sm font-medium">
                Primary goal <span class="text-destructive">*</span>
              </Label>
              <Textarea 
                id="useCase" 
                v-model="form.useCase" 
                placeholder="What are you trying to achieve?"
                rows="4"
                :class="{ 'border-destructive': errors.useCase }"
                @input="errors.useCase = ''"
              />
              <p v-if="errors.useCase" class="text-sm text-destructive">{{ errors.useCase }}</p>
              <p v-else class="text-sm text-muted-foreground">Help us understand what you're building.</p>
            </div>
            <div class="space-y-2">
              <Label for="teamSize" class="text-sm font-medium">
                Team size <span class="text-destructive">*</span>
              </Label>
              <Select v-model="form.teamSize" @update:model-value="errors.teamSize = ''">
                <SelectTrigger id="teamSize" :class="{ 'border-destructive': errors.teamSize }">
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Just me</SelectItem>
                  <SelectItem value="2-5">2-5 people</SelectItem>
                  <SelectItem value="6-15">6-15 people</SelectItem>
                  <SelectItem value="16-50">16-50 people</SelectItem>
                  <SelectItem value="50+">50+ people</SelectItem>
                </SelectContent>
              </Select>
              <p v-if="errors.teamSize" class="text-sm text-destructive">{{ errors.teamSize }}</p>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div class="rounded-lg border bg-muted/50 p-4">
              <div class="text-sm font-medium text-muted-foreground mb-1">Name</div>
              <div class="text-base">{{ form.name }}</div>
            </div>
            <div class="rounded-lg border bg-muted/50 p-4">
              <div class="text-sm font-medium text-muted-foreground mb-1">Role</div>
              <div class="text-base capitalize">{{ form.role }}</div>
            </div>
            <div class="rounded-lg border bg-muted/50 p-4">
              <div class="text-sm font-medium text-muted-foreground mb-1">Workspace</div>
              <div class="text-base">{{ form.orgName }}</div>
            </div>
            <div v-if="form.website" class="rounded-lg border bg-muted/50 p-4">
              <div class="text-sm font-medium text-muted-foreground mb-1">Website</div>
              <div class="text-base">{{ form.website }}</div>
            </div>
            <div class="rounded-lg border bg-muted/50 p-4">
              <div class="text-sm font-medium text-muted-foreground mb-1">Goal</div>
              <div class="text-base">{{ form.useCase }}</div>
            </div>
            <div class="rounded-lg border bg-muted/50 p-4">
              <div class="text-sm font-medium text-muted-foreground mb-1">Team size</div>
              <div class="text-base">{{ form.teamSize }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t bg-muted/30 p-6">
        <div class="flex items-center justify-between">
          <Button 
            variant="ghost" 
            :disabled="currentStep === 0" 
            @click="prevStep"
            class="gap-2"
          >
            <ChevronLeft class="h-4 w-4" />
            Back
          </Button>
          <div class="flex items-center gap-3">
            <span class="text-sm text-muted-foreground">
              Step {{ currentStep + 1 }} of {{ steps.length }}
            </span>
            <Button :disabled="isSaving" @click="nextStep" class="gap-2">
              <Loader2 v-if="isSaving" class="h-4 w-4 animate-spin" />
              {{ currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue' }}
              <ChevronRight v-if="currentStep !== steps.length - 1" class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import { useToast } from '@/components/ui/toast/use-toast'
import { Loader2, ChevronLeft, ChevronRight, Check } from 'lucide-vue-next'
import { useOnboarding } from '@/composables/useOnboarding'
import { api, useConvexQuery } from '@/composables/useConvex'

const { toast } = useToast()
const { onboarding, isHydrated, update } = useOnboarding()
const { data: appSettings } = useConvexQuery(api.appSettings.getPublic, {})
const route = useRoute()
const isSaving = ref(false)

const errors = reactive({
  name: '',
  role: '',
  orgName: '',
  useCase: '',
  teamSize: '',
})

const steps = [
  { key: 'profile', title: 'Profile', description: 'Tell us about you' },
  { key: 'workspace', title: 'Workspace', description: 'Set up your team' },
  { key: 'goals', title: 'Goals', description: 'Define your focus' },
  { key: 'review', title: 'Review', description: 'Confirm details' },
]

const currentStep = ref(0)

const form = reactive({
  name: '',
  role: '',
  orgName: '',
  website: '',
  useCase: '',
  teamSize: '',
})

// Only show dialog if:
// 1. Data has been hydrated (prevents flash during initial load)
// 2. We're on a dashboard route (not the onboarding page itself)
// 3. Onboarding is enabled in app settings
// 4. User hasn't completed onboarding
const shouldShowDialog = computed(() => {
  // Don't show anything until we have real data from the server
  if (!isHydrated.value) return false
  
  const isDashboard = route.path.startsWith('/dashboard')
  const isOnboardingPage = route.path === '/dashboard/onboarding'
  const onboardingEnabled = appSettings.value?.onboardingEnabled ?? true
  const isCompleted = onboarding.value?.completed ?? false

  return isDashboard && !isOnboardingPage && onboardingEnabled && !isCompleted
})

watchEffect(() => {
  const data = onboarding.value?.data as Record<string, string> | undefined
  if (!data) return
  form.name = data.name ?? form.name
  form.role = data.role ?? form.role
  form.orgName = data.orgName ?? form.orgName
  form.website = data.website ?? form.website
  form.useCase = data.useCase ?? form.useCase
  form.teamSize = data.teamSize ?? form.teamSize
})

const validateStep = () => {
  // Clear previous errors
  errors.name = ''
  errors.role = ''
  errors.orgName = ''
  errors.useCase = ''
  errors.teamSize = ''

  if (currentStep.value === 0) {
    if (!form.name.trim()) {
      errors.name = 'Please enter your name'
      return false
    }
    if (!form.role.trim()) {
      errors.role = 'Please select your role'
      return false
    }
    return true
  }
  
  if (currentStep.value === 1) {
    if (!form.orgName.trim()) {
      errors.orgName = 'Please enter a workspace name'
      return false
    }
    return true
  }
  
  if (currentStep.value === 2) {
    if (!form.useCase.trim()) {
      errors.useCase = 'Please describe your primary goal'
      return false
    }
    if (!form.teamSize.trim()) {
      errors.teamSize = 'Please select your team size'
      return false
    }
    return true
  }
  
  return true
}

const persist = async (completed: boolean) => {
  const completedSteps = steps
    .slice(0, completed ? steps.length : currentStep.value + 1)
    .map((step) => step.key)
  await update(completedSteps, completed, { ...form })
}

const nextStep = async () => {
  if (!validateStep()) {
    return
  }

  isSaving.value = true
  try {
    const isLast = currentStep.value === steps.length - 1
    await persist(isLast)
    if (isLast) {
      toast({ 
        title: 'Welcome aboard!', 
        description: 'Your workspace is ready to use.' 
      })
      return
    }
    currentStep.value += 1
  } catch (error) {
    toast({ 
      title: 'Error', 
      description: 'Failed to save onboarding info.', 
      variant: 'destructive' 
    })
  } finally {
    isSaving.value = false
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value -= 1
  }
}
</script>
