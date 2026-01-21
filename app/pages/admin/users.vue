<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Users</h2>
      <p class="text-muted-foreground">Manage and monitor user accounts</p>
    </div>

    <UsersTable />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'admin'],
  breadcrumb: 'Users'
})

const { initSEO } = useSEO({
  title: 'User Management',
  description: 'Manage and monitor user accounts.',
  noindex: true
})

initSEO()
</script> 
