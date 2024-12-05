// server/api/webhooks/stripe.js
import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const sig = event.req.headers['stripe-signature']

  const body = await readBody(event)

  console.log('In Stripe Webhook', body)
  
  let eventStripe

  try {
    eventStripe = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.log('In Stripe Webhook Error', err)
    event.res.statusCode = 400
    return `Webhook Error: ${err.message}`
  }

  console.log('In Stripe Webhook Event', eventStripe)

  // Handle the event
  switch (eventStripe.type) {
    case 'checkout.session.completed':
      const session = eventStripe.data.object
      // Fulfill the purchase, e.g., update the user's subscription status
      await handleCheckoutSession(session)
      break
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${eventStripe.type}`)
  }

  event.res.statusCode = 200
  return { received: true }
})

async function handleCheckoutSession(session) {
  // Implement your logic to activate the user's subscription
  // Typically, you would find the user by session.customer_email and update their account
}