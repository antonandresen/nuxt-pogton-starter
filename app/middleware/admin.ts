export default defineNuxtRouteMiddleware((to) => {
  const user = useState('auth-user')

  if (!user.value || user.value.role !== 'ADMIN') {
    return navigateTo({
      path: '/dashboard',
      query: {
        message: 'You need admin access to view this page'
      }
    })
  }
}) 