<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Admin Settings</h2>
      <p class="text-muted-foreground">Control product-level configuration</p>
    </div>

    <Tabs default-value="feature-flags" class="space-y-6">
      <TabsList class="flex flex-wrap gap-2">
        <TabsTrigger value="feature-flags">Feature Flags</TabsTrigger>
        <TabsTrigger value="ai-chat">AI Chat</TabsTrigger>
        <TabsTrigger value="app-settings">App Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="feature-flags">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Control org-level feature switches</CardDescription>
            </div>
            <Dialog v-model:open="isCreateFlagOpen">
              <DialogTrigger as-child>
                <Button variant="outline">New Flag</Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Feature Flag</DialogTitle>
                  <DialogDescription>Add a new flag for your organization.</DialogDescription>
                </DialogHeader>
                <div class="space-y-4 py-2">
                  <div class="space-y-2">
                    <Label for="flag-key">Key</Label>
                    <Input id="flag-key" v-model="flagForm.key" placeholder="billing.enabled" />
                  </div>
                  <div class="space-y-2">
                    <Label for="flag-rules">Rules (JSON)</Label>
                    <Textarea id="flag-rules" v-model="flagForm.rules" placeholder="{ &quot;plan&quot;: &quot;pro&quot; }" />
                    <p class="text-xs text-muted-foreground">Optional. Leave empty for a simple on/off flag.</p>
                  </div>
                  <div class="flex items-center justify-between">
                    <Label>Enabled</Label>
                    <Switch v-model:checked="flagForm.enabled" />
                  </div>
                </div>
                <DialogFooter class="gap-2">
                  <Button variant="outline" @click="isCreateFlagOpen = false">Cancel</Button>
                  <Button :disabled="isCreatingFlag" @click="createFlag">
                    <Loader2 v-if="isCreatingFlag" class="mr-2 h-4 w-4 animate-spin" />
                    Create Flag
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div v-if="!flags?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              No feature flags yet. Create one to start controlling rollouts.
            </div>
            <div v-else class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Enabled</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="flag in flags" :key="flag._id">
                    <TableCell class="font-medium">{{ flag.key }}</TableCell>
                    <TableCell>
                      <Switch
                        :checked="flag.enabled"
                        @update:checked="(value: boolean) => toggleFlag(flag, value)"
                      />
                    </TableCell>
                    <TableCell>{{ formatDate(flag.updatedAt) }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ai-chat">
        <Card>
          <CardHeader>
            <CardTitle>AI Chat</CardTitle>
            <CardDescription>Configure the floating AI assistant for all users.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <Label>Enabled</Label>
                <p class="text-xs text-muted-foreground">Turn the assistant on or off globally.</p>
              </div>
              <Switch v-model:checked="aiForm.enabled" />
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="ai-model">Model</Label>
                <Input id="ai-model" v-model="aiForm.model" placeholder="gpt-4o-mini" />
              </div>
              <div class="space-y-2">
                <Label for="ai-temperature">Temperature</Label>
                <Input id="ai-temperature" v-model.number="aiForm.temperature" type="number" step="0.1" min="0" max="2" />
              </div>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="ai-max-tokens">Max tokens</Label>
                <Input id="ai-max-tokens" v-model.number="aiForm.maxTokens" type="number" min="64" />
              </div>
              <div class="space-y-2">
                <Label for="ai-greeting">Greeting</Label>
                <Input id="ai-greeting" v-model="aiForm.greeting" placeholder="Hi! How can I help?" />
              </div>
            </div>
            <div class="space-y-2">
              <Label for="ai-prompt">System prompt</Label>
              <Textarea id="ai-prompt" v-model="aiForm.systemPrompt" rows="6" placeholder="Give the assistant context and rules" />
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="ai-cta-label">CTA label</Label>
                <Input id="ai-cta-label" v-model="aiForm.ctaLabel" placeholder="Book a demo" />
              </div>
              <div class="space-y-2">
                <Label for="ai-cta-url">CTA URL</Label>
                <Input id="ai-cta-url" v-model="aiForm.ctaUrl" placeholder="https://cal.com/your-team" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Button :disabled="isSavingAi" @click="saveAiConfig">
                <Loader2 v-if="isSavingAi" class="mr-2 h-4 w-4 animate-spin" />
                Save AI settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="app-settings">
        <Card>
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
            <CardDescription>Control global product access and workflows.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <Label>Workspaces</Label>
                <p class="text-xs text-muted-foreground">Allow users to create and switch workspaces.</p>
              </div>
              <Switch v-model:checked="appSettingsForm.workspacesEnabled" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <Label>Invitations</Label>
                <p class="text-xs text-muted-foreground">Allow workspace invites and accepting invites.</p>
              </div>
              <Switch v-model:checked="appSettingsForm.invitationsEnabled" />
            </div>
            <div class="flex items-center gap-2">
              <Button :disabled="isSavingAppSettings" @click="saveAppSettings">
                <Loader2 v-if="isSavingAppSettings" class="mr-2 h-4 w-4 animate-spin" />
                Save app settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-vue-next'
import { useFeatureFlags } from '@/composables/useFeatureFlags'
import { api, useConvexMutation, useConvexQuery } from '@/composables/useConvex'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'admin'],
  breadcrumb: 'Admin Settings'
})

