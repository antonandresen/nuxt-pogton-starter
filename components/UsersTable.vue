<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Users</h2>
      <div class="flex items-center gap-4">
        <div class="relative">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            class="pl-8"
            v-model="searchQuery"
          />
        </div>
        <Button>
          <Plus class="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in filteredUsers" :key="user.id">
            <TableCell>{{ user.email }}</TableCell>
            <TableCell>{{ formatDate(user.createdAt) }}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, MoreHorizontal } from 'lucide-vue-next'

interface User {
  id: string
  email: string
  createdAt: string
}

const users = ref<User[]>([])
const searchQuery = ref('')

const fetchUsers = async () => {
  try {
    console.log('Fetching users...')
    const response = await $fetch('/api/users')
    console.log('Users response:', response)
    users.value = response.users
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  return users.value.filter(user => 
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  console.log('UsersTable onMounted')
  fetchUsers()
})
</script>

<style>

</style>