<template>
  <SidebarProvider>
    <Sidebar side="left" class="border-r">
      <SidebarHeader>
        <div class="flex items-center gap-2">
          <Zap class="h-6 w-6 text-primary" />
          <h2 class="text-xl font-bold">Pogton</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <!-- Regular User Navigation -->
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <NuxtLink to="/dashboard">
                <SidebarMenuButton>
                  <LayoutDashboard class="h-4 w-4 mr-2" />
                  Dashboard
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <NuxtLink to="/dashboard/subscription">
                <SidebarMenuButton>
                  <CreditCard class="h-4 w-4 mr-2" />
                  Subscription
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <NuxtLink to="/dashboard/settings">
                <SidebarMenuButton>
                  <Settings class="h-4 w-4 mr-2" />
                  Settings
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <!-- Admin Navigation -->
        <SidebarGroup v-if="user?.role === 'ADMIN'">
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <NuxtLink to="/admin">
                <SidebarMenuButton>
                  <LineChart class="h-4 w-4 mr-2" />
                  Overview
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <NuxtLink to="/admin/users">
                <SidebarMenuButton>
                  <Users class="h-4 w-4 mr-2" />
                  Users
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <NuxtLink to="/admin/subscriptions">
                <SidebarMenuButton>
                  <CreditCard class="h-4 w-4 mr-2" />
                  Subscriptions
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NuxtLink to="/admin/cv">
                <SidebarMenuButton>
                  <FileText class="h-4 w-4 mr-2" />
                  Resume
                </SidebarMenuButton>
              </NuxtLink>
            </SidebarMenuItem>
            
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div class="flex items-center gap-3 px-2">
          <Avatar>
            <AvatarFallback>{{ user?.email?.charAt(0).toUpperCase() }}</AvatarFallback>
          </Avatar>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium leading-none truncate">{{ user?.email }}</p>
            <p class="text-xs text-muted-foreground">{{ user?.role }}</p>
          </div>
          <ThemeToggle />
          <Button variant="ghost" size="icon" @click="handleLogout">
            <LogOut class="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>

    <SidebarContent class="flex-1 p-6">
      <slot />
    </SidebarContent>
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
  SidebarMenuButton
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  Zap, 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  CreditCard,
  LineChart,
  FileText
} from 'lucide-vue-next'
import { useAuth } from '@/composables/use-auth'

const { user, logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>