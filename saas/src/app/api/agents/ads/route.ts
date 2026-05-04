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

  const { productName, targetAudience, uniqueValue, platform } = await req.json()

  const platformGuide = platform === 'meta'
    ? 'Meta Ads (Facebook/Instagram): headline 40 car max, primary text 125 car, description 30 car'
    : platform === 'tiktok'
    ? 'TikTok Ads: accroche vidéo dynamique, ton jeune et direct, emoji autorisés'
    : platform === 'google'
    ? 'Google Ads: 3 titres 30 car max, 2 descriptions 90 car max, mots-clés inclus'
    : 'Meta, TikTok et Google Ads'

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Tu es un expert en publicité digitale. Crée des accroches publicitaires en français pour ${platformGuide}.

Produit: ${productName}
Audience: ${targetAudience}
Valeur unique: ${uniqueValue}

Génère 5 variantes percutantes. Pour chaque variante:
- Headline accrocheur
- Texte principal
- Call-to-action

Adapte le format et le ton aux spécificités de la plateforme.`,
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
