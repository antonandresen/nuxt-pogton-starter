<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">CRM</h2>
      <p class="text-muted-foreground">Track customer onboarding and status across your org.</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>All users in your current workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="!rows?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          No customers yet.
        </div>
        <div v-else class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Onboarding</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Next Follow-up</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in rows" :key="row.user?._id">
                <TableCell>
                  <div class="font-medium">{{ row.user?.email || 'Unknown' }}</div>
                  <div class="text-xs text-muted-foreground">{{ row.user?.name || '—' }}</div>
                </TableCell>
                <TableCell>
                  <Select
                    :model-value="row.crm.status"
                    @update:model-value="(value) => updateField(row, { status: value })"
                  >
                    <SelectTrigger class="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="status in statusOptions" :key="status" :value="status">
                        {{ status }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    :model-value="row.crm.onboardingStatus"
                    @update:model-value="(value) => updateField(row, { onboardingStatus: value })"
                  >
                    <SelectTrigger class="w-[170px]">
                      <SelectValue placeholder="Onboarding" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="status in onboardingOptions" :key="status" :value="status">
                        {{ status }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{{ row.crm.ownerEmail || '—' }}</TableCell>
                <TableCell>{{ formatDate(row.crm.lastContactedAt) }}</TableCell>
                <TableCell>{{ formatDate(row.crm.nextFollowUpAt) }}</TableCell>
                <TableCell class="text-right">
                  <Button variant="outline" size="sm" as-child>
                    <NuxtLink :to="`/dashboard/crm/${row.user?._id}`">Notes</NuxtLink>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../../../components/ui/toast/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { api, useConvexMutation, useConvexQuery, type Id } from '../../../composables/useConvex'
import { useOrg } from '../../../composables/useOrg'
import { hasPermission } from '../../../utils/permissions'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'CRM',
})

const { initSEO } = useSEO({
  title: 'CRM',
  description: 'Manage customer onboarding and status.',
  noindex: true,
})

initSEO()

const { toast } = useToast()
const { orgs, currentOrgId } = useOrg()
const { data: rows } = useConvexQuery(api.crm.listForCurrentOrg, {})
const upsertMutation = useConvexMutation(api.crm.upsertForCurrentOrg)

const statusOptions = ['lead', 'active', 'trial', 'churned']
const onboardingOptions = ['not_started', 'in_progress', 'completed']

const currentOrgRole = computed(() => {
  const org = orgs.value.find((item) => item.id === currentOrgId.value)
  return (org?.role as any) ?? null
})

const canRead = computed(() => hasPermission(currentOrgRole.value, "crm:read"))

watchEffect(() => {
  if (process.server) return
  if (!currentOrgRole.value) return
  if (!canRead.value) {
    toast({ title: 'No access', description: 'You do not have CRM access.', variant: 'destructive' })
    navigateTo('/dashboard')
  }
})

const formatDate = (timestamp?: number | null) => {
  if (!timestamp) return '—'
  return new Date(timestamp).toLocaleDateString()
}

const updateField = async (
  row: {
    user?: { _id: string }
    crm: { status: string; onboardingStatus: string }
  },
  patch: Partial<{ status: string; onboardingStatus: string }>
) => {
  if (!row.user?._id) return
  try {
    await upsertMutation.mutate({
      userId: row.user._id as Id<'users'>,
      status: patch.status ?? row.crm.status,
      onboardingStatus: patch.onboardingStatus ?? row.crm.onboardingStatus,
    })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to update CRM record.', variant: 'destructive' })
  }
}
</script>

