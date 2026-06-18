"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Sword, Target, Brain, Timer, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, Zap, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/quests", icon: Sword, label: "Quests" },
  { href: "/objectives", icon: Target, label: "Objectives" },
  { href: "/skills", icon: Brain, label: "Skills" },
  { href: "/focus", icon: Timer, label: "Focus" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 border-b border-[rgba(139,92,246,0.1)]",
        collapsed && "justify-center px-3"
      )}>
        <div className="flex h-7 w-7 items-center justify-center border border-violet-500/30 shrink-0">
          <Zap className="h-3.5 w-3.5 text-violet-400" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#e8e8e8]">Ascension OS</h1>
            <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#555555] mt-0.5">v1.0.0 · active</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 pt-3 space-y-px">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-xs font-mono tracking-[0.1em] uppercase transition-all duration-100 group relative",
                collapsed && "justify-center px-2",
                isActive
                  ? "text-violet-400 bg-violet-500/8 border-l border-violet-500"
                  : "text-[#555555] hover:text-[#e8e8e8] hover:bg-white/2 border-l border-transparent"
              )}
            >
              <item.icon className={cn(
                "h-3.5 w-3.5 shrink-0",
                isActive ? "text-violet-400" : "text-[#444444] group-hover:text-[#e8e8e8]"
              )} />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto w-1 h-1 bg-violet-400 rounded-none" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-4 border-t border-[rgba(139,92,246,0.08)] pt-2">
        <button
          onClick={handleSignOut}
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2 text-xs font-mono tracking-[0.1em] uppercase text-[#444444] hover:text-[#e8e8e8] transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col border-r border-[rgba(139,92,246,0.1)] bg-[#080808] transition-all duration-300 relative",
        collapsed ? "w-12" : "w-52"
      )}>
        <SidebarContent />
        <button
          className="absolute -right-2.5 top-5 h-5 w-5 border border-[rgba(139,92,246,0.2)] bg-[#080808] flex items-center justify-center text-[#555555] hover:text-violet-400 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b border-[rgba(139,92,246,0.1)] bg-[#080808]">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-violet-400" />
          <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase">Ascension OS</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[#555555] hover:text-violet-400">
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 pt-14">
          <div className="absolute inset-0 bg-black/80" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-14 bottom-0 w-52 bg-[#080808] border-r border-[rgba(139,92,246,0.1)]">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
