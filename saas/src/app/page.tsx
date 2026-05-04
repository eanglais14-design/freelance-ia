import Link from 'next/link'
import { Package, Megaphone, Mail, BarChart3, CheckCircle2, ArrowRight, Zap } from 'lucide-react'

const agents = [
  {
    icon: Package,
    name: 'Product Agent',
    color: 'bg-violet-100 text-violet-600',
    description: 'Génère des descriptions produits optimisées SEO, titres accrocheurs et fiches techniques en quelques secondes.',
  },
  {
    icon: Megaphone,
    name: 'Ads Agent',
    color: 'bg-orange-100 text-orange-600',
    description: 'Crée des accroches publicitaires percutantes pour Meta, TikTok et Google Ads depuis votre URL produit.',
  },
  {
    icon: Mail,
    name: 'Email Agent',
    color: 'bg-sky-100 text-sky-600',
    description: 'Rédige des séquences email complètes : abandon panier, post-achat, relance et newsletter.',
  },
  {
    icon: BarChart3,
    name: 'Insight Agent',
    color: 'bg-emerald-100 text-emerald-600',
    description: 'Analyse vos avis clients et extrait les angles marketing les plus puissants pour vos campagnes.',
  },
]

const plans = [
  {
    name: 'Free',
    price: '0€',
    period: '',
    credits: '20 générations/mois',
    features: ['4 agents IA', 'Export texte', 'Support communauté'],
    cta: 'Commencer gratuitement',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '39€',
    period: '/mois',
    credits: '300 générations/mois',
    features: ['4 agents IA', 'Export texte + CSV', 'Historique 30 jours', 'Support email'],
    cta: 'Essayer Starter',
    href: '/signup?plan=starter',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '89€',
    period: '/mois',
    credits: '1 000 générations/mois',
    features: ['4 agents IA', 'Export tous formats', 'Historique illimité', 'Support prioritaire', 'Intégrations Shopify'],
    cta: 'Essayer Pro',
    href: '/signup?plan=pro',
    highlighted: true,
  },
  {
    name: 'Agency',
    price: '199€',
    period: '/mois',
    credits: 'Générations illimitées',
    features: ['4 agents IA', 'Multi-boutiques', 'White-label', 'API access', 'Account manager dédié'],
    cta: 'Contacter les ventes',
    href: '/signup?plan=agency',
    highlighted: false,
  },
]

const testimonials = [
  {
    name: 'Sophie M.',
    role: 'Gérante – Boutique Lune & Co',
    quote: "J'ai réduit le temps de rédaction de mes fiches produits de 3h à 10 minutes. Incroyable.",
  },
  {
    name: 'Thomas R.',
    role: 'Fondateur – RunGear',
    quote: "Les accroches générées par l'Ads Agent ont augmenté mon CTR de 40% sur Meta. ROI immédiat.",
  },
  {
    name: 'Amélie K.',
    role: 'E-commerçante – Maison Douce',
    quote: "L'Email Agent m'a créé toute une séquence abandon panier en 2 minutes. Je ne peux plus m'en passer.",
  },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Zap className="w-5 h-5" />
            ShopAgent
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600 font-medium">
            <Link href="#agents" className="hover:text-slate-900 transition">Agents</Link>
            <Link href="#pricing" className="hover:text-slate-900 transition">Tarifs</Link>
            <Link href="#testimonials" className="hover:text-slate-900 transition">Avis</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" /> Propulsé par Claude AI
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
              4 agents IA dédiés<br />
              à votre <span className="text-indigo-600">e-commerce</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Générez des descriptions produits, publicités, emails et insights clients en quelques secondes.
              Plus de temps à écrire, plus de temps à vendre.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold text-base px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Commencer gratuitement <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#agents"
                className="inline-flex items-center gap-2 bg-white text-slate-700 font-semibold text-base px-8 py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
              >
                Voir les agents
              </Link>
            </div>
            <p className="text-sm text-slate-400 mt-4">Aucune carte bancaire requise · 20 générations offertes</p>
          </div>
        </section>

        {/* Agents */}
        <section id="agents" className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">4 agents, 1 plateforme</h2>
              <p className="text-lg text-slate-500">Chaque agent est spécialisé pour une tâche précise. Ensemble, ils couvrent tout votre marketing.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {agents.map((agent) => (
                <div key={agent.name} className="border border-slate-200 rounded-2xl p-8 hover:shadow-md transition">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${agent.color} mb-5`}>
                    <agent.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{agent.name}</h3>
                  <p className="text-slate-500 leading-relaxed">{agent.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Ce que disent nos clients</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                  <p className="text-slate-700 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Tarifs simples et transparents</h2>
              <p className="text-lg text-slate-500">Commencez gratuitement. Upgradez quand vous en avez besoin.</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-8 flex flex-col ${
                    plan.highlighted
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-600 ring-offset-2 scale-105'
                      : 'border border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="mb-6">
                    <p className={`font-semibold text-sm mb-1 ${plan.highlighted ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {plan.name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold">{plan.price}</span>
                      <span className={`text-sm ${plan.highlighted ? 'text-indigo-200' : 'text-slate-400'}`}>{plan.period}</span>
                    </div>
                    <p className={`text-sm mt-2 ${plan.highlighted ? 'text-indigo-200' : 'text-slate-500'}`}>{plan.credits}</p>
                  </div>
                  <ul className="flex-1 space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-indigo-200' : 'text-emerald-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`block text-center text-sm font-semibold px-4 py-3 rounded-xl transition ${
                      plan.highlighted
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 bg-indigo-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Prêt à automatiser votre marketing ?</h2>
            <p className="text-indigo-200 text-lg mb-10">Rejoignez des centaines de boutiques qui économisent des heures chaque semaine.</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold text-base px-8 py-4 rounded-xl hover:bg-indigo-50 transition shadow-lg"
            >
              Démarrer gratuitement <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-white">
            <Zap className="w-4 h-4 text-indigo-400" /> ShopAgent
          </Link>
          <p className="text-sm">© 2026 ShopAgent. Tous droits réservés.</p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="hover:text-white transition">CGU</Link>
            <Link href="#" className="hover:text-white transition">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
