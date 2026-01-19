import { api, useConvexMutation, useConvexQuery } from '~/composables/useConvex'

export function useOrg() {

  const { data: orgsData } = useConvexQuery(api.orgs.listMine, {})
  const { data: membershipsData } = useConvexQuery(api.memberships.listMine, {})
  const { data: currentUser } = useConvexQuery(api.users.getCurrent, {})

  const orgs = computed(() => {
    const memberships = membershipsData.value ?? []
    const membershipByOrgId = new Map(memberships.map((membership) => [membership.orgId, membership]))
    return (orgsData.value ?? []).map((org) => {
      const membership = membershipByOrgId.get(org._id)
      return {
        id: org._id,
        name: org.name,
        slug: org.slug,
        role: membership?.role ?? null,
        status: membership?.status ?? null,
      }
    })
  })

  const currentOrgId = computed(() => currentUser.value?.currentOrgId ?? null)

  const createMutation = useConvexMutation(api.orgs.createForCurrentUser)
  const switchMutation = useConvexMutation(api.orgs.switchCurrentOrg)
  const listMembersQuery = useConvexQuery(api.memberships.listForCurrentOrg, {})
  const listInvitesQuery = useConvexQuery(api.invites.listForCurrentOrg, {})
  const createInviteMutation = useConvexMutation(api.invites.createForCurrentOrg)
  const acceptInviteMutation = useConvexMutation(api.invites.acceptByToken)

  const create = async (name: string, slug?: string) => {
    return await createMutation.mutate({ name, slug })
  }

  const switchOrg = async (orgId: string) => {
    await switchMutation.mutate({ orgId })
  }

  const listMembers = () => {
    return listMembersQuery.data.value ?? []
  }

  const listInvites = () => {
    return listInvitesQuery.data.value ?? []
  }

  const createInvite = async (email: string, role: string) => {
    const token = crypto.randomUUID()
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7
    return await createInviteMutation.mutate({ email, role, token, expiresAt })
  }

  const acceptInvite = async (token: string) => {
    return await acceptInviteMutation.mutate({ token })
  }

  return {
    orgs,
    currentOrgId,
    create,
    switchOrg,
    listMembers,
    listInvites,
    createInvite,
    acceptInvite,
  }
}

