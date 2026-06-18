"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDomainColor, getDomainLabel } from "@/lib/utils";

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
        <p className="text-muted-foreground text-xs mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

interface Props {
  weeklyXpData: { day: string; xp: number }[];
  analytics: {
    completions: any[];
    skills: any[];
    focusSessions: any[];
  } | null;
}

export function AnalyticsClient({ weeklyXpData, analytics }: Props) {
  const skills = analytics?.skills || [];
  const focusSessions = analytics?.focusSessions || [];
  const completions = analytics?.completions || [];

  const domainXpData = skills
    .filter((s) => s.xp > 0)
    .map((s) => ({
      name: getDomainLabel(s.domain).replace(" / ", "\n").replace(" & ", "\n"),
      xp: s.xp,
      color: getDomainColor(s.domain),
    }))
    .sort((a, b) => b.xp - a.xp);

  const totalFocusMinutes = focusSessions.reduce((s: number, f: any) => s + f.duration_minutes, 0);
  const totalXpEarned = completions.reduce((s: number, c: any) => s + c.xp_earned, 0);

  // Focus sessions by domain
  const focusByDomain: Record<string, number> = {};
  focusSessions.forEach((f: any) => {
    focusByDomain[f.domain] = (focusByDomain[f.domain] || 0) + f.duration_minutes;
  });
  const focusData = Object.entries(focusByDomain).map(([domain, minutes]) => ({
    name: getDomainLabel(domain),
    minutes,
    color: getDomainColor(domain),
  })).sort((a, b) => b.minutes - a.minutes);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Performance insights over the last 30 days</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Quests Completed", value: completions.length, color: "text-green-400" },
          { label: "Total XP Earned", value: totalXpEarned.toLocaleString(), color: "text-violet-400" },
          { label: "Focus Hours", value: `${Math.round(totalFocusMinutes / 60)}h`, color: "text-blue-400" },
          { label: "Focus Sessions", value: focusSessions.length, color: "text-amber-400" },
        ].map((stat) => (
          <Card key={stat.label} className="card-glow">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="card-glow">
          <CardHeader><CardTitle className="text-sm">Weekly XP</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyXpData} barSize={32}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))" }} />
                <Bar dataKey="xp" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="XP" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardHeader><CardTitle className="text-sm">Domain XP Distribution</CardTitle></CardHeader>
          <CardContent>
            {domainXpData.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
                Complete quests to see distribution
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={domainXpData} dataKey="xp" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={renderCustomLabel}>
                    {domainXpData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val} XP`, ""]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {focusData.length > 0 && (
        <Card className="card-glow">
          <CardHeader><CardTitle className="text-sm">Focus Time by Domain (minutes)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={focusData} layout="vertical" barSize={20}>
                <CartesianGrid horizontal={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={120} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))" }} />
                <Bar dataKey="minutes" radius={[0, 4, 4, 0]} name="Minutes">
                  {focusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
