import { useState } from "react";
import { FileText, Upload, Download, Sparkles, RefreshCw, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, AiDisclaimer, TypingDots } from "@/components/app/shared";
import { simulateAi, summarizeMeeting } from "@/lib/ai-sim";
import { toast } from "sonner";

type Summary = ReturnType<typeof summarizeMeeting>;

function Section({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/60 transition text-sm font-semibold"
      >
        {title}
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

export function MeetingSummarizer() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Summary | null>(null);
  const [dragging, setDragging] = useState(false);

  const run = async () => {
    if (!transcript.trim()) {
      toast.error("Please paste a transcript first");
      return;
    }
    setLoading(true);
    const out = await simulateAi(() => summarizeMeeting(transcript), 1200);
    setResult(out);
    setLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      file.text().then((t) => {
        setTranscript(t);
        toast.success(`Loaded ${file.name}`);
      });
    }
  };

  const exportSummary = () => {
    if (!result) return;
    const text = `MEETING SUMMARY\n\n${result.summary}\n\nKEY POINTS\n${result.keyPoints.map((p) => "• " + p).join("\n")}\n\nACTION ITEMS\n${result.actionItems.map((a) => `[${a.owner}] ${a.task} — due ${a.due}`).join("\n")}\n\nRISKS\n${result.risks.map((r) => "⚠ " + r).join("\n")}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meeting-summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Turn raw transcripts into structured summaries, action items, and risk flags."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-card space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
              dragging ? "border-primary bg-accent/40" : "border-border hover:border-primary/40"
            }`}
          >
            <Upload className="size-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Drag and drop a .txt transcript, or paste below
            </p>
          </div>
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={12}
            placeholder="Paste your meeting transcript or notes here…"
            className="font-mono text-sm"
          />
          <Button
            onClick={run}
            disabled={loading}
            className="w-full gradient-primary text-primary-foreground shadow-elegant hover:opacity-90"
          >
            {loading ? <><RefreshCw className="size-4 mr-2 animate-spin" /> Summarizing…</> : <><Sparkles className="size-4 mr-2" /> Generate Summary</>}
          </Button>
        </Card>

        <Card className="p-6 shadow-card min-h-[500px]">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <div className="size-14 rounded-2xl bg-accent/50 flex items-center justify-center mb-3">
                <FileText className="size-6 text-accent-foreground" />
              </div>
              <p className="text-sm">Your structured summary will appear here.</p>
            </div>
          )}
          {loading && (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <TypingDots />
              <span className="text-sm">Extracting key points and action items…</span>
            </div>
          )}
          {result && !loading && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex justify-end">
                <Button size="sm" variant="outline" onClick={exportSummary}>
                  <Download className="size-3.5 mr-1.5" /> Export
                </Button>
              </div>
              <Section title="Summary">
                <p className="text-sm leading-relaxed text-foreground/90">{result.summary}</p>
              </Section>
              <Section title="Key Discussion Points">
                <ul className="space-y-2 text-sm">
                  {result.keyPoints.map((p, i) => (
                    <li key={i} className="flex gap-2"><span className="text-primary">•</span>{p}</li>
                  ))}
                </ul>
              </Section>
              <Section title={`Action Items (${result.actionItems.length})`}>
                <div className="space-y-2">
                  {result.actionItems.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
                      <div className="size-7 rounded-full gradient-primary text-primary-foreground text-xs font-semibold flex items-center justify-center shrink-0">
                        {a.owner[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{a.task}</div>
                        <div className="text-xs text-muted-foreground">{a.owner} · due {a.due}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="Risks & Blockers" defaultOpen={false}>
                <ul className="space-y-2 text-sm">
                  {result.risks.map((r, i) => (
                    <li key={i} className="flex gap-2 text-warning-foreground"><span>⚠</span>{r}</li>
                  ))}
                </ul>
              </Section>
            </div>
          )}
        </Card>
      </div>

      <AiDisclaimer />
    </div>
  );
}
