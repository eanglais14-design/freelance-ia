'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function CheckoutButton({ priceId, planName }: { priceId: string; planName: string }) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.url
    } catch {
      toast.error('Erreur lors de la redirection vers le paiement.')
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} loading={loading} className="w-full" size="sm">
      Passer à {planName}
    </Button>
  )
}
