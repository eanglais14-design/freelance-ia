"use client";
import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { Objective } from "@/types";
import { ObjectiveCard } from "@/components/game/ObjectiveCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createObjective, completeMilestone, addMilestone } from "@/lib/actions/objectives";
import { toast } from "@/components/ui/toaster";

const DOMAINS = [
  { value: "fitness", label: "💪 Fitness" },
  { value: "ai_automation", label: "🤖 AI & Automation" },
  { value: "business_sales", label: "💼 Business & Sales" },
  { value: "mba_studies", label: "📚 MBA / Studies" },
  { value: "music_production", label: "🎵 Music Production" },
  { value: "mind_discipline", label: "🧠 Mind / Discipline" },
  { value: "social_networking", label: "🌐 Social / Networking" },
];

export function ObjectivesClient({ objectives: initial }: { objectives: Objective[] }) {
  const [objectives, setObjectives] = useState(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", domain: "ai_automation", due_date: "" });
  const [milestoneInputs, setMilestoneInputs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const result = await createObjective(form);
    if (result.success) {
      toast({ title: "Objective created!", variant: "success" });
      setOpen(false);
      setForm({ title: "", description: "", domain: "ai_automation", due_date: "" });
      window.location.reload();
    } else {
      toast({ title: "Error", description: result.error, variant: "error" });
    }
    setSaving(false);
  };

  const handleMilestoneComplete = async (milestoneId: string) => {
    await completeMilestone(milestoneId);
    toast({ title: "Milestone completed! +25 XP", variant: "success" });
    window.location.reload();
  };

  const handleAddMilestone = async (objectiveId: string) => {
    const title = milestoneInputs[objectiveId];
    if (!title?.trim()) return;
    await addMilestone(objectiveId, title, 25);
    setMilestoneInputs((prev) => ({ ...prev, [objectiveId]: "" }));
    toast({ title: "Milestone added!", variant: "success" });
    window.location.reload();
  };

  const active = objectives.filter((o) => o.status === "active");
  const completed = objectives.filter((o) => o.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Objectives</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Long-term main quests with milestones</p>
        </div>
        <Button onClick={() => setOpen(true)} variant="glow" size="sm">
          <Plus className="h-4 w-4" /> New Objective
        </Button>
      </div>

      {active.length === 0 && completed.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No objectives yet</p>
          <p className="text-sm mt-1">Set a long-term goal to track your progress</p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">Active ({active.length})</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {active.map((obj) => (
                  <div key={obj.id} className="space-y-2">
                    <ObjectiveCard objective={obj} onMilestoneComplete={handleMilestoneComplete} />
                    <div className="flex gap-2 px-1">
                      <Input
                        placeholder="Add milestone..."
                        value={milestoneInputs[obj.id] || ""}
                        onChange={(e) => setMilestoneInputs((p) => ({ ...p, [obj.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && handleAddMilestone(obj.id)}
                        className="h-8 text-xs"
                      />
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleAddMilestone(obj.id)}>Add</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">Completed ({completed.length})</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {completed.map((obj) => <ObjectiveCard key={obj.id} objective={obj} />)}
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Objective</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input placeholder="e.g. Get international internship" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea placeholder="Why this matters..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="resize-none h-20" />
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
                <Label>Target Date</Label>
                <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving} variant="glow">{saving ? "Creating..." : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
