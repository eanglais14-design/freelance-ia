'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import AgentShell from '@/components/dashboard/AgentShell'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

export default function EmailAgentPage() {
  const [brandName, setBrandName] = useState('')
  const [productName, setProductName] = useState('')
  const [sequenceType, setSequenceType] = useState('abandon_panier')
  const [context, setContext] = useState('')

  return (
    <AgentShell
      title="Email Agent"
      description="Rédige des séquences email complètes et personnalisées pour votre boutique."
      icon={Mail}
      iconColor="bg-sky-100 text-sky-600"
      endpoint="/api/agents/email"
      buildPayload={() => ({ brandName, productName, sequenceType, context })}
      fields={
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="brandName"
              label="Nom de la marque *"
              placeholder="Ex: Maison Douce"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sequenceType" className="text-sm font-medium text-slate-700">Type de séquence</label>
              <select
                id="sequenceType"
                value={sequenceType}
                onChange={(e) => setSequenceType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="abandon_panier">Abandon de panier (3 emails)</option>
                <option value="post_achat">Post-achat & fidélisation</option>
                <option value="welcome">Séquence de bienvenue</option>
                <option value="relance">Relance clients inactifs</option>
                <option value="promo">Campagne promotionnelle</option>
              </select>
            </div>
          </div>
          <Input
            id="productName"
            label="Produit / Panier concerné *"
            placeholder="Ex: Robe d'été Soleil"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <Textarea
            id="context"
            label="Contexte & ton de marque *"
            placeholder="Ex: Marque de mode éco-responsable, ton chaleureux et bienveillant, clientèle 30-50 ans..."
            rows={3}
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </>
      }
    />
  )
}
