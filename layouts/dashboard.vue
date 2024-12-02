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
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LayoutDashboard class="h-4 w-4 mr-2" />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Users class="h-4 w-4 mr-2" />
                Users
                <SidebarMenuBadge>New</SidebarMenuBadge>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings class="h-4 w-4 mr-2" />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div class="flex items-center gap-3 px-2">
          <Avatar>
            <AvatarFallback>{{ user?.email?.charAt(0).toUpperCase() }}</AvatarFallback>
          </Avatar>
          <div class="flex-1">
            <p class="text-sm font-medium leading-none">{{ user?.email }}</p>
            <p class="text-xs text-muted-foreground">Administrator</p>
          </div>
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
  SidebarMenuButton,
  SidebarMenuBadge
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Zap, LayoutDashboard, Users, Settings, LogOut } from 'lucide-vue-next'
import { useAuth } from '@/composables/use-auth'

const { user, logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>