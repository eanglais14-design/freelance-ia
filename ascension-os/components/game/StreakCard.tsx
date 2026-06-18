import { Flame, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StreakCardProps {
  streak: number;
  className?: string;
}

export function StreakCard({ streak, className }: StreakCardProps) {
  const isHot = streak >= 7;
  const isOnFire = streak >= 30;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200",
      isOnFire ? "border-red-500/30 shadow-red-500/10 shadow-lg" :
      isHot ? "border-orange-500/30 shadow-orange-500/10 shadow-lg" :
      "card-glow",
      className
    )}>
      <div className={cn(
        "h-1 w-full",
        isOnFire ? "bg-gradient-to-r from-red-500 to-orange-500" :
        isHot ? "bg-gradient-to-r from-orange-500 to-amber-500" :
        "bg-gradient-to-r from-amber-500 to-yellow-500"
      )} />
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Streak</p>
            <div className="flex items-baseline gap-1">
              <span className={cn(
                "text-3xl font-bold",
                isOnFire ? "text-red-400" :
                isHot ? "text-orange-400" :
                "text-amber-400"
              )}>
                {streak}
              </span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </div>
          <div className={cn(
            "p-3 rounded-xl",
            isOnFire ? "bg-red-500/15" :
            isHot ? "bg-orange-500/15" :
            "bg-amber-500/15"
          )}>
            <Flame className={cn(
              "h-7 w-7",
              isOnFire ? "text-red-400 animate-pulse" :
              isHot ? "text-orange-400" :
              "text-amber-400"
            )} />
          </div>
        </div>
        {streak >= 3 && (
          <p className="text-xs text-muted-foreground mt-2">
            {isOnFire ? "🔥 On fire! Keep going!" :
             isHot ? "⚡ Great momentum!" :
             "✨ Streak active!"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
