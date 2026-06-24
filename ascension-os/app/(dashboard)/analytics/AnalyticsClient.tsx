"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { getDomainColor, getDomainLabel } from "@/lib/utils";
import { XPCurveChart } from "@/components/game/XPCurveChart";

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="#e8e8e8" textAnchor="middle" dominantBaseline="central" fontSize={9} fontFamily="monospace">{`${(percent * 100).toFixed(0)}%`}</text>;
};

const DarkTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] px-3 py-2">
        <p className="font-mono text-[9px] text-[#555] uppercase tracking-widest mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="font-mono text-[11px] font-bold" style={{ color: p.color ?? "#8b5cf6" }}>{p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

interface Props {
  weeklyXpData: { day: string; xp: number }[];
  analytics: { completions: any[]; skills: any[]; focusSessions: any[] } | null;
  xpCurveData: { date: string; cumulative_xp: number }[];
}

export function AnalyticsClient({ weeklyXpData, analytics, xpCurveData }: Props) {
  const skills = analytics?.skills || [];
  const focusSessions = analytics?.focusSessions || [];
  const completions = analytics?.completions || [];

  const domainXpData = skills
    .filter((s) => s.xp > 0)
    .map((s) => ({ name: getDomainLabel(s.domain), xp: s.xp, color: getDomainColor(s.domain) }))
    .sort((a, b) => b.xp - a.xp);

  const totalFocusMinutes = focusSessions.reduce((s: number, f: any) => s + f.duration_minutes, 0);
  const totalXpEarned = completions.reduce((s: number, c: any) => s + c.xp_earned, 0);

  const focusByDomain: Record<string, number> = {};
  focusSessions.forEach((f: any) => { focusByDomain[f.domain] = (focusByDomain[f.domain] || 0) + f.duration_minutes; });
  const focusData = Object.entries(focusByDomain).map(([domain, minutes]) => ({
    name: getDomainLabel(domain), minutes, color: getDomainColor(domain),
  })).sort((a, b) => b.minutes - a.minutes);

  const stats = [
    { label: "Quests Done",    value: completions.length },
    { label: "Total XP",       value: totalXpEarned.toLocaleString() },
    { label: "Focus Hours",    value: `${Math.round(totalFocusMinutes / 60)}h` },
    { label: "Focus Sessions", value: focusSessions.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#444] mb-1">// ascension_os · analytics</p>
        <h1 className="font-mono text-xl font-bold text-[#e8e8e8]">Performance<span className="text-violet-500">_</span></h1>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(255,255,255,0.03)]">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#080808] p-5">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#555] mb-2">{s.label}</p>
            <p className="font-mono text-3xl font-bold text-[#e8e8e8]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* XP Progression curve */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] p-5">
        <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#444] mb-4">// xp_progression · 30_days</p>
        <XPCurveChart data={xpCurveData} />
      </div>

      {/* Weekly XP + Domain distribution */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] p-5">
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#444] mb-4">// weekly_xp</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyXpData} barSize={18}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#444", fontFamily: "monospace" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#444", fontFamily: "monospace" }} />
              <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
              <Bar dataKey="xp" fill="#8b5cf6" fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] p-5">
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#444] mb-4">// domain_xp_distribution</p>
          {domainXpData.length === 0 ? (
            <div className="flex h-[180px] items-center justify-center font-mono text-[10px] text-[#333]">
              no data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={domainXpData} dataKey="xp" nameKey="name" cx="50%" cy="50%" outerRadius={75} labelLine={false} label={renderCustomLabel}>
                  {domainXpData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val} XP`, ""]} contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0", fontSize: "11px", fontFamily: "monospace" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {focusData.length > 0 && (
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] p-5">
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#444] mb-4">// focus_time · by_domain</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={focusData} layout="vertical" barSize={14}>
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#444", fontFamily: "monospace" }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#444", fontFamily: "monospace" }} width={100} />
              <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
              <Bar dataKey="minutes" fillOpacity={0.8}>
                {focusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
