"use client";
import { useState } from "react";
import { Plus, Sword, Zap } from "lucide-react";
import { Quest } from "@/types";
import { QuestCard } from "@/components/game/QuestCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { completeQuest, createQuest, deleteQuest } from "@/lib/actions/quests";
import { toast } from "@/components/ui/toaster";
import { Badge } from "@/components/ui/badge";

const DOMAINS = [
  { value: "fitness", label: "💪 Fitness" },
  { value: "ai_automation", label: "🤖 AI & Automation" },
  { value: "business_sales", label: "💼 Business & Sales" },
  { value: "mba_studies", label: "📚 MBA / Studies" },
  { value: "music_production", label: "🎵 Music Production" },
  { value: "mind_discipline", label: "🧠 Mind / Discipline" },
  { value: "social_networking", label: "🌐 Social / Networking" },
];

interface Props {
  daily: Quest[];
  weekly: Quest[];
  longterm: Quest[];
}

export function QuestsClient({ daily, weekly, longterm }: Props) {
  const [dailyQuests, setDailyQuests] = useState(daily);
  const [weeklyQuests, setWeeklyQuests] = useState(weekly);
  const [longtermQuests, setLongtermQuests] = useState(longterm);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", domain: "mind_discipline",
    difficulty: "medium", quest_type: "daily", due_date: "",
  });
  const [saving, setSaving] = useState(false);

  const handleComplete = async (questId: string) => {
    const result = await completeQuest(questId);
    if (result.success) {
      const update = (q: Quest) => q.id === questId ? { ...q, status: "completed" as const } : q;
      setDailyQuests((p) => p.map(update));
      setWeeklyQuests((p) => p.map(update));
      setLongtermQuests((p) => p.map(update));
      toast({ title: `+${result.xp} XP earned!`, variant: "success" });
    }
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const result = await createQuest(form);
    if (result.success) {
      toast({ title: "Quest created!", variant: "success" });
      setOpen(false);
      setForm({ title: "", description: "", domain: "mind_discipline", difficulty: "medium", quest_type: "daily", due_date: "" });
      window.location.reload();
    } else {
      toast({ title: "Error", description: result.error, variant: "error" });
    }
    setSaving(false);
  };

  const QuestList = ({ quests }: { quests: Quest[] }) => (
    <div className="space-y-2">
      {quests.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Sword className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No quests yet. Create one to begin.</p>
        </div>
      ) : (
        quests.map((q) => <QuestCard key={q.id} quest={q} onComplete={handleComplete} />)
      )}
    </div>
  );

  const completedCount = (quests: Quest[]) => quests.filter((q) => q.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quests</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Complete quests to earn XP and level up</p>
        </div>
        <Button onClick={() => setOpen(true)} variant="glow" size="sm">
          <Plus className="h-4 w-4" /> New Quest
        </Button>
      </div>

      <Tabs defaultValue="daily">
        <TabsList className="grid w-full grid-cols-3 max-w-sm">
          <TabsTrigger value="daily">
            Daily
            {completedCount(dailyQuests) > 0 && (
              <span className="ml-1.5 text-xs bg-green-500/20 text-green-400 rounded-full px-1.5 py-0.5">
                {completedCount(dailyQuests)}/{dailyQuests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="longterm">Long-term</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-4"><QuestList quests={dailyQuests} /></TabsContent>
        <TabsContent value="weekly" className="mt-4"><QuestList quests={weeklyQuests} /></TabsContent>
        <TabsContent value="longterm" className="mt-4"><QuestList quests={longtermQuests} /></TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Quest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input placeholder="Quest title..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Textarea placeholder="Details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="resize-none h-20" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Domain</Label>
                <Select value={form.domain} onValueChange={(v) => setForm({ ...form, domain: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DOMAINS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (25 XP)</SelectItem>
                    <SelectItem value="medium">Medium (50 XP)</SelectItem>
                    <SelectItem value="hard">Hard (100 XP)</SelectItem>
                    <SelectItem value="boss">Boss (250 XP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.quest_type} onValueChange={(v) => setForm({ ...form, quest_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="longterm">Long-term</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Due Date</Label>
                <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving} variant="glow">
              {saving ? "Creating..." : "Create Quest"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
