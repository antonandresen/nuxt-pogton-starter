export default defineNuxtPlugin(async () => {
    const { getUser } = useAuth()

    // Initialize auth state
    await getUser()
})