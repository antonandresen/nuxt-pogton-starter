<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Pricing Plans</h2>
        <p class="text-muted-foreground">Configure pricing plans and connect them to Stripe</p>
      </div>
      <Button variant="outline" :disabled="isSyncing" @click="syncStripe">
        <RefreshCw v-if="isSyncing" class="mr-2 h-4 w-4 animate-spin" />
        <RefreshCw v-else class="mr-2 h-4 w-4" />
        Sync from Stripe
      </Button>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Plans List -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Plans</CardTitle>
            <CardDescription>Your configured pricing tiers</CardDescription>
          </div>
          <Button @click="openCreateDialog">New Plan</Button>
        </CardHeader>
        <CardContent>
          <div v-if="isLoadingPlans" class="flex justify-center py-8">
            <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
          <div v-else-if="!plans?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            No plans yet. Create your first pricing plan.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="plan in plans"
              :key="plan._id"
              class="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ plan.name }}</span>
                  <Badge v-if="plan.isPopular" variant="secondary">Popular</Badge>
                  <Badge v-if="!plan.isActive" variant="outline">Inactive</Badge>
                </div>
                <div class="text-sm text-muted-foreground">
                  ${{ plan.monthlyPrice }}/mo · ${{ plan.annualPrice }}/mo (annual)
                </div>
                <div v-if="plan.stripePriceIdMonthly || plan.stripePriceIdAnnual" class="text-xs text-muted-foreground mt-1">
                  <span v-if="plan.stripePriceIdMonthly">Monthly: {{ plan.stripePriceIdMonthly }}</span>
                  <span v-if="plan.stripePriceIdMonthly && plan.stripePriceIdAnnual"> · </span>
                  <span v-if="plan.stripePriceIdAnnual">Annual: {{ plan.stripePriceIdAnnual }}</span>
                </div>
              </div>
              <div class="flex gap-2">
                <Button variant="outline" size="sm" @click="selectPlan(plan)">Edit</Button>
                <Button variant="ghost" size="sm" @click="deletePlan(plan._id)">
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Synced Stripe Data -->
      <Card>
        <CardHeader>
          <CardTitle>Stripe Products & Prices</CardTitle>
          <CardDescription>
            Synced from your Stripe account
            <span v-if="lastSyncTime" class="text-xs"> · Last sync: {{ lastSyncTime }}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="isLoadingStripe" class="flex justify-center py-8">
            <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
          <div v-else-if="!stripeProducts?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            No products synced. Click "Sync from Stripe" to fetch your products.
          </div>
          <Accordion v-else type="single" collapsible class="w-full">
            <AccordionItem v-for="product in stripeProducts" :key="product._id" :value="product.stripeId">
              <AccordionTrigger>
                <div class="flex items-center gap-2">
                  <span>{{ product.name }}</span>
                  <Badge variant="outline">{{ getPricesForProduct(product.stripeId).length }} price(s)</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div class="space-y-2 pt-2">
                  <div
                    v-for="price in getPricesForProduct(product.stripeId)"
                    :key="price._id"
                    class="flex items-center justify-between rounded border p-2 text-sm"
                  >
                    <div>
                      <code class="text-xs text-muted-foreground">{{ price.stripeId }}</code>
                      <div>
                        {{ formatStripePrice(price) }}
                        <span v-if="price.nickname" class="text-muted-foreground">({{ price.nickname }})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>

    <!-- Edit/Create Dialog -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Edit Plan' : 'Create Plan' }}</DialogTitle>
          <DialogDescription>
            {{ isEditing ? 'Update pricing plan details.' : 'Add a new pricing tier.' }}
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-2 px-1 max-h-[60vh] overflow-y-auto">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label for="plan-name">Name</Label>
              <Input id="plan-name" v-model="form.name" placeholder="Pro" />
            </div>
            <div class="space-y-2">
              <Label for="plan-order">Display Order</Label>
              <Input id="plan-order" v-model.number="form.displayOrder" type="number" />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="plan-desc">Description</Label>
            <Input id="plan-desc" v-model="form.description" placeholder="For growing teams" />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label for="plan-monthly">Monthly Price ($)</Label>
              <Input 
                id="plan-monthly" 
                v-model.number="form.monthlyPrice" 
                type="number" 
                :readonly="!!form.stripePriceIdMonthly"
                :class="{ 'bg-muted': form.stripePriceIdMonthly }"
              />
              <p v-if="form.stripePriceIdMonthly" class="text-xs text-muted-foreground">Auto-populated from Stripe</p>
            </div>
            <div class="space-y-2">
              <Label for="plan-annual">Annual Price ($/mo)</Label>
              <Input 
                id="plan-annual" 
                v-model.number="form.annualPrice" 
                type="number" 
                :readonly="!!form.stripePriceIdAnnual"
                :class="{ 'bg-muted': form.stripePriceIdAnnual }"
              />
              <p v-if="form.stripePriceIdAnnual" class="text-xs text-muted-foreground">Auto-populated from Stripe</p>
            </div>
          </div>

          <!-- Stripe Price Dropdowns -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label>Stripe Monthly Price</Label>
              <Select v-model="form.stripePriceIdMonthly">
                <SelectTrigger>
                  <SelectValue placeholder="Select monthly price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectGroup v-for="product in stripeProducts" :key="product._id">
                    <SelectLabel>{{ product.name }}</SelectLabel>
                    <SelectItem
                      v-for="price in getMonthlyPrices(product.stripeId)"
                      :key="price._id"
                      :value="price.stripeId"
                    >
                      {{ formatStripePrice(price) }}
                      <span v-if="price.nickname"> ({{ price.nickname }})</span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label>Stripe Annual Price</Label>
              <Select v-model="form.stripePriceIdAnnual">
                <SelectTrigger>
                  <SelectValue placeholder="Select annual price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectGroup v-for="product in stripeProducts" :key="product._id">
                    <SelectLabel>{{ product.name }}</SelectLabel>
                    <SelectItem
                      v-for="price in getAnnualPrices(product.stripeId)"
                      :key="price._id"
                      :value="price.stripeId"
                    >
                      {{ formatStripePrice(price) }}
                      <span v-if="price.nickname"> ({{ price.nickname }})</span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="plan-features">Features (one per line)</Label>
            <Textarea
              id="plan-features"
              v-model="featuresText"
              rows="5"
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            />
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Switch v-model:checked="form.isActive" />
              <Label>Active</Label>
            </div>
            <div class="flex items-center gap-2">
              <Switch v-model:checked="form.isPopular" />
              <Label>Popular</Label>
            </div>
          </div>
        </div>
        <DialogFooter class="gap-2">
          <Button variant="outline" @click="isDialogOpen = false">Cancel</Button>
          <Button :disabled="isSaving" @click="savePlan">
            <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
            {{ isEditing ? 'Update' : 'Create' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Loader2, Trash2, RefreshCw } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api, useConvexQuery, useConvexMutation } from '../../composables/useConvex'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'admin'],
  breadcrumb: 'Pricing Plans',
})

