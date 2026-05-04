import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/anthropic'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_used, credits_total')
    .eq('id', user.id)
    .single()

  if (!profile || profile.credits_used >= profile.credits_total) {
    return NextResponse.json({ error: 'Crédits insuffisants. Veuillez upgrader votre plan.' }, { status: 402 })
  }

  const { productName, reviews, goal } = await req.json()

  const goalGuide: Record<string, string> = {
    angles_marketing: 'les 5 angles marketing les plus puissants à exploiter dans les pubs et fiches produits',
    points_friction: 'les principaux points de friction et objections clients à adresser',
    ameliorations: 'les 5 améliorations produit/service prioritaires suggérées par les clients',
    faq: 'les 8 questions fréquentes que se posent les clients avant d\'acheter',
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Tu es un expert en analyse de données clients e-commerce. Analyse ces avis et identifie ${goalGuide[goal] ?? goal}.

Produit: ${productName}

Avis clients:
${reviews}

Fournis une analyse structurée avec:
1. Synthèse globale (sentiment général, note moyenne estimée)
2. Analyse détaillée selon l'objectif demandé
3. Recommandations concrètes et actionnables

Sois précis et donne des exemples tirés des avis.`,
      },
    ],
  })

  const result = message.content[0].type === 'text' ? message.content[0].text : ''

  await supabase
    .from('profiles')
    .update({ credits_used: profile.credits_used + 1 })
    .eq('id', user.id)

  return NextResponse.json({ result })
}
