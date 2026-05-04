'use client'

import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import AgentShell from '@/components/dashboard/AgentShell'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

export default function InsightsAgentPage() {
  const [productName, setProductName] = useState('')
  const [reviews, setReviews] = useState('')
  const [goal, setGoal] = useState('angles_marketing')

  return (
    <AgentShell
      title="Insight Agent"
      description="Analyse vos avis clients et extrait les angles marketing les plus puissants."
      icon={BarChart3}
      iconColor="bg-emerald-100 text-emerald-600"
      endpoint="/api/agents/insights"
      buildPayload={() => ({ productName, reviews, goal })}
      fields={
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="productName"
              label="Produit analysé *"
              placeholder="Ex: Sac en cuir Milano"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="goal" className="text-sm font-medium text-slate-700">Objectif d&apos;analyse</label>
              <select
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="angles_marketing">Angles marketing</option>
                <option value="points_friction">Points de friction</option>
                <option value="ameliorations">Suggestions d&apos;amélioration</option>
                <option value="faq">FAQ client à anticiper</option>
              </select>
            </div>
          </div>
          <Textarea
            id="reviews"
            label="Avis clients (collez-les ici) *"
            placeholder="★★★★★ Super qualité, livraison rapide&#10;★★★☆☆ Bien mais un peu cher pour ce que c'est&#10;★★★★★ Je recommande vivement, très satisfaite&#10;..."
            rows={8}
            value={reviews}
            onChange={(e) => setReviews(e.target.value)}
          />
        </>
      }
    />
  )
}
