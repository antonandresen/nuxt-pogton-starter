import { createError } from 'h3'

interface OneSignalEmailConfig {
  app_id: string
  api_key: string
  email_from_name: string
  email_from_address: string
}

interface OneSignalEmailTemplate {
  id: string
  name: string
  subject: string
  body: string
}

interface OneSignalEmailRequest {
  app_id: string
  email_subject: string
  email_body: string
  include_email_tokens: string[]
  email_from_name?: string
  email_from_address?: string
  template_id?: string
}

const config: OneSignalEmailConfig = {
  app_id: process.env.ONESIGNAL_APP_ID as string,
  api_key: process.env.ONESIGNAL_API_KEY as string,
  email_from_name: process.env.ONESIGNAL_EMAIL_FROM_NAME as string,
  email_from_address: process.env.ONESIGNAL_EMAIL_FROM_ADDRESS as string
}

export async function sendTransactionalEmail(
  emailTokens: string[],
  subject: string,
  body: string,
  templateId?: string
) {
  if (!config.app_id || !config.api_key) {
    throw createError({
      statusCode: 500,
      message: 'OneSignal configuration is missing'
    })
  }

  const payload: OneSignalEmailRequest = {
    app_id: config.app_id,
    email_subject: subject,
    email_body: body,
    include_email_tokens: emailTokens,
    email_from_name: config.email_from_name,
    email_from_address: config.email_from_address
  }

  if (templateId) {
    payload.template_id = templateId
  }

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${config.api_key}`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.json()
      throw createError({
        statusCode: response.status,
        message: error.errors?.[0] || 'Failed to send email'
      })
    }

    return await response.json()
  } catch (error) {
    console.error('OneSignal email error:', error)
    throw error
  }
}

// Email template functions
export async function getEmailTemplates() {
  try {
    const response = await fetch(`https://onesignal.com/api/v1/templates?app_id=${config.app_id}`, {
      headers: {
        'Authorization': `Basic ${config.api_key}`
      }
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: 'Failed to fetch email templates'
      })
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch email templates:', error)
    throw error
  }
}

// Helper function to send welcome email
export async function sendWelcomeEmail(email: string, name: string) {
  const subject = 'Welcome to Pogton!'
  const body = `
    <h1>Welcome to Pogton, ${name}!</h1>
    <p>We're excited to have you on board. Here are some things you can do to get started:</p>
    <ul>
      <li>Complete your profile</li>
      <li>Explore our features</li>
      <li>Check out our documentation</li>
    </ul>
    <p>If you have any questions, feel free to reach out to our support team.</p>
  `

  return sendTransactionalEmail([email], subject, body)
}

// Helper function to send purchase confirmation
export async function sendPurchaseConfirmation(email: string, purchase: {
  productName: string
  amount: number
  currency: string
  date: Date
  paymentId: string
}) {
  const subject = 'Purchase Confirmation'
  const body = `
    <h1>Thank you for your purchase!</h1>
    <p>Your order details:</p>
    <ul>
      <li>Product: ${purchase.productName}</li>
      <li>Amount: ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: purchase.currency
      }).format(purchase.amount)}</li>
      <li>Date: ${purchase.date.toLocaleDateString()}</li>
      <li>Order ID: ${purchase.paymentId}</li>
    </ul>
    <p>If you have any questions about your purchase, please contact our support team.</p>
  `

  return sendTransactionalEmail([email], subject, body)
}

// Helper function to send subscription confirmation
export async function sendSubscriptionConfirmation(email: string, subscription: {
  planName: string
  amount: number
  currency: string
  periodEnd: Date
}) {
  const subject = 'Subscription Confirmation'
  const body = `
    <h1>Thank you for subscribing!</h1>
    <p>Your subscription details:</p>
    <ul>
      <li>Plan: ${subscription.planName}</li>
      <li>Amount: ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: subscription.currency
      }).format(subscription.amount)}/month</li>
      <li>Next billing date: ${subscription.periodEnd.toLocaleDateString()}</li>
    </ul>
    <p>If you have any questions about your subscription, please contact our support team.</p>
  `

  return sendTransactionalEmail([email], subject, body)
} 