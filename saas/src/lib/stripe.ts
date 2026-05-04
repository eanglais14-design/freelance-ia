import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export const PLANS = {
  free: { credits: 20, label: 'Free', price: 0 },
  starter: { credits: 300, label: 'Starter', price: 39 },
  pro: { credits: 1000, label: 'Pro', price: 89 },
  agency: { credits: 99999, label: 'Agency', price: 199 },
} as const

export type Plan = keyof typeof PLANS