const { initSEO } = useSEO({
  title: 'Pricing Plans',
  description: 'Configure pricing plans and Stripe integration.',
  noindex: true,
})

initSEO()

const { toast } = useToast()

// Convex data
const { data: plans, isLoading: isLoadingPlans } = useConvexQuery(api.pricingPlans.listAll, {})
const { data: stripeProducts, isLoading: isLoadingStripeProducts } = useConvexQuery(api.stripe.listProducts, {})
const { data: stripePrices, isLoading: isLoadingStripePrices } = useConvexQuery(api.stripe.listPrices, {})

const createMutation = useConvexMutation(api.pricingPlans.create)
const updateMutation = useConvexMutation(api.pricingPlans.update)
const removeMutation = useConvexMutation(api.pricingPlans.remove)

const isLoadingStripe = computed(() => isLoadingStripeProducts.value || isLoadingStripePrices.value)

const lastSyncTime = computed(() => {
  if (!stripeProducts.value?.length) return null
  const latest = Math.max(...stripeProducts.value.map((p: any) => p.syncedAt))
  return new Date(latest).toLocaleString()
})

// Sync from Stripe
const isSyncing = ref(false)

const syncStripe = async () => {
  isSyncing.value = true
  try {
    const result = await $fetch<{ productCount: number; priceCount: number }>('/api/admin/stripe/sync', {
      method: 'POST',
    })
    toast({
      title: 'Synced from Stripe',
      description: `${result.productCount} products, ${result.priceCount} prices`,
    })
  } catch (e: any) {
    toast({ title: 'Sync failed', description: e.data?.message || e.message, variant: 'destructive' })
  } finally {
    isSyncing.value = false
  }
}

// Helper functions
const getPricesForProduct = (stripeProductId: string) => {
  return (stripePrices.value ?? []).filter((p: any) => p.stripeProductId === stripeProductId)
}

const getMonthlyPrices = (stripeProductId: string) => {
  return getPricesForProduct(stripeProductId).filter((p: any) => p.interval === 'month' || !p.interval)
}

const getAnnualPrices = (stripeProductId: string) => {
  return getPricesForProduct(stripeProductId).filter((p: any) => p.interval === 'year')
}

const formatStripePrice = (price: any) => {
  if (!price.unitAmount) return 'Free'
  const amount = (price.unitAmount / 100).toFixed(2)
  const interval = price.interval ? `/${price.interval}` : ''
  return `$${amount}${interval}`
}

// UI state
const isDialogOpen = ref(false)
const isSaving = ref(false)
const selectedPlan = ref<any>(null)
const isEditing = computed(() => !!selectedPlan.value)

const form = reactive({
  name: '',
  description: '',
  monthlyPrice: 0,
  annualPrice: 0,
  stripePriceIdMonthly: '',
  stripePriceIdAnnual: '',
  stripeProductId: '',
  isPopular: false,
  isActive: true,
  displayOrder: 0,
})

const featuresText = ref('')

// Auto-populate prices from selected Stripe prices
watch(() => form.stripePriceIdMonthly, (priceId) => {
  if (!priceId) return
  const price = stripePrices.value?.find((p: any) => p.stripeId === priceId)
  if (price?.unitAmount) {
    form.monthlyPrice = price.unitAmount / 100
  }
})

watch(() => form.stripePriceIdAnnual, (priceId) => {
  if (!priceId) return
  const price = stripePrices.value?.find((p: any) => p.stripeId === priceId)
  if (price?.unitAmount) {
    form.annualPrice = price.unitAmount / 100
  }
})

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.monthlyPrice = 0
  form.annualPrice = 0
  form.stripePriceIdMonthly = ''
  form.stripePriceIdAnnual = ''
  form.stripeProductId = ''
  form.isPopular = false
  form.isActive = true
  form.displayOrder = (plans.value?.length ?? 0) + 1
  featuresText.value = ''
  selectedPlan.value = null
}

const openCreateDialog = () => {
  resetForm()
  isDialogOpen.value = true
}

const selectPlan = (plan: any) => {
  selectedPlan.value = plan
  form.name = plan.name
  form.description = plan.description
  form.monthlyPrice = plan.monthlyPrice
  form.annualPrice = plan.annualPrice
  form.stripePriceIdMonthly = plan.stripePriceIdMonthly ?? ''
  form.stripePriceIdAnnual = plan.stripePriceIdAnnual ?? ''
  form.stripeProductId = plan.stripeProductId ?? ''
  form.isPopular = plan.isPopular
  form.isActive = plan.isActive
  form.displayOrder = plan.displayOrder
  featuresText.value = plan.features.join('\n')
  isDialogOpen.value = true
}

const savePlan = async () => {
  if (!form.name.trim()) {
    toast({ title: 'Name required', variant: 'destructive' })
    return
  }

  isSaving.value = true
  const features = featuresText.value.split('\n').map((f) => f.trim()).filter(Boolean)

  try {
    if (isEditing.value) {
      await updateMutation.mutate({
        id: selectedPlan.value._id,
        ...form,
        stripePriceIdMonthly: form.stripePriceIdMonthly || undefined,
        stripePriceIdAnnual: form.stripePriceIdAnnual || undefined,
        features,
      })
      toast({ title: 'Plan updated' })
    } else {
      await createMutation.mutate({
        ...form,
        stripePriceIdMonthly: form.stripePriceIdMonthly || undefined,
        stripePriceIdAnnual: form.stripePriceIdAnnual || undefined,
        features,
      })
      toast({ title: 'Plan created' })
    }
    isDialogOpen.value = false
    resetForm()
  } catch (e: any) {
    toast({ title: 'Error', description: e.message, variant: 'destructive' })
  } finally {
    isSaving.value = false
  }
}

const deletePlan = async (id: string) => {
  if (!confirm('Delete this plan?')) return
  try {
    await removeMutation.mutate({ id })
    toast({ title: 'Plan deleted' })
  } catch (e: any) {
    toast({ title: 'Error', description: e.message, variant: 'destructive' })
  }
}
</script>
