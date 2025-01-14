import { defineCronHandler } from '#nuxt/cron'
// import { posts } from '~/drizzle/schema'
// import { and, eq, lt } from 'drizzle-orm'
// import db from '~/server/utils/db'
// import { storageService } from '~/server/services/object-storage'

export default defineCronHandler('daily', async () => {
  try {
    console.log('CRON: test-job - started...')
  } catch (error) {
    console.error('CRON: test-job - error in test job:', error)
  }
})