"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface WeeklyChartProps {
  data: { day: string; xp: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-[rgba(139,92,246,0.2)] px-3 py-2">
        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#555555]">{label}</p>
        <p className="font-mono text-sm font-bold text-violet-400">{payload[0].value} xp</p>
      </div>
    );
  }
  return null;
};

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxXp = Math.max(...data.map((d) => d.xp), 1);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} barSize={20} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="rgba(139,92,246,0.08)" strokeDasharray="0" />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: "#444444", fontFamily: "monospace" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: "#444444", fontFamily: "monospace" }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139,92,246,0.05)" }} />
        <Bar dataKey="xp" radius={[0, 0, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.xp === maxXp ? "#8b5cf6" : "rgba(139,92,246,0.25)"}
              fillOpacity={entry.xp > 0 ? 1 : 0.3}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
