'use client'

import { Zap } from 'lucide-react'

interface CreditsBarProps {
  used: number
  total: number
  plan: string
}

export default function CreditsBar({ used, total, plan }: CreditsBarProps) {
  const remaining = total - used
  const pct = Math.min((used / total) * 100, 100)
  const isLow = remaining < total * 0.1

  return (
    <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
          Crédits – Plan {plan}
        </span>
        <span className={`text-xs font-bold ${isLow ? 'text-red-500' : 'text-slate-700'}`}>
          {remaining} restants
        </span>
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isLow ? 'bg-red-500' : 'bg-indigo-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
