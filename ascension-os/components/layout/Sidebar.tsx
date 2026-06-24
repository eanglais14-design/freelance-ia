"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard",  icon: "⚡", label: "Dashboard" },
  { href: "/quests",     icon: "📋", label: "Quests" },
  { href: "/objectives", icon: "🎯", label: "Objectives" },
  { href: "/skills",     icon: "🧠", label: "Skills" },
  { href: "/focus",      icon: "⏱", label: "Focus" },
  { href: "/analytics",  icon: "📊", label: "Analytics" },
  { href: "/settings",   icon: "⚙️", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-4 py-4 border-b border-[rgba(255,255,255,0.05)]", collapsed && "justify-center px-2")}>
        <div className="flex h-6 w-6 items-center justify-center border border-violet-500/30 shrink-0 text-[10px]">⚡</div>
        {!collapsed && (
          <div>
            <p className="font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-[#e8e8e8]">AOS</p>
            <p className="font-mono text-[8px] tracking-[0.12em] text-[#333]">ascension_os · v1.0</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 pt-2 space-y-px">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-100 border-l-2",
                collapsed && "justify-center px-2",
                active
                  ? "text-[#e8e8e8] border-l-violet-500 bg-[rgba(139,92,246,0.05)]"
                  : "text-[#444] border-l-transparent hover:text-[#888]"
              )}
            >
              <span className="text-sm shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {active && !collapsed && <span className="ml-auto w-1 h-1 bg-violet-500 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-3 pt-2 border-t border-[rgba(255,255,255,0.04)]">
        <button
          onClick={handleSignOut}
          className={cn("flex w-full items-center gap-2.5 px-2 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#333] hover:text-[#888] transition-colors", collapsed && "justify-center")}
        >
          <span className="text-sm">🚪</span>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className={cn(
        "hidden md:flex flex-col border-r border-[rgba(255,255,255,0.05)] bg-[#0a0a0a] transition-all duration-300 relative shrink-0",
        collapsed ? "w-12" : "w-48"
      )}>
        <Content />
        <button
          className="absolute -right-2.5 top-4 h-5 w-5 border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a] flex items-center justify-center text-[#444] hover:text-[#888] transition-colors font-mono text-[10px]"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.05)] bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <span>⚡</span>
          <span className="font-mono text-[11px] font-bold tracking-[0.18em] uppercase">AOS</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="font-mono text-[#444] hover:text-[#888] text-lg">
          {mobileOpen ? "✕" : "≡"}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 pt-14">
          <div className="absolute inset-0 bg-black/80" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-14 bottom-0 w-48 bg-[#0a0a0a] border-r border-[rgba(255,255,255,0.05)]">
            <Content />
          </div>
        </div>
      )}
    </>
  );
}
