<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Admin Settings</h2>
      <p class="text-muted-foreground">Control product-level configuration</p>
    </div>

    <Tabs default-value="feature-flags" class="space-y-6">
      <TabsList class="flex flex-wrap gap-2">
        <TabsTrigger value="feature-flags">Feature Flags</TabsTrigger>
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
                    <Switch v-model="flagForm.enabled" />
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
                        :model-value="flag.enabled"
                        @update:model-value="(value) => toggleFlag(flag, value)"
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

const isCreateFlagOpen = ref(false)
const isCreatingFlag = ref(false)
const flagForm = reactive({
  key: '',
  enabled: true,
  rules: ''
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

</script>

