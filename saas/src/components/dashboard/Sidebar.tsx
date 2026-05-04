'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Megaphone, Mail, BarChart3, CreditCard, Zap, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const nav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/agents/product', icon: Package, label: 'Product Agent' },
  { href: '/agents/ads', icon: Megaphone, label: 'Ads Agent' },
  { href: '/agents/email', icon: Mail, label: 'Email Agent' },
  { href: '/agents/insights', icon: BarChart3, label: 'Insight Agent' },
  { href: '/billing', icon: CreditCard, label: 'Abonnement' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 h-screen sticky top-0">
      <div className="px-6 h-16 flex items-center border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-indigo-600">
          <Zap className="w-5 h-5" /> ShopAgent
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition',
              pathname === href
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}
