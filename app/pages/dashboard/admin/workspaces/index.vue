<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold tracking-tight">Workspaces</h2>
      <p class="text-muted-foreground">Manage all workspaces across the platform</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>All Workspaces</CardTitle>
        <CardDescription>View and manage all workspaces</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="!orgs?.length" class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          No workspaces yet.
        </div>
        <div v-else class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="org in orgs" :key="org._id">
                <TableCell class="font-medium">{{ org.name }}</TableCell>
                <TableCell class="font-mono text-sm">{{ org.slug }}</TableCell>
                <TableCell>{{ org.memberCount }}</TableCell>
                <TableCell class="text-sm text-muted-foreground">
                  {{ formatDate(org.createdAt) }}
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" as-child>
                      <NuxtLink :to="`/dashboard/orgs/${org._id}`">View</NuxtLink>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger as-child>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete <strong>{{ org.name }}</strong> and remove all {{ org.memberCount }} member(s).
                            Users with this as their active workspace will be switched to another workspace or have no active workspace.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            @click="handleDelete(org._id)"
                            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Workspace
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/toast/use-toast'
import { api, useConvexQuery, useConvexMutation } from '@/composables/useConvex'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'admin'],
  breadcrumb: 'Workspaces',
})

const { initSEO } = useSEO({
  title: 'Admin - Workspaces',
  description: 'Manage all workspaces.',
  noindex: true,
})

initSEO()

const { toast } = useToast()
const { data: orgs } = useConvexQuery(api.orgs.listAll, {})
const deleteOrgMutation = useConvexMutation(api.orgs.deleteAdmin)

const handleDelete = async (orgId: string) => {
  try {
    await deleteOrgMutation.mutate({ id: orgId as any })
    toast({ 
      title: 'Workspace deleted', 
      description: 'The workspace and all memberships have been removed.' 
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete workspace.'
    toast({ title: 'Error', description: message, variant: 'destructive' })
  }
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}
</script>
