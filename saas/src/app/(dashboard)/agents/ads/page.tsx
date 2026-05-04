'use client'

import { useState } from 'react'
import { Megaphone } from 'lucide-react'
import AgentShell from '@/components/dashboard/AgentShell'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

export default function AdsAgentPage() {
  const [productName, setProductName] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [uniqueValue, setUniqueValue] = useState('')
  const [platform, setPlatform] = useState('meta')

  return (
    <AgentShell
      title="Ads Agent"
      description="Crée des accroches publicitaires percutantes adaptées à chaque plateforme."
      icon={Megaphone}
      iconColor="bg-orange-100 text-orange-600"
      endpoint="/api/agents/ads"
      buildPayload={() => ({ productName, targetAudience, uniqueValue, platform })}
      fields={
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="productName"
              label="Produit / Offre *"
              placeholder="Ex: Crème hydratante bio"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="platform" className="text-sm font-medium text-slate-700">Plateforme</label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="meta">Meta (Facebook / Instagram)</option>
                <option value="tiktok">TikTok Ads</option>
                <option value="google">Google Ads</option>
                <option value="all">Toutes les plateformes</option>
              </select>
            </div>
          </div>
          <Input
            id="targetAudience"
            label="Audience cible *"
            placeholder="Ex: Femmes 25-40 ans, peau sensible, intéressées par le naturel"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
          <Textarea
            id="uniqueValue"
            label="Proposition de valeur unique *"
            placeholder="Ex: 100% naturel, résultats visibles en 7 jours, certifié bio, fabriqué en France..."
            rows={3}
            value={uniqueValue}
            onChange={(e) => setUniqueValue(e.target.value)}
          />
        </>
      }
    />
  )
}
