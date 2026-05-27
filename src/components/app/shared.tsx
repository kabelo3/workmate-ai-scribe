import { Sparkles, Info } from "lucide-react";

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 text-xs text-muted-foreground bg-accent/40 border border-accent/60 rounded-lg px-3 py-2 ${className}`}
    >
      <Info className="size-3.5 mt-0.5 shrink-0 text-accent-foreground" />
      <span>AI-generated content may require human review.</span>
    </div>
  );
}

export function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full gradient-primary text-primary-foreground">
      <Sparkles className="size-2.5" /> AI
    </span>
  );
}

export function TypingDots() {
  return (
    <span className="inline-flex gap-1 items-center">
      <span className="typing-dot size-1.5 rounded-full bg-current" />
      <span className="typing-dot size-1.5 rounded-full bg-current" />
      <span className="typing-dot size-1.5 rounded-full bg-current" />
    </span>
  );
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div className="flex items-start gap-4">
        <div className="size-12 rounded-xl gradient-primary flex items-center justify-center shadow-elegant shrink-0">
          <Icon className="size-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>
        </div>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
