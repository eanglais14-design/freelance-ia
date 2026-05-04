'use client'

import { useState } from 'react'
import { Package } from 'lucide-react'
import AgentShell from '@/components/dashboard/AgentShell'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

export default function ProductAgentPage() {
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [keyFeatures, setKeyFeatures] = useState('')
  const [tone, setTone] = useState('professionnel')

  return (
    <AgentShell
      title="Product Agent"
      description="Génère une fiche produit complète, optimisée SEO et prête à publier."
      icon={Package}
      iconColor="bg-violet-100 text-violet-600"
      endpoint="/api/agents/product"
      buildPayload={() => ({ productName, category, keyFeatures, tone })}
      fields={
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="productName"
              label="Nom du produit *"
              placeholder="Ex: Sneakers Urban Runner v2"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <Input
              id="category"
              label="Catégorie *"
              placeholder="Ex: Chaussures de sport"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <Textarea
            id="keyFeatures"
            label="Caractéristiques clés *"
            placeholder="Ex: Semelle Boost, tige en mesh respirant, disponible en 5 coloris, poids 280g..."
            rows={4}
            value={keyFeatures}
            onChange={(e) => setKeyFeatures(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tone" className="text-sm font-medium text-slate-700">Ton de la rédaction</label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            >
              <option value="professionnel">Professionnel</option>
              <option value="enthousiaste">Enthousiaste</option>
              <option value="luxe">Luxe & Premium</option>
              <option value="minimaliste">Minimaliste</option>
            </select>
          </div>
        </>
      }
    />
  )
}
