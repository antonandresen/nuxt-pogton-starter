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
      </div>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in filteredUsers" :key="user.id">
            <TableCell>{{ user.email }}</TableCell>
            <TableCell>
              <Select 
                v-if="currentUser?.role === 'ADMIN'"
                :model-value="user.role"
                @update:model-value="(role) => updateUserRole(user.id, role)"
              >
                <SelectTrigger class="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <span v-else>{{ user.role }}</span>
            </TableCell>
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MoreHorizontal } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'

interface User {
  id: number
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

const users = ref<User[]>([])
const searchQuery = ref('')
const { toast } = useToast()
const { user: currentUser } = useAuth()

const fetchUsers = async () => {
  try {
    const response = await $fetch('/api/users')
    users.value = response.users
  } catch (error: any) {
    toast({
      title: 'Failed to fetch users',
      description: error.data?.message || 'Please try again later',
      variant: 'destructive'
    })
  }
}

const updateUserRole = async (userId: number, role: 'USER' | 'ADMIN') => {
  try {
    await $fetch(`/api/users/${userId}/role`, {
      method: 'PATCH',
      body: { role }
    })
    toast({
      title: 'User role updated successfully',
      variant: 'success'
    })
    await fetchUsers() // Refresh the list
  } catch (error: any) {
    toast({
      title: 'Failed to update user role',
      description: error.data?.message || 'Please try again later',
      variant: 'destructive'
    })
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
  fetchUsers()
})
</script>

<style>

</style>