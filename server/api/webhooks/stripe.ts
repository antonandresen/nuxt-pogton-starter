import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const sig = event.req.headers['stripe-signature']

  const rawBody = await readRawBody(event)

  let eventStripe

  try {
    eventStripe = stripe.webhooks.constructEvent(
      rawBody,
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
      console.log('Checkout Session Data:', {
        customerId: session.customer, // Stripe Customer ID
        customerEmail: session.customer_email,
        customerDetails: session.customer_details,
        clientReferenceId: session.client_reference_id, // Custom ID we can set
        subscriptionId: session.subscription,
        paymentStatus: session.payment_status,
      })
      await handleCheckoutSession(session)
      break
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${eventStripe.type}`)
  }

  return { received: true }
})

async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  // Get customer information from the session
  const customerId = session.customer
  const customerEmail = session.customer_email
  const subscriptionId = session.subscription

  // You can also fetch additional customer details from Stripe if needed
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const customer = await stripe.customers.retrieve(session.customer as string)
  console.log('Customer', customer)
  
  // Update your database with the subscription info
  // For example, with Supabase:
  // await supabaseAdmin
  //   .from('profiles')
  //   .update({
  //     stripe_customer_id: customerId,
  //     stripe_subscription_id: subscriptionId,
  //     subscription_status: 'active'
  //   })
  //   .eq('email', customerEmail)
}