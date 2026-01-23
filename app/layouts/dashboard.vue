<template>
  <SidebarProvider>
    <Sidebar side="left" class="border-r bg-muted/30">
      <SidebarHeader class="border-b">
        <div class="flex items-center gap-3 px-2 py-1">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <img src="/logo.png" alt="Pogton Logo" class="h-6 w-6 object-contain brightness-0 invert" />
          </div>
          <div class="min-w-0">
            <h2 class="text-lg font-bold tracking-tight">Pogton</h2>
            <DropdownMenu>
              <DropdownMenuTrigger class="group flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <span class="max-w-[140px] truncate">{{ currentOrg?.name ?? 'Select workspace' }}</span>
                <ChevronDown class="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" class="w-60">
                <div class="px-2 py-1.5 text-xs text-muted-foreground">Workspaces</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  v-for="org in orgs"
                  :key="org.id"
                  class="flex items-center justify-between gap-2"
                >
                  <div class="min-w-0">
                    <div class="text-sm font-medium truncate">{{ org.name }}</div>
                    <div class="text-xs text-muted-foreground truncate">{{ org.slug }}</div>
                  </div>
                  <div class="flex items-center gap-1">
                    <button
                      class="inline-flex h-7 items-center rounded-md border px-2 text-xs font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                      :disabled="org.id === currentOrgId"
                      @click.stop.prevent="handleSwitchOrg(org.id)"
                    >
                      {{ org.id === currentOrgId ? 'Current' : 'Switch' }}
                    </button>
                    <NuxtLink
                      :to="`/dashboard/orgs/${org.id}`"
                      class="inline-flex h-7 items-center rounded-md border px-2 text-xs font-medium transition hover:bg-muted"
                    >
                      Configure
                    </NuxtLink>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem as-child>
                  <NuxtLink to="/dashboard/orgs" class="flex items-center gap-2">
                    <Building2 class="h-4 w-4" />
                    <span>Manage workspaces</span>
                  </NuxtLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent class="py-4">
        <!-- Regular User Navigation -->
        <SidebarGroup>
          <SidebarGroupLabel class="text-xs uppercase tracking-wider px-3">Navigation</SidebarGroupLabel>
          <SidebarMenu class="space-y-1 px-2">
            <SidebarMenuItem>
              <NuxtLink to="/dashboard">
                <SidebarMenuButton :is-active="route.path === '/dashboard'">
                  <LayoutDashboard class="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <NuxtLink to="/dashboard/subscription">
                <SidebarMenuButton :is-active="route.path.startsWith('/dashboard/subscription')">
                  <CreditCard class="h-4 w-4" />
                  <span>Subscription</span>
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NuxtLink to="/dashboard/settings">
                <SidebarMenuButton :is-active="route.path.startsWith('/dashboard/settings')">
                  <Settings class="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NuxtLink to="/dashboard/shop">
                <SidebarMenuButton :is-active="route.path.startsWith('/dashboard/shop')">
                  <ShoppingCart class="h-4 w-4" />
                  <span>Shop</span>
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>

        <!-- Staff Navigation -->
        <SidebarGroup v-if="canAccessCms || canAccessCrm" class="mt-4">
          <SidebarGroupLabel class="text-xs uppercase tracking-wider px-3">Staff</SidebarGroupLabel>
          <SidebarMenu class="space-y-1 px-2">
            <SidebarMenuItem v-if="canAccessCms">
              <NuxtLink to="/dashboard/cms">
                <SidebarMenuButton :is-active="route.path.startsWith('/dashboard/cms')">
                  <FileText class="h-4 w-4" />
                  <span>CMS</span>
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>

            <SidebarMenuItem v-if="canAccessCrm">
              <NuxtLink to="/dashboard/crm">
                <SidebarMenuButton :is-active="route.path.startsWith('/dashboard/crm')">
                  <UsersRound class="h-4 w-4" />
                  <span>CRM</span>
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <!-- Admin Navigation -->
        <SidebarGroup v-if="user?.role === 'ADMIN'" class="mt-4">
          <SidebarGroupLabel class="text-xs uppercase tracking-wider px-3">Admin</SidebarGroupLabel>
          <SidebarMenu class="space-y-1 px-2">
            <SidebarMenuItem>
              <NuxtLink to="/admin">
                <SidebarMenuButton :is-active="route.path === '/admin'">
                  <LineChart class="h-4 w-4" />
                  <span>Overview</span>
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <NuxtLink to="/admin/users">
                <SidebarMenuButton :is-active="route.path.startsWith('/admin/users')">
                  <Users class="h-4 w-4" />
                  <span>Users</span>
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <NuxtLink to="/admin/subscriptions">
                <SidebarMenuButton :is-active="route.path.startsWith('/admin/subscriptions')">
                  <CreditCard class="h-4 w-4" />
                  <span>Subscriptions</span>
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NuxtLink to="/admin/pricing">
                <SidebarMenuButton :is-active="route.path.startsWith('/admin/pricing')">
                  <DollarSign class="h-4 w-4" />
                  <span>Pricing</span>
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NuxtLink to="/admin/settings">
                <SidebarMenuButton :is-active="route.path.startsWith('/admin/settings')">
                  <Settings class="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter class="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-muted focus:outline-none focus:bg-muted">
            <div class="relative w-10 h-10 flex-shrink-0">
              <Avatar class="h-10 w-10 ring-2 ring-background">
                <AvatarImage :src="avatarUrl" :alt="user?.email" />
                <AvatarFallback class="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-semibold">
                  {{ user?.email?.charAt(0).toUpperCase() }}
                </AvatarFallback>
              </Avatar>
              <div class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
            <div class="flex-1 min-w-0 text-left">
              <div class="text-sm font-medium truncate">{{ user?.email?.split('@')[0] }}</div>
              <div class="text-xs text-muted-foreground capitalize">{{ user?.role?.toLowerCase() }}</div>
            </div>
            <ChevronDown class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" class="w-56 mb-2">
            <div class="px-2 py-1.5 text-xs text-muted-foreground">
              {{ user?.email }}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="showAvatarDialog = true" class="flex items-center gap-2 cursor-pointer">
              <User class="h-4 w-4" />
              <span>Change Avatar</span>
            </DropdownMenuItem>
            <DropdownMenuItem as-child>
              <NuxtLink to="/dashboard/settings" class="flex items-center gap-2 cursor-pointer">
                <Settings class="h-4 w-4" />
                <span>Settings</span>
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem @click="toggleTheme" class="flex items-center gap-2 cursor-pointer">
              <Moon class="h-4 w-4" />
              <span>Toggle Theme</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="handleLogout" class="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
              <LogOut class="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>

    <SidebarContent class="flex-1">
      <div class="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-6 py-4">
        <div class="flex items-center gap-4">
          <SidebarTrigger />
          <DashboardBreadcrumb :breadcrumbs="breadcrumbs" />
        </div>
      </div>
      <div class="p-6">
        <slot />
      </div>
    </SidebarContent>

    <!-- Avatar Upload Dialog -->
    <ClientOnly>
      <AvatarUploadDialog v-model:open="showAvatarDialog" />
    </ClientOnly>
    <CookieBanner />
    <ClientOnly>
      <FloatingAiChat />
    </ClientOnly>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { 
  Sidebar, 
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  CreditCard,
  Building2,
  LineChart,
  ShoppingCart,
  FileText,
  UsersRound,
  ChevronDown,
  Moon,
  User,
  Check,
  DollarSign
} from 'lucide-vue-next'
import { useAuth } from '@/composables/use-auth'
import { useOrg } from '@/composables/useOrg'
import { getAvatarUrl } from '@/utils/gravatar'
import { hasPermission } from '@/utils/permissions'
import { useToast } from '@/components/ui/toast/use-toast'

