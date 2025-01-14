import { defineCronHandler } from '#nuxt/cron'

export default defineCronHandler('daily', async () => {
  try {
    console.log('CRON: test-job - started...')
  } catch (error) {
    console.error('CRON: test-job - error in test job:', error)
  }
})