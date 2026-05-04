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

  const { brandName, productName, sequenceType, context } = await req.json()

  const sequenceGuide: Record<string, string> = {
    abandon_panier: '3 emails: J+1 rappel doux, J+3 objection + social proof, J+7 urgence + réduction 10%',
    post_achat: '3 emails: confirmation enthousiaste, conseils utilisation, demande d\'avis + programme fidélité',
    welcome: '3 emails: bienvenue + histoire marque, meilleures ventes, offre exclusive nouveau client',
    relance: '2 emails: "vous nous manquez" + nouveautés, offre de réengagement limitée',
    promo: '3 emails: annonce early access, rappel J-1, dernières heures',
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Tu es un expert en email marketing e-commerce. Rédige une séquence email complète en français.

Marque: ${brandName}
Produit/Contexte: ${productName}
Type de séquence: ${sequenceGuide[sequenceType] ?? sequenceType}
Contexte de marque: ${context}

Pour chaque email, fournis:
- Sujet (objet de l'email) avec variante de test A/B
- Preheader (texte preview)
- Corps de l'email complet
- CTA principal

Sépare clairement chaque email.`,
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
