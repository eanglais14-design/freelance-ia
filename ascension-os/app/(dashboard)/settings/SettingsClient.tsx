"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toaster";
import { RankBadge } from "@/components/game/RankBadge";
import { calculateLevel, getRank, calculateXpProgress } from "@/lib/utils";
import { Zap, Coins, Flame, User, Shield, Trash2 } from "lucide-react";

interface Props {
  profile: any;
  email: string;
}

export function SettingsClient({ profile, email }: Props) {
  const [username, setUsername] = useState(profile?.username || "");
  const [saving, setSaving] = useState(false);

  if (!profile) return (
    <div className="text-center py-20 text-muted-foreground">
      <p>Profile not found. Please log out and back in.</p>
    </div>
  );

  const level = calculateLevel(profile.total_xp);
  const rank = getRank(level);
  const { current, required, percentage } = calculateXpProgress(profile.total_xp);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", profile.id);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "error" });
    } else {
      toast({ title: "Profile updated!", variant: "success" });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your profile and account</p>
      </div>

      {/* Profile card */}
      <Card className="card-glow">
        <CardHeader><CardTitle className="text-base">Your Hunter Profile</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-secondary/50">
            <RankBadge rank={rank} size="lg" showLabel />
            <div>
              <p className="text-xl font-bold">{profile.username}</p>
              <p className="text-sm text-muted-foreground">Level {level} Hunter</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-violet-400" />{profile.total_xp.toLocaleString()} XP</span>
                <span className="flex items-center gap-1"><Coins className="h-3 w-3 text-amber-400" />{profile.coins} Coins</span>
                <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-orange-400" />{profile.streak} Streak</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <div className="flex gap-2">
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Button onClick={handleSave} disabled={saving} variant="glow" className="shrink-0">
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={email} disabled className="opacity-60" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="card-glow">
        <CardHeader><CardTitle className="text-base">Progress Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Level", value: level, color: "text-violet-400" },
              { label: "Rank", value: rank, color: `rank-${rank}` },
              { label: "Total XP", value: profile.total_xp.toLocaleString(), color: "text-violet-400" },
              { label: "Coins", value: profile.coins, color: "text-amber-400" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-lg bg-secondary/50">
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
