import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import CreditsBar from '@/components/dashboard/CreditsBar'
import { Package, Megaphone, Mail, BarChart3, ArrowRight } from 'lucide-react'

const agents = [
  { href: '/agents/product', icon: Package, name: 'Product Agent', color: 'bg-violet-100 text-violet-600', desc: 'Descriptions produits & SEO' },
  { href: '/agents/ads', icon: Megaphone, name: 'Ads Agent', color: 'bg-orange-100 text-orange-600', desc: 'Accroches Meta, TikTok, Google' },
  { href: '/agents/email', icon: Mail, name: 'Email Agent', color: 'bg-sky-100 text-sky-600', desc: 'Séquences email automatisées' },
  { href: '/agents/insights', icon: BarChart3, name: 'Insight Agent', color: 'bg-emerald-100 text-emerald-600', desc: 'Analyse des avis clients' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, credits_used, credits_total')
    .eq('id', user!.id)
    .single()

  const plan = profile?.plan ?? 'free'
  const creditsUsed = profile?.credits_used ?? 0
  const creditsTotal = profile?.credits_total ?? 20

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bonjour 👋</h1>
        <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
      </div>

      <CreditsBar used={creditsUsed} total={creditsTotal} plan={plan} />

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Vos agents IA</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {agents.map(({ href, icon: Icon, name, color, desc }) => (
            <Link key={href} href={href}>
              <Card className="hover:shadow-md transition cursor-pointer group">
                <CardContent className="flex items-center gap-4 py-5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{name}</p>
                    <p className="text-slate-500 text-xs">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {plan === 'free' && (
        <Card className="bg-indigo-50 border-indigo-100">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-indigo-900 text-sm">Passez à Pro pour débloquer 1 000 générations/mois</p>
              <p className="text-indigo-600 text-xs mt-0.5">+ historique illimité, support prioritaire, intégrations Shopify</p>
            </div>
            <Link
              href="/billing"
              className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition whitespace-nowrap"
            >
              Voir les offres
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
