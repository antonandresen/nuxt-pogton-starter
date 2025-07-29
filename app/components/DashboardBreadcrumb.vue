<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(breadcrumb, index) in props.breadcrumbs" :key="breadcrumb.route">
        <BreadcrumbItem>
          <BreadcrumbPage v-if="breadcrumb.isCurrent">
            {{ breadcrumb.title }}
          </BreadcrumbPage>
          <BreadcrumbLink v-else :href="breadcrumb.route">
            {{ breadcrumb.title }}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < props.breadcrumbs.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>

<script lang="ts" setup>

const props = defineProps<{
  breadcrumbs: {
    title: string
    route: string
    isCurrent: boolean
  }[]
}>()
</script>

<style>

</style>