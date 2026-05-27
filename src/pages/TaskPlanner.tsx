import { useState } from "react";
import { ListTodo, Plus, Sparkles, X, GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageHeader, AiDisclaimer, AiBadge } from "@/components/app/shared";
import { simulateAi, prioritizeTasks } from "@/lib/ai-sim";
import { toast } from "sonner";

type Task = {
  id: string;
  title: string;
  urgency: "High" | "Medium" | "Low";
  duration: string;
  status: "todo" | "doing" | "done";
  priority?: string;
  suggestedSlot?: string;
};

const initialTasks: Task[] = [
  { id: "1", title: "Finalize Q3 OKRs document", urgency: "High", duration: "2h", status: "todo" },
  { id: "2", title: "Review pull requests from team", urgency: "Medium", duration: "45m", status: "doing" },
  { id: "3", title: "Prep slides for board meeting", urgency: "High", duration: "3h", status: "todo" },
  { id: "4", title: "Update CRM with new leads", urgency: "Low", duration: "30m", status: "todo" },
  { id: "5", title: "Schedule 1:1s for next week", urgency: "Medium", duration: "20m", status: "done" },
  { id: "6", title: "Draft launch announcement", urgency: "Medium", duration: "1.5h", status: "todo" },
];

const columns = [
  { key: "todo", label: "To Do", color: "bg-muted" },
  { key: "doing", label: "In Progress", color: "bg-accent/60" },
  { key: "done", label: "Done", color: "bg-success/20" },
] as const;

export function TaskPlanner() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTitle, setNewTitle] = useState("");
  const [newUrgency, setNewUrgency] = useState<Task["urgency"]>("Medium");
  const [planning, setPlanning] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const addTask = () => {
    if (!newTitle.trim()) return;
    setTasks((t) => [
      ...t,
      { id: String(Date.now()), title: newTitle, urgency: newUrgency, duration: "1h", status: "todo" },
    ]);
    setNewTitle("");
  };

  const removeTask = (id: string) =>
    setTasks((t) => t.filter((x) => x.id !== id));

  const runPlanner = async () => {
    setPlanning(true);
    const prioritized = await simulateAi(() => prioritizeTasks(tasks.map(({ title, urgency, duration }) => ({ title, urgency, duration }))));
    setTasks((prev) =>
      prev.map((t) => {
        const found = prioritized.find((p) => p.title === t.title);
        return found ? { ...t, priority: found.priority, suggestedSlot: found.suggestedSlot } : t;
      }),
    );
    setPlanning(false);
    toast.success("AI prioritized your tasks");
  };

  const moveTo = (id: string, status: Task["status"]) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

  const completed = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ListTodo}
        title="AI Task Planner"
        description="Capture work, let AI prioritize, and execute on a focus-driven schedule."
        actions={
          <Button
            onClick={runPlanner}
            disabled={planning}
            className="gradient-primary text-primary-foreground shadow-elegant hover:opacity-90"
          >
            <Sparkles className="size-4 mr-2" />
            {planning ? "Prioritizing…" : "AI Prioritize"}
          </Button>
        }
      />

      {/* Progress */}
      <Card className="p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold">Today's progress</div>
            <div className="text-xs text-muted-foreground">{completed} of {total} tasks complete</div>
          </div>
          <div className="text-2xl font-bold text-gradient">{progress}%</div>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </Card>

      {/* Add task */}
      <Card className="p-4 shadow-card flex flex-col sm:flex-row gap-2">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task…"
          className="flex-1"
        />
        <Select value={newUrgency} onValueChange={(v) => setNewUrgency(v as Task["urgency"])}>
          <SelectTrigger className="sm:w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addTask}><Plus className="size-4 mr-1" /> Add</Button>
      </Card>

      {/* Kanban */}
      <div className="grid md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div
            key={col.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => draggedId && moveTo(draggedId, col.key)}
            className="rounded-xl border bg-card/50 p-3 min-h-[400px]"
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${col.color}`} />
                <span className="text-sm font-semibold">{col.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {tasks.filter((t) => t.status === col.key).length}
              </span>
            </div>
            <div className="space-y-2">
              {tasks.filter((t) => t.status === col.key).map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={() => setDraggedId(t.id)}
                  onDragEnd={() => setDraggedId(null)}
                  className="group p-3 rounded-lg bg-card border shadow-soft hover:shadow-card transition cursor-grab active:cursor-grabbing animate-fade-in"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="size-4 text-muted-foreground/60 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium leading-snug">{t.title}</div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            t.urgency === "High"
                              ? "bg-destructive/15 text-destructive"
                              : t.urgency === "Medium"
                                ? "bg-warning/20 text-warning-foreground"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {t.urgency}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{t.duration}</span>
                        {t.priority && <AiBadge />}
                      </div>
                      {t.suggestedSlot && (
                        <div className="text-[11px] text-primary mt-1.5 flex items-center gap-1">
                          <Sparkles className="size-3" /> {t.suggestedSlot}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeTask(t.id)}
                      className="opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AiDisclaimer />
    </div>
  );
}