const { user, logout } = useAuth()
const { orgs, currentOrgId, switchOrg: switchOrgAction } = useOrg()
const { toast } = useToast()
const route = useRoute()
const colorMode = useColorMode()
const showAvatarDialog = ref(false)

const avatarUrl = computed(() => {
  if (!user.value) return ''
  return getAvatarUrl(user.value.email, user.value.avatar)
})

const breadcrumbs = computed(() => {
  return [
    {
      title: 'Dashboard',
      route: '/dashboard',
      isCurrent: !route.meta.breadcrumb
    },
    ...(route.meta.breadcrumb ? [{
      title: route.meta.breadcrumb as string,
      route: route.path,
      isCurrent: true
    }] : [])
  ]
})

const currentOrg = computed(() => {
  return orgs.value.find((org: { id: string }) => org.id === currentOrgId.value) ?? null
})

const currentOrgRole = computed(() => {
  const org = orgs.value.find(
    (item: { id: string; role?: string | null }) => item.id === currentOrgId.value
  )
  return (org?.role as any) ?? null
})

const canAccessCms = computed(() => hasPermission(currentOrgRole.value, "cms:read"))
const canAccessCrm = computed(() => hasPermission(currentOrgRole.value, "crm:read"))

const handleLogout = async () => {
  await logout()
}

const handleSwitchOrg = async (orgId: string) => {
  if (orgId === currentOrgId.value) return
  try {
    await switchOrgAction(orgId)
    toast({ title: 'Workspace switched' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to switch workspace.', variant: 'destructive' })
  }
}

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<style scoped>
/* Enhanced sidebar menu button styles */
:deep([data-sidebar="menu-button"]) {
  position: relative;
  transition: all 0.2s ease;
}

:deep([data-sidebar="menu-button"][data-active="true"]) {
  background: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
  font-weight: 600;
}

:deep([data-sidebar="menu-button"][data-active="true"]::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 70%;
  width: 3px;
  background: hsl(var(--primary));
  border-radius: 0 4px 4px 0;
}

:deep([data-sidebar="menu-button"]:hover) {
  transform: translateX(2px);
}

:deep([data-sidebar="menu-button"][data-active="true"]:hover) {
  background: hsl(var(--primary) / 0.15);
}
</style>
