import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Plus, Trash2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, AiDisclaimer, TypingDots, AiBadge } from "@/components/app/shared";
import { simulateAi, chatReply } from "@/lib/ai-sim";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "user" | "assistant"; text: string };
type Thread = { id: string; title: string; category: string; updatedAt: number; messages: Msg[] };

const STORAGE_KEY = "workplace-ai-threads";

const suggestedPrompts = [
  "Summarize this report",
  "Draft a client follow-up",
  "Plan my workday",
  "Generate meeting action items",
];

const categorize = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes("email")) return "Email";
  if (t.includes("summar")) return "Summary";
  if (t.includes("plan") || t.includes("schedule")) return "Planning";
  if (t.includes("research")) return "Research";
  return "General";
};

function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const id = "t-" + Date.now();
  return [{ id, title: "New conversation", category: "General", updatedAt: Date.now(), messages: [] }];
}

export function ChatPage() {
  const [threads, setThreads] = useState<Thread[]>(() => loadThreads());
  const [activeId, setActiveId] = useState<string>(() => loadThreads()[0]?.id ?? "");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [threads, activeId, sending]);

  useEffect(() => { inputRef.current?.focus(); }, [activeId]);

  const active = threads.find((t) => t.id === activeId) ?? threads[0];

  const newThread = () => {
    const id = "t-" + Date.now();
    const t: Thread = { id, title: "New conversation", category: "General", updatedAt: Date.now(), messages: [] };
    setThreads((prev) => [t, ...prev]);
    setActiveId(id);
  };

  const removeThread = (id: string) => {
    setThreads((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) {
        const fresh: Thread = { id: "t-" + Date.now(), title: "New conversation", category: "General", updatedAt: Date.now(), messages: [] };
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  const send = async (text: string) => {
    if (!text.trim() || sending) return;
    setInput("");
    const userMsg: Msg = { id: "m-" + Date.now(), role: "user", text };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? {
              ...t,
              title: t.messages.length === 0 ? text.slice(0, 40) : t.title,
              category: t.messages.length === 0 ? categorize(text) : t.category,
              updatedAt: Date.now(),
              messages: [...t.messages, userMsg],
            }
          : t,
      ),
    );
    setSending(true);
    const reply = await simulateAi(() => chatReply(text), 800);
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, updatedAt: Date.now(), messages: [...t.messages, { id: "m-" + (Date.now() + 1), role: "assistant", text: reply }] }
          : t,
      ),
    );
    setSending(false);
  };

  if (!active) return null;

  return (
    <div className="space-y-4">
      <PageHeader
        icon={MessageSquare}
        title="AI Chat Workspace"
        description="Brainstorm, draft, and plan with your always-on AI assistant."
      />

      <div className="grid md:grid-cols-[260px_1fr] gap-4 h-[calc(100vh-280px)] min-h-[500px]">
        {/* Thread list */}
        <Card className="p-3 shadow-card flex flex-col overflow-hidden">
          <Button onClick={newThread} className="gradient-primary text-primary-foreground shadow-soft hover:opacity-90 mb-3">
            <Plus className="size-4 mr-1" /> New chat
          </Button>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-1">
            Conversations
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {threads.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "group flex items-start gap-2 rounded-lg p-2 cursor-pointer transition",
                  t.id === activeId ? "bg-accent/70" : "hover:bg-muted/60",
                )}
                onClick={() => setActiveId(t.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.title}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-muted text-[9px] font-semibold">{t.category}</span>
                    <span>{new Date(t.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeThread(t.id); }}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat window */}
        <Card className="shadow-card flex flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {active.messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="size-14 rounded-2xl gradient-primary flex items-center justify-center mb-3 shadow-elegant">
                  <Sparkles className="size-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg">How can I help today?</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  Ask me to draft, summarize, plan, or research anything for your work.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 mt-6 max-w-lg w-full">
                  {suggestedPrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="text-left text-sm p-3 rounded-xl border bg-card hover:border-primary hover:shadow-card transition"
                    >
                      <Sparkles className="size-3.5 text-primary inline mr-2" />
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {active.messages.map((m) => (
              <div key={m.id} className={cn("flex gap-3 animate-fade-in", m.role === "user" && "flex-row-reverse")}>
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "gradient-primary text-primary-foreground",
                  )}
                >
                  {m.role === "user" ? "AM" : <Sparkles className="size-4" />}
                </div>
                <div className={cn("max-w-[78%]", m.role === "user" && "items-end flex flex-col")}>
                  {m.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold">Workplace AI</span>
                      <AiBadge />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted/60 text-foreground rounded-tl-sm",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex gap-3">
                <div className="size-8 rounded-full gradient-primary text-primary-foreground flex items-center justify-center">
                  <Sparkles className="size-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Message Workplace AI…"
                className="flex-1 resize-none rounded-xl border bg-muted/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background max-h-32"
              />
              <Button
                onClick={() => send(input)}
                disabled={!input.trim() || sending}
                className="gradient-primary text-primary-foreground shadow-soft hover:opacity-90 shrink-0"
                size="icon"
              >
                <Send className="size-4" />
              </Button>
            </div>
            <AiDisclaimer className="mt-3" />
          </div>
        </Card>
      </div>
    </div>
  );
}