const { initSEO } = useSEO({
  title: 'Admin Settings',
  description: 'Control product-level configuration and access.',
  noindex: true
})

initSEO()

const { toast } = useToast()

const { flags, upsert } = useFeatureFlags()
const { data: aiConfig } = useConvexQuery(api.aiChat.getAdminConfig, {})
const saveAiMutation = useConvexMutation(api.aiChat.upsertAdminConfig)
const { data: appSettings } = useConvexQuery(api.appSettings.getAdmin, {})
const saveAppSettingsMutation = useConvexMutation(api.appSettings.upsertAdmin)

const isCreateFlagOpen = ref(false)
const isCreatingFlag = ref(false)
const flagForm = reactive({
  key: '',
  enabled: true,
  rules: ''
})

const isSavingAi = ref(false)
const aiForm = reactive({
  enabled: true,
  model: 'gpt-4o-mini',
  systemPrompt: '',
  greeting: 'Hi! Ask me anything about the product.',
  ctaLabel: '',
  ctaUrl: '',
  maxTokens: 512,
  temperature: 0.4,
})

const isSavingAppSettings = ref(false)
const appSettingsForm = reactive({
  workspacesEnabled: true,
  invitationsEnabled: true,
})


const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}

const createFlag = async () => {
  const key = flagForm.key.trim()
  if (!key) {
    toast({
      title: 'Missing key',
      description: 'Enter a feature flag key.',
      variant: 'destructive'
    })
    return
  }

  let rules: unknown | undefined
  if (flagForm.rules.trim()) {
    try {
      rules = JSON.parse(flagForm.rules)
    } catch {
      toast({
        title: 'Invalid JSON',
        description: 'Rules must be valid JSON.',
        variant: 'destructive'
      })
      return
    }
  }

  isCreatingFlag.value = true
  try {
    await upsert(key, flagForm.enabled, rules)
    toast({
      title: 'Feature flag created',
      description: `Flag "${key}" is ready.`
    })
    flagForm.key = ''
    flagForm.enabled = true
    flagForm.rules = ''
    isCreateFlagOpen.value = false
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to create feature flag.',
      variant: 'destructive'
    })
  } finally {
    isCreatingFlag.value = false
  }
}

const toggleFlag = async (flag: { key: string; rules?: unknown }, enabled: boolean) => {
  try {
    await upsert(flag.key, enabled, flag.rules)
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to update feature flag.',
      variant: 'destructive'
    })
  }
}

watchEffect(() => {
  if (!aiConfig.value) return
  aiForm.enabled = aiConfig.value.enabled ?? aiForm.enabled
  aiForm.model = aiConfig.value.model ?? aiForm.model
  aiForm.systemPrompt = aiConfig.value.systemPrompt ?? aiForm.systemPrompt
  aiForm.greeting = aiConfig.value.greeting ?? aiForm.greeting
  aiForm.ctaLabel = aiConfig.value.ctaLabel ?? aiForm.ctaLabel
  aiForm.ctaUrl = aiConfig.value.ctaUrl ?? aiForm.ctaUrl
  aiForm.maxTokens = aiConfig.value.maxTokens ?? aiForm.maxTokens
  aiForm.temperature = aiConfig.value.temperature ?? aiForm.temperature
})

watchEffect(() => {
  if (!appSettings.value) return
  appSettingsForm.workspacesEnabled =
    appSettings.value.workspacesEnabled ?? appSettingsForm.workspacesEnabled
  appSettingsForm.invitationsEnabled =
    appSettings.value.invitationsEnabled ?? appSettingsForm.invitationsEnabled
})

const saveAiConfig = async () => {
  isSavingAi.value = true
  try {
    await saveAiMutation.mutate({
      enabled: aiForm.enabled,
      model: aiForm.model.trim(),
      systemPrompt: aiForm.systemPrompt.trim() || undefined,
      greeting: aiForm.greeting.trim() || undefined,
      ctaLabel: aiForm.ctaLabel.trim() || undefined,
      ctaUrl: aiForm.ctaUrl.trim() || undefined,
      maxTokens: aiForm.maxTokens || undefined,
      temperature: aiForm.temperature || undefined,
    })
    toast({
      title: 'AI chat updated',
      description: 'Settings saved successfully.',
    })
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to save AI settings.',
      variant: 'destructive'
    })
  } finally {
    isSavingAi.value = false
  }
}

const saveAppSettings = async () => {
  isSavingAppSettings.value = true
  try {
    await saveAppSettingsMutation.mutate({
      workspacesEnabled: appSettingsForm.workspacesEnabled,
      invitationsEnabled: appSettingsForm.invitationsEnabled,
    })
    toast({
      title: 'App settings updated',
      description: 'Settings saved successfully.',
    })
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to save app settings.',
      variant: 'destructive'
    })
  } finally {
    isSavingAppSettings.value = false
  }
}

</script>

