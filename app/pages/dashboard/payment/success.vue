<template>
  <div class="min-h-screen flex items-center justify-center">
    <Card class="w-full max-w-lg">
      <CardHeader>
        <CardTitle class="text-center">
          {{ data?.success ? 'Success!' : 'Processing...' }}
        </CardTitle>
        <CardDescription class="text-center">
          {{ data?.message || 'Verifying your subscription...' }}
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col items-center gap-6">
        <div v-if="data?.success" class="text-green-500">
          <IconCheckCircle class="w-16 h-16" />
        </div>
        <div v-else class="text-blue-500">
          <IconLoader2 class="w-16 h-16 animate-spin" />
        </div>
        <Button
          v-if="data?.success"
          size="lg"
          class="mt-4"
          @click="navigateToDashboard"
        >
          <IconArrowRight class="mr-2 h-4 w-4" />
          Go to Dashboard
        </Button>
      </CardContent>
      <CardFooter v-if="!data?.success" class="text-center text-sm text-muted-foreground">
        Please wait while we verify your subscription...
      </CardFooter>
    </Card>
  </div>
</template> 

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { initSEO } = useSEO({
  title: 'Subscription Success',
  description: 'Subscription verification status.',
  noindex: true
})

initSEO()

const route = useRoute()

const { data, error } = await useFetch<{ success: boolean; message: string }>('/api/payment/success', {
  query: {
    session_id: route.query.session_id
  }
})

if (error.value) {
  console.log(error.value)
  // throw createError({
  //   statusCode: 500,
  //   message: 'Failed to verify subscription'
  // })
}

const navigateToDashboard = () => {
  navigateTo('/dashboard')
}
</script>