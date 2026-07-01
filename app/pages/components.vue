<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

definePageMeta({
  title: 'Component Showcase',
  description: 'A visual guide to all UI components available in the application.',
})
</script>

<template>
  <div class="container mx-auto py-10 px-4 space-y-12">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Component Showcase</h1>
      <p class="text-muted-foreground text-lg">
        A comprehensive guide to the building blocks of our interface.
      </p>
    </div>

    <Separator />

    <!-- Buttons -->
    <section class="space-y-6">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold">Buttons</h2>
        <p class="text-sm text-muted-foreground">Interactive elements for user actions.</p>
      </div>
      <div class="flex flex-wrap gap-4">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      <div class="flex flex-wrap gap-4">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">Icon</Button>
      </div>
    </section>

    <Separator />

    <!-- Inputs -->
    <section class="space-y-6">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold">Form Inputs</h2>
        <p class="text-sm text-muted-foreground">Fields for capturing user data.</p>
      </div>
      <div class="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div class="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>
    </section>

    <Separator />

    <!-- Cards -->
    <section class="space-y-6">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold">Cards</h2>
        <p class="text-sm text-muted-foreground">Containers for grouped content.</p>
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content goes here.</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </section>

    <Separator />

    <!-- Badges -->
    <section class="space-y-6">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold">Badges</h2>
        <p class="text-sm text-muted-foreground">Status indicators and labels.</p>
      </div>
      <div class="flex gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
    </section>

    <Separator />

    <!-- Alerts -->
    <section class="space-y-6">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold">Alerts</h2>
        <p class="text-sm text-muted-foreground">Feedback messages for users.</p>
      </div>
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>
    </section>

  </div>
</template>
