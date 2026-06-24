"use client";
import { useTransition } from "react";
import { FocusTimer } from "@/components/game/FocusTimer";
import { completeFocusSession } from "@/lib/actions/focus";
import { Domain } from "@/types";
import { toast } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Zap, Brain } from "lucide-react";

export default function FocusPage() {
  const [, startTransition] = useTransition();

  const handleFocusComplete = (domain: Domain, durationMinutes: number) => {
    startTransition(async () => {
      const result = await completeFocusSession(domain, durationMinutes);
      if (result.success) {
        toast({
          title: `Focus session complete! +${result.xp} XP`,
          description: `${durationMinutes} minutes of deep work`,
          variant: "success",
        });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Focus Mode</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Deep work sessions earn XP based on duration</p>
      </div>

      <FocusTimer onComplete={handleFocusComplete} />

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Timer, label: "25 min", desc: "+5 XP", color: "text-blue-400" },
          { icon: Brain, label: "50 min", desc: "+10 XP", color: "text-violet-400" },
          { icon: Zap, label: "90 min", desc: "+18 XP", color: "text-amber-400" },
        ].map((item) => (
          <Card key={item.label} className="card-glow">
            <CardContent className="p-4 text-center">
              <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
              <p className="font-semibold text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-violet-500/20 bg-violet-500/5">
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-1 text-violet-300">How XP works</p>
          <p className="text-xs text-muted-foreground">
            Each completed session earns <span className="text-foreground">1 XP per 5 minutes</span> of focus time.
            XP is added to your global level and the selected domain skill.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
