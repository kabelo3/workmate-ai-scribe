import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListTodo,
  Search,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, AiBadge } from "@/components/app/shared";

const stats = [
  { label: "AI requests this week", value: "1,284", change: "+12%", icon: Zap },
  { label: "Hours saved", value: "47.5", change: "+8.2h", icon: Clock },
  { label: "Tasks completed", value: "126", change: "+23", icon: CheckCircle2 },
  { label: "Productivity score", value: "92", change: "+4", icon: TrendingUp },
];

const quickActions = [
  { to: "/email", label: "Draft an email", icon: Mail, color: "from-blue-500 to-indigo-600" },
  { to: "/meetings", label: "Summarize meeting", icon: FileText, color: "from-purple-500 to-pink-500" },
  { to: "/tasks", label: "Plan my day", icon: ListTodo, color: "from-emerald-500 to-teal-600" },
  { to: "/research", label: "Research a topic", icon: Search, color: "from-amber-500 to-orange-600" },
];

const recentActivity = [
  { type: "Email", title: "Drafted follow-up to Acme Corp", time: "12 min ago", icon: Mail },
  { type: "Meeting", title: "Summarized Q3 planning sync", time: "1 hour ago", icon: FileText },
  { type: "Research", title: "Competitive landscape — vertical SaaS", time: "3 hours ago", icon: Search },
  { type: "Tasks", title: "Reprioritized 12 backlog items", time: "Yesterday", icon: ListTodo },
  { type: "Chat", title: "Brainstormed launch messaging", time: "Yesterday", icon: MessageSquare },
];

const upcoming = [
  { task: "Send revised proposal to client", due: "Today, 4:00 PM", priority: "High" },
  { task: "Review design specs for analytics dashboard", due: "Tomorrow", priority: "Medium" },
  { task: "Prep notes for weekly leadership sync", due: "Thu", priority: "Medium" },
  { task: "Approve marketing copy revisions", due: "Fri", priority: "Low" },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        icon={LayoutDashboard}
        title="Welcome back, Alex"
        description="Here's a snapshot of your AI-powered workflow today."
        actions={
          <Button asChild className="gradient-primary text-primary-foreground shadow-elegant hover:opacity-90">
            <Link to="/chat">
              <Sparkles className="size-4 mr-2" /> Ask AI
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card
            key={s.label}
            className="p-5 shadow-card hover:shadow-elegant transition-all animate-slide-up border-border/60"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="size-10 rounded-lg bg-accent/60 flex items-center justify-center">
                <s.icon className="size-5 text-accent-foreground" />
              </div>
              <span className="text-xs font-semibold text-success">{s.change}</span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Quick actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="group relative overflow-hidden rounded-xl p-5 bg-card border shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all"
            >
              <div className={`size-10 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center shadow-soft`}>
                <a.icon className="size-5 text-white" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold">{a.label}</span>
                <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <Card className="p-6 lg:col-span-2 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent AI activity</h2>
            <AiBadge />
          </div>
          <div className="divide-y divide-border/60">
            {recentActivity.map((r) => (
              <div key={r.title} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <r.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.type}</div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{r.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Upcoming tasks</h2>
            <Link to="/tasks" className="text-xs text-primary font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((u) => (
              <div key={u.task} className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 transition">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium leading-snug">{u.task}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      u.priority === "High"
                        ? "bg-destructive/15 text-destructive"
                        : u.priority === "Medium"
                          ? "bg-warning/20 text-warning-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {u.priority}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{u.due}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
