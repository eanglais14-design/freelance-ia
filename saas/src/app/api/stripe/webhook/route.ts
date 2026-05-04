import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS, type Plan } from '@/lib/stripe'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

function getAdmin() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const PRICE_TO_PLAN: Record<string, Plan> = {
  [process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID ?? '']: 'starter',
  [process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? '']: 'pro',
  [process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID ?? '']: 'agency',
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook invalide' }, { status: 400 })
  }

  const supabaseAdmin = getAdmin()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    const priceId = subscription.items.data[0].price.id
    const plan = PRICE_TO_PLAN[priceId] ?? 'free'

    if (userId) {
      await supabaseAdmin
        .from('profiles')
        .update({
          plan,
          credits_total: PLANS[plan].credits,
          credits_used: 0,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
        })
        .eq('id', userId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    await supabaseAdmin
      .from('profiles')
      .update({ plan: 'free', credits_total: 20, credits_used: 0 })
      .eq('stripe_subscription_id', subscription.id)
  }

  return NextResponse.json({ received: true })
}
