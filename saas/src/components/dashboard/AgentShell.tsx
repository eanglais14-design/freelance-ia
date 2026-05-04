'use client'

import { useState, type ReactNode } from 'react'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Copy, Check, LucideIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface AgentShellProps {
  title: string
  description: string
  icon: LucideIcon
  iconColor: string
  endpoint: string
  fields: ReactNode
  buildPayload: () => Record<string, string>
}

export default function AgentShell({ title, description, icon: Icon, iconColor, endpoint, fields, buildPayload }: AgentShellProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleRun() {
    const payload = buildPayload()
    const empty = Object.values(payload).some(v => !v.trim())
    if (empty) { toast.error('Remplissez tous les champs.'); return }

    setLoading(true)
    setResult('')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur')
      setResult(data.result)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success('Copié !')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 text-sm">{description}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800 text-sm">Paramètres</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields}
          <Button onClick={handleRun} loading={loading} size="lg" className="w-full">
            {loading ? 'Génération en cours...' : 'Lancer l\'agent'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 text-sm">Résultat</h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copié' : 'Copier'}
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">{result}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
