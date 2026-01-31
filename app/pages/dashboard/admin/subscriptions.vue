<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Stripe Dashboard</h2>
      <p class="text-muted-foreground">Monitor subscriptions, customers, and one-time purchases.</p>
    </div>

    <Tabs default-value="subscriptions" class="space-y-6">
      <TabsList class="flex flex-wrap gap-2">
        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        <TabsTrigger value="customers">Customers</TabsTrigger>
        <TabsTrigger value="purchases">Purchases</TabsTrigger>
      </TabsList>

      <TabsContent value="subscriptions">
        <Card>
          <CardHeader>
            <CardTitle>Active subscriptions</CardTitle>
            <CardDescription>All subscription records in Stripe</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="!subscriptions?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              No subscriptions yet.
            </div>
            <div v-else class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price ID</TableHead>
                    <TableHead>Period End</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="sub in subscriptions" :key="sub._id">
                    <TableCell>
                      <div class="font-medium">{{ sub.user?.email || 'Unknown' }}</div>
                      <div class="text-xs text-muted-foreground">{{ sub.stripeSubscriptionId }}</div>
                    </TableCell>
                    <TableCell>
                      <Badge :variant="statusVariant(sub.status)">
                        {{ sub.status }}
                      </Badge>
                    </TableCell>
                    <TableCell>{{ sub.priceId || '—' }}</TableCell>
                    <TableCell>{{ formatDate(sub.currentPeriodEnd) }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="customers">
        <Card>
          <CardHeader>
            <CardTitle>Stripe customers</CardTitle>
            <CardDescription>Users connected to Stripe customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="!customers?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              No customers yet.
            </div>
            <div v-else class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="customer in customers" :key="customer._id">
                    <TableCell>
                      <div class="font-medium">{{ customer.email }}</div>
                      <div class="text-xs text-muted-foreground">{{ customer.name || '—' }}</div>
                    </TableCell>
                    <TableCell>{{ customer.stripeCustomerId }}</TableCell>
                    <TableCell>{{ formatDate(customer.createdAt) }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="purchases">
        <Card>
          <CardHeader>
            <CardTitle>One-time purchases</CardTitle>
            <CardDescription>Shop and one-time checkout history</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="!purchases?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              No purchases yet.
            </div>
            <div v-else class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="purchase in purchases" :key="purchase._id">
                    <TableCell>
                      <div class="font-medium">{{ purchase.user?.email || 'Unknown' }}</div>
                      <div class="text-xs text-muted-foreground">{{ purchase.stripePaymentId }}</div>
                    </TableCell>
                    <TableCell>{{ purchase.productName }}</TableCell>
                    <TableCell>
                      <Badge :variant="statusVariant(purchase.status)">
                        {{ purchase.status }}
                      </Badge>
                    </TableCell>
                    <TableCell>{{ formatCurrency(purchase.amount, purchase.currency) }}</TableCell>
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api, useConvexQuery } from '@/composables/useConvex'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'admin'],
  breadcrumb: 'Stripe',
})

const { initSEO } = useSEO({
  title: 'Stripe Dashboard',
  description: 'Monitor subscriptions, customers, and purchases.',
  noindex: true,
})

initSEO()

const { data: subscriptions } = useConvexQuery(api.subscriptions.listAllForAdmin, {})
const { data: purchases } = useConvexQuery(api.purchases.listAllForAdmin, {})
const { data: customers } = useConvexQuery(api.users.listStripeCustomersForAdmin, {})

const statusVariant = (status: string) => {
  if (['active', 'paid', 'succeeded'].includes(status)) return 'default'
  if (['trialing', 'pending'].includes(status)) return 'secondary'
  return 'destructive'
}

const formatDate = (timestamp?: number) => {
  if (!timestamp) return '—'
  return new Date(timestamp).toLocaleDateString()
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency?.toUpperCase?.() || 'USD',
  }).format(amount / 100)
}
</script>

