import { useState } from "react";
import { Search, Sparkles, RefreshCw, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader, AiDisclaimer, TypingDots } from "@/components/app/shared";
import { simulateAi, researchInsights } from "@/lib/ai-sim";

type Result = ReturnType<typeof researchInsights>;

export function ResearchAssistant() {
  const [topic, setTopic] = useState("AI productivity tools in enterprise");
  const [notes, setNotes] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const run = async () => {
    setLoading(true);
    const out = await simulateAi(() => researchInsights(topic), 1100);
    setResult(out);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Synthesize topics, notes, and questions into executive-ready insights."
      />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input panel */}
        <Card className="p-6 shadow-card lg:col-span-2 space-y-4 h-fit">
          <div>
            <Label>Research topic</Label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Notes or source material (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Paste articles, notes, or context…"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Specific question (optional)</Label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What's driving enterprise adoption?"
              className="mt-1.5"
            />
          </div>
          <Button
            onClick={run}
            disabled={loading || !topic.trim()}
            className="w-full gradient-primary text-primary-foreground shadow-elegant hover:opacity-90"
          >
            {loading ? <><RefreshCw className="size-4 mr-2 animate-spin" /> Researching…</> : <><Sparkles className="size-4 mr-2" /> Generate Insights</>}
          </Button>
        </Card>

        {/* Insights */}
        <Card className="p-6 shadow-card lg:col-span-3 min-h-[500px]">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <div className="size-14 rounded-2xl bg-accent/50 flex items-center justify-center mb-3">
                <BookOpen className="size-6 text-accent-foreground" />
              </div>
              <p className="text-sm">Insights and executive summary will appear here.</p>
            </div>
          )}
          {loading && (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <TypingDots />
              <span className="text-sm">Synthesizing research…</span>
            </div>
          )}
          {result && !loading && (
            <div className="space-y-6 animate-fade-in">
              <section>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Executive Summary</h3>
                <p className="text-sm leading-relaxed text-foreground/90 border-l-2 border-primary pl-4 italic">
                  {result.executive}
                </p>
              </section>
              <section>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Key Insights</h3>
                <ul className="space-y-2">
                  {result.insights.map((i, idx) => (
                    <li key={idx} className="flex gap-3 text-sm">
                      <span className="size-5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Trends</h3>
                <div className="flex flex-wrap gap-2">
                  {result.trends.map((t, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-accent/60 text-accent-foreground border border-accent">
                      {t}
                    </span>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Recommendations</h3>
                <ol className="space-y-2 text-sm list-decimal list-inside marker:text-primary marker:font-semibold">
                  {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                </ol>
              </section>
              <div className="text-[11px] text-muted-foreground border-t pt-3">
                Sources: AI-synthesized from general knowledge. Verify with primary references before publishing.
              </div>
            </div>
          )}
        </Card>
      </div>

      <AiDisclaimer />
    </div>
  );
}
