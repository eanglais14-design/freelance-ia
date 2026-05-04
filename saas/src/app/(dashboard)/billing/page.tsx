import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/stripe'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { CheckCircle2, Zap } from 'lucide-react'
import CheckoutButton from './CheckoutButton'

const planDetails = [
  {
    key: 'free' as const,
    name: 'Free',
    price: '0€',
    period: '',
    features: ['20 générations/mois', '4 agents IA', 'Export texte', 'Support communauté'],
  },
  {
    key: 'starter' as const,
    name: 'Starter',
    price: '39€',
    period: '/mois',
    features: ['300 générations/mois', '4 agents IA', 'Export CSV', 'Historique 30 jours', 'Support email'],
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  },
  {
    key: 'pro' as const,
    name: 'Pro',
    price: '89€',
    period: '/mois',
    features: ['1 000 générations/mois', '4 agents IA', 'Tous les exports', 'Historique illimité', 'Support prioritaire'],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    highlighted: true,
  },
  {
    key: 'agency' as const,
    name: 'Agency',
    price: '199€',
    period: '/mois',
    features: ['Générations illimitées', 'Multi-boutiques', 'White-label', 'API access', 'Account manager'],
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID,
  },
]

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, credits_used, credits_total')
    .eq('id', user!.id)
    .single()

  const currentPlan = (profile?.plan ?? 'free') as keyof typeof PLANS

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Abonnement</h1>
        <p className="text-slate-500 text-sm mt-1">Gérez votre plan et vos crédits</p>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Plan actuel : {PLANS[currentPlan].label}</p>
              <p className="text-slate-500 text-xs">
                {(profile?.credits_total ?? 20) - (profile?.credits_used ?? 0)} crédits restants sur {profile?.credits_total ?? 20}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {planDetails.map((plan) => {
          const isCurrent = plan.key === currentPlan
          return (
            <div
              key={plan.key}
              className={`rounded-2xl p-6 flex flex-col border transition ${
                plan.highlighted
                  ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="mb-4">
                <p className="font-bold text-slate-900 text-sm">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-xs text-slate-400">{plan.period}</span>
                </div>
              </div>
              <ul className="flex-1 space-y-2 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div className="text-center text-xs font-semibold text-indigo-600 bg-indigo-100 py-2 rounded-xl">
                  Plan actuel
                </div>
              ) : plan.key === 'free' ? null : (
                <CheckoutButton priceId={plan.priceId!} planName={plan.name} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
