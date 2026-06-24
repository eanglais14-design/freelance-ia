import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

export function calculateXpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

export function calculateXpProgress(totalXp: number): { current: number; required: number; percentage: number } {
  const level = calculateLevel(totalXp);
  const currentLevelXp = calculateXpForLevel(level);
  const nextLevelXp = calculateXpForLevel(level + 1);
  const required = nextLevelXp - currentLevelXp;
  const current = totalXp - currentLevelXp;
  const percentage = Math.min(100, Math.round((current / required) * 100));
  return { current, required, percentage };
}

export function getRank(level: number): "E" | "D" | "C" | "B" | "A" | "S" {
  if (level <= 5) return "E";
  if (level <= 10) return "D";
  if (level <= 20) return "C";
  if (level <= 35) return "B";
  if (level <= 50) return "A";
  return "S";
}

export function getRankColor(rank: string): string {
  const colors: Record<string, string> = {
    E: "text-gray-400",
    D: "text-green-400",
    C: "text-blue-400",
    B: "text-purple-400",
    A: "text-amber-400",
    S: "text-red-400",
  };
  return colors[rank] || "text-gray-400";
}

export function getRankBgColor(rank: string): string {
  const colors: Record<string, string> = {
    E: "bg-gray-400/10 border-gray-400/20",
    D: "bg-green-400/10 border-green-400/20",
    C: "bg-blue-400/10 border-blue-400/20",
    B: "bg-purple-400/10 border-purple-400/20",
    A: "bg-amber-400/10 border-amber-400/20",
    S: "bg-red-400/10 border-red-400/20",
  };
  return colors[rank] || "bg-gray-400/10 border-gray-400/20";
}

export function getDomainColor(domain: string): string {
  const colors: Record<string, string> = {
    fitness: "#22c55e",
    "ai_automation": "#6366f1",
    "business_sales": "#f59e0b",
    "mba_studies": "#3b82f6",
    "music_production": "#ec4899",
    "mind_discipline": "#8b5cf6",
    "social_networking": "#14b8a6",
  };
  return colors[domain] || "#6366f1";
}

export function getDomainLabel(domain: string): string {
  const labels: Record<string, string> = {
    fitness: "Fitness",
    "ai_automation": "AI & Automation",
    "business_sales": "Business & Sales",
    "mba_studies": "MBA / Studies",
    "music_production": "Music Production",
    "mind_discipline": "Mind / Discipline",
    "social_networking": "Social / Networking",
  };
  return labels[domain] || domain;
}

export function getDomainIcon(domain: string): string {
  const icons: Record<string, string> = {
    fitness: "💪",
    "ai_automation": "🤖",
    "business_sales": "💼",
    "mba_studies": "📚",
    "music_production": "🎵",
    "mind_discipline": "🧠",
    "social_networking": "🌐",
  };
  return icons[domain] || "⚡";
}

export function getXpForDifficulty(difficulty: string): number {
  const xp: Record<string, number> = {
    easy: 25,
    medium: 50,
    hard: 100,
    boss: 250,
  };
  return xp[difficulty] || 25;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function isToday(date: string | Date): boolean {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

export function isThisWeek(date: string | Date): boolean {
  const d = new Date(date);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return d >= startOfWeek;
}
