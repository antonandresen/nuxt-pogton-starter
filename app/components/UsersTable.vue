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

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>

    <div v-else class="rounded-md border">
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
          <TableRow v-for="user in filteredUsers" :key="user._id">
            <TableCell>{{ user.email }}</TableCell>
            <TableCell>
              <Select 
                v-if="currentUser?.role === 'ADMIN'"
                :model-value="user.role"
                @update:model-value="(role) => updateUserRole(user._id, role as 'USER' | 'ADMIN')"
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
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MoreHorizontal } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
import { useConvexQuery, useConvexMutation, api, type Id } from '~/composables/useConvex'

const searchQuery = ref('')
const { toast } = useToast()
const { data: currentUser } = useConvexQuery(api.users.getCurrent, {})

// Real-time users list from Convex - auto-updates when data changes!
const { data: users, isLoading } = useConvexQuery(api.users.list, {})

// Mutation for updating user role
const updateRoleMutation = useConvexMutation(api.users.updateRole)

const updateUserRole = async (userId: Id<"users">, role: 'USER' | 'ADMIN') => {
  try {
    await updateRoleMutation.mutate({ id: userId, role })
    toast({
      title: 'User role updated successfully',
      variant: 'default'
    })
    // No need to refetch - Convex updates in real-time!
  } catch (error: any) {
    toast({
      title: 'Failed to update user role',
      description: error.message || 'Please try again later',
      variant: 'destructive'
    })
  }
}

const filteredUsers = computed(() => {
  if (!users.value) return []
  if (!searchQuery.value) return users.value
  
  return users.value.filter((user: { email: string; _id: Id<"users">; role: string; createdAt: number }) => 
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}
</script>
