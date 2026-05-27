import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListTodo,
  Search,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", icon: FileText },
  { to: "/tasks", label: "Task Planner", icon: ListTodo },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 sticky top-0 h-screen",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="size-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="size-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm">Workplace AI</span>
            <span className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">
              Productivity Suite
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <Icon className={cn("size-[18px] shrink-0", active && "text-sidebar-primary")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {active && !collapsed && (
                <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="m-3 p-3 rounded-xl bg-sidebar-accent/40 border border-sidebar-border">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-4 text-sidebar-primary" />
            <span className="text-xs font-semibold">Pro Plan</span>
          </div>
          <p className="text-[11px] text-sidebar-foreground/60 leading-relaxed">
            12,430 / 25,000 AI credits used this month
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-sidebar-border overflow-hidden">
            <div className="h-full w-1/2 gradient-primary rounded-full" />
          </div>
        </div>
      )}
    </aside>
  );
}
