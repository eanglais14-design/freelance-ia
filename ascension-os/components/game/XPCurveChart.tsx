"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { date: string; cumulative_xp: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] px-3 py-2">
        <p className="font-mono text-[9px] text-[#555] uppercase tracking-widest">{label}</p>
        <p className="font-mono text-sm font-bold text-violet-400">{payload[0].value.toLocaleString()} xp</p>
      </div>
    );
  }
  return null;
};

export function XPCurveChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: "#444444", fontFamily: "monospace" }}
          tickFormatter={(v: string) => v.slice(5)}
          interval={4}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: "#444444", fontFamily: "monospace" }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(139,92,246,0.3)", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="cumulative_xp"
          stroke="#8b5cf6"
          strokeWidth={1.5}
          fill="url(#xpGradient)"
          dot={false}
          activeDot={{ r: 3, fill: "#8b5cf6", stroke: "none" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
