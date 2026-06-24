"use client";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDomainLabel, getDomainColor, getDomainIcon } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Domain } from "@/types";

const DOMAINS: Domain[] = ["fitness", "ai_automation", "business_sales", "mba_studies", "music_production", "mind_discipline", "social_networking"];
const DURATIONS = [{ label: "25 min", value: 25 }, { label: "50 min", value: 50 }, { label: "90 min", value: 90 }];

interface FocusTimerProps {
  onComplete?: (domain: Domain, durationMinutes: number) => void;
}

export function FocusTimer({ onComplete }: FocusTimerProps) {
  const [selectedDomain, setSelectedDomain] = useState<Domain>("ai_automation");
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = duration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const color = getDomainColor(selectedDomain);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            onComplete?.(selectedDomain, duration);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft, selectedDomain, duration, onComplete]);

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (val: string) => {
    const d = parseInt(val);
    setDuration(d);
    setTimeLeft(d * 60);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="overflow-hidden card-glow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <span>Focus Timer</span>
          {isRunning && <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Select value={selectedDomain} onValueChange={(v) => setSelectedDomain(v as Domain)} disabled={isRunning}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOMAINS.map((d) => (
                <SelectItem key={d} value={d}>
                  {getDomainIcon(d)} {getDomainLabel(d)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(duration)} onValueChange={handleDurationChange} disabled={isRunning}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATIONS.map((d) => (
                <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative h-32 w-32">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke={isCompleted ? "#22c55e" : color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tabular-nums">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
              {isCompleted && <span className="text-xs text-green-400 font-medium">Done!</span>}
            </div>
          </div>

          {isCompleted && (
            <div className="flex items-center gap-1.5 text-sm text-green-400 font-medium">
              <Zap className="h-4 w-4" />
              <span>+{Math.floor(duration / 5)} XP earned!</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="h-10 w-10"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant={isRunning ? "outline" : "glow"}
              onClick={() => setIsRunning(!isRunning)}
              disabled={isCompleted}
              className="w-32"
            >
              {isRunning ? (
                <><Pause className="h-4 w-4" /> Pause</>
              ) : (
                <><Play className="h-4 w-4" /> {timeLeft < totalSeconds ? "Resume" : "Start"}</>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
