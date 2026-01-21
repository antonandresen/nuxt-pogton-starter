<script setup lang="ts">
import { ArrowLeft, XCircle } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  breadcrumb: 'Cancelled'
})

const { initSEO } = useSEO({
  title: 'Purchase Cancelled',
  description: 'Your purchase was cancelled.',
  noindex: true
})

initSEO()

const router = useRouter()

const backToShop = () => {
  router.push('/shop')
}
</script>

<template>
  <div class="container max-w-2xl py-12">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-2xl">Payment Cancelled</CardTitle>
        <CardDescription>
          Your payment was cancelled. No charges were made.
        </CardDescription>
      </CardHeader>

      <CardContent class="flex flex-col items-center space-y-6">
        <XCircle class="h-12 w-12 text-destructive" />
        <p class="text-muted-foreground text-center">
          You can try the payment again or contact support if you need assistance.
        </p>
      </CardContent>

      <CardFooter class="flex justify-center">
        <Button @click="backToShop">
          <ArrowLeft class="mr-2 h-4 w-4" />
          Back to Shop
        </Button>
      </CardFooter>
    </Card>
  </div>
</template> 