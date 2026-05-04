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

  const { productName, category, keyFeatures, tone } = await req.json()

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Tu es un expert en copywriting e-commerce. Génère une fiche produit complète en français avec un ton ${tone}.

Produit: ${productName}
Catégorie: ${category}
Caractéristiques: ${keyFeatures}

Inclus:
1. Titre accrocheur (avec mot-clé principal)
2. Description courte (2-3 phrases pour les collections)
3. Description longue persuasive (150-200 mots)
4. 5 points forts en bullet points
5. Meta description SEO (155 caractères max)

Formate clairement chaque section.`,
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
