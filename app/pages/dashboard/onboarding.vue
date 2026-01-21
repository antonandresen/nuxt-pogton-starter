<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Welcome</h2>
      <p class="text-muted-foreground">Answer a few questions to personalize your workspace.</p>
    </div>

    <Stepper :model-value="currentStep" class="w-full">
      <StepperItem v-for="(step, index) in steps" :key="step.key" :step="index">
        <StepperTrigger>
          <StepperTitle>{{ step.title }}</StepperTitle>
          <StepperDescription>{{ step.description }}</StepperDescription>
        </StepperTrigger>
      </StepperItem>
    </Stepper>

    <Card>
      <CardContent class="space-y-6 pt-6">
        <div v-if="currentStep === 0" class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Your name</Label>
            <Input id="name" v-model="form.name" placeholder="Jane Doe" />
          </div>
          <div class="space-y-2">
            <Label for="role">Role</Label>
            <Select v-model="form.role">
              <SelectTrigger id="role">
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
          </div>
        </div>

        <div v-else-if="currentStep === 1" class="space-y-4">
          <div class="space-y-2">
            <Label for="orgName">Workspace name</Label>
            <Input id="orgName" v-model="form.orgName" placeholder="Acme Inc." />
          </div>
          <div class="space-y-2">
            <Label for="website">Website</Label>
            <Input id="website" v-model="form.website" placeholder="https://acme.com" />
          </div>
        </div>

        <div v-else-if="currentStep === 2" class="space-y-4">
          <div class="space-y-2">
            <Label for="useCase">Primary goal</Label>
            <Textarea id="useCase" v-model="form.useCase" placeholder="What are you trying to achieve?" />
          </div>
          <div class="space-y-2">
            <Label for="teamSize">Team size</Label>
            <Select v-model="form.teamSize">
              <SelectTrigger id="teamSize">
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">Just me</SelectItem>
                <SelectItem value="2-5">2-5</SelectItem>
                <SelectItem value="6-15">6-15</SelectItem>
                <SelectItem value="16-50">16-50</SelectItem>
                <SelectItem value="50+">50+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div class="rounded-lg border p-4">
            <div class="text-sm text-muted-foreground">Name</div>
            <div class="font-medium">{{ form.name }}</div>
          </div>
          <div class="rounded-lg border p-4">
            <div class="text-sm text-muted-foreground">Role</div>
            <div class="font-medium">{{ form.role }}</div>
          </div>
          <div class="rounded-lg border p-4">
            <div class="text-sm text-muted-foreground">Workspace</div>
            <div class="font-medium">{{ form.orgName }}</div>
          </div>
          <div class="rounded-lg border p-4">
            <div class="text-sm text-muted-foreground">Goal</div>
            <div class="font-medium">{{ form.useCase }}</div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <Button variant="outline" :disabled="currentStep === 0" @click="prevStep">
            Back
          </Button>
          <Button :disabled="isSaving" @click="nextStep">
            <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
            {{ currentStep === steps.length - 1 ? 'Finish' : 'Continue' }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import {
  Card,
  CardContent,
} from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperTitle,
  StepperTrigger,
} from '../../components/ui/stepper'
import { useToast } from '../../components/ui/toast/use-toast'
import { Loader2 } from 'lucide-vue-next'
import { useOnboarding } from '../../composables/useOnboarding'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'Onboarding',
})

const { initSEO } = useSEO({
  title: 'Onboarding',
  description: 'Complete onboarding to personalize your workspace.',
  noindex: true,
})

initSEO()

const { toast } = useToast()
const { onboarding, update } = useOnboarding()
const isSaving = ref(false)

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
  if (currentStep.value === 0) {
    return form.name.trim() && form.role.trim()
  }
  if (currentStep.value === 1) {
    return form.orgName.trim()
  }
  if (currentStep.value === 2) {
    return form.useCase.trim() && form.teamSize.trim()
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
    toast({ title: 'Missing info', description: 'Please fill in the required fields.', variant: 'destructive' })
    return
  }

  isSaving.value = true
  try {
    const isLast = currentStep.value === steps.length - 1
    await persist(isLast)
    if (isLast) {
      toast({ title: 'Onboarding complete', description: 'You are ready to go.' })
      navigateTo('/dashboard')
      return
    }
    currentStep.value += 1
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to save onboarding info.', variant: 'destructive' })
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

