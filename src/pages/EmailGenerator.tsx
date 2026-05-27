import { useState } from "react";
import { Mail, Copy, RefreshCw, Wand2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, AiDisclaimer, TypingDots } from "@/components/app/shared";
import { simulateAi, generateEmail } from "@/lib/ai-sim";

const tones = ["Professional", "Friendly", "Persuasive", "Formal", "Casual"];
const lengths = ["Short", "Medium", "Long"];

export function EmailGenerator() {
  const [purpose, setPurpose] = useState("Follow up after our discovery call to confirm next steps and propose a date for the demo.");
  const [recipient, setRecipient] = useState("Sarah Chen, VP Operations at Acme Corp");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [keyPoints, setKeyPoints] = useState("Recap of the three pain points discussed\nProposed pilot scope and timeline\nAvailability for a 30-min demo next week");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);

  const run = async () => {
    setLoading(true);
    const out = await simulateAi(() =>
      generateEmail({ purpose, recipient, tone, length, keyPoints }),
    );
    setResult(out);
    setLoading(false);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Draft professional emails in seconds with audience-aware tone and structure."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="p-6 shadow-card space-y-4">
          <div>
            <Label>Email purpose</Label>
            <Textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={2}
              className="mt-1.5"
              placeholder="What's the goal of this email?"
            />
          </div>
          <div>
            <Label>Recipient</Label>
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-1.5"
              placeholder="Name, role, company"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {lengths.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Key points (one per line)</Label>
            <Textarea
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              rows={5}
              className="mt-1.5"
            />
          </div>
          <Button
            onClick={run}
            disabled={loading}
            className="w-full gradient-primary text-primary-foreground shadow-elegant hover:opacity-90"
          >
            {loading ? <><RefreshCw className="size-4 mr-2 animate-spin" /> Generating…</> : <><Sparkles className="size-4 mr-2" /> Generate Email</>}
          </Button>
        </Card>

        {/* Output */}
        <Card className="p-6 shadow-card flex flex-col min-h-[400px]">
          {!result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
              <div className="size-14 rounded-2xl bg-accent/50 flex items-center justify-center mb-3">
                <Wand2 className="size-6 text-accent-foreground" />
              </div>
              <p className="text-sm">Your AI-generated email will appear here.</p>
            </div>
          )}
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <TypingDots />
              <span className="text-sm">Crafting your email…</span>
            </div>
          )}
          {result && !loading && (
            <div className="flex-1 flex flex-col animate-fade-in">
              <div className="mb-4 pb-4 border-b">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Subject</Label>
                <div className="flex items-center justify-between gap-3 mt-1">
                  <p className="font-semibold">{result.subject}</p>
                  <Button size="sm" variant="ghost" onClick={() => copy(result.subject)}>
                    <Copy className="size-3.5" />
                  </Button>
                </div>
              </div>
              <pre className="flex-1 whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90 overflow-auto">
                {result.body}
              </pre>
              <div className="flex flex-wrap gap-2 pt-4 border-t mt-4">
                <Button size="sm" variant="outline" onClick={() => copy(`${result.subject}\n\n${result.body}`)}>
                  <Copy className="size-3.5 mr-1.5" /> Copy
                </Button>
                <Button size="sm" variant="outline" onClick={run}>
                  <RefreshCw className="size-3.5 mr-1.5" /> Rewrite
                </Button>
                <Button size="sm" variant="outline">Improve grammar</Button>
                <Button size="sm" variant="outline">Shorten</Button>
                <Button size="sm" variant="outline">Expand</Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <AiDisclaimer />
    </div>
  );
}
