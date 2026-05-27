// Simulated AI engine — produces realistic structured outputs locally.
// Replace with real model calls when wiring backend.

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function simulateAi<T>(producer: () => T, ms = 900): Promise<T> {
  await delay(ms + Math.random() * 600);
  return producer();
}

export function generateEmail(input: {
  purpose: string;
  recipient: string;
  tone: string;
  length: string;
  keyPoints: string;
}) {
  const greetings: Record<string, string> = {
    Professional: "Dear",
    Formal: "Dear",
    Friendly: "Hi",
    Casual: "Hey",
    Persuasive: "Hello",
  };
  const greet = greetings[input.tone] ?? "Hello";
  const recipient = input.recipient || "Team";
  const points = input.keyPoints
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const subject =
    input.purpose
      ? `Re: ${input.purpose.split(/[.!?]/)[0].slice(0, 70)}`
      : "Quick Update";

  const opener =
    input.tone === "Persuasive"
      ? `I'm reaching out because I believe this presents a meaningful opportunity.`
      : input.tone === "Friendly" || input.tone === "Casual"
        ? `Hope you're doing well! Wanted to drop you a quick note.`
        : `I hope this message finds you well. I'm writing to follow up on the matter below.`;

  const body =
    points.length > 0
      ? `\n\nKey points:\n${points.map((p) => `• ${p}`).join("\n")}`
      : `\n\n${input.purpose || "Please find the relevant details below for your review."}`;

  const closer =
    input.length === "Short"
      ? `\n\nLooking forward to your response.`
      : `\n\nPlease let me know your thoughts at your earliest convenience. I'm happy to discuss further or provide additional context as needed.`;

  const sign =
    input.tone === "Casual" || input.tone === "Friendly"
      ? "\n\nThanks,\nAlex"
      : "\n\nBest regards,\nAlex Morgan";

  return {
    subject,
    body: `${greet} ${recipient},\n\n${opener}${body}${closer}${sign}`,
  };
}

export function summarizeMeeting(transcript: string) {
  const len = transcript.length;
  return {
    summary: `The team aligned on Q3 roadmap priorities, focusing on shipping the analytics dashboard and improving onboarding conversion. Discussion covered resource allocation, dependency risks, and a proposed two-week sprint cadence. Overall consensus achieved on direction; final scope to be confirmed by EOW.`,
    keyPoints: [
      "Q3 priority is analytics dashboard launch (target: Aug 28)",
      "Onboarding revamp moved up to immediately after launch",
      "Design team has 1.5 FTE bandwidth — may need contractor support",
      "Engineering capacity confirmed for 4 sprints",
      `Source transcript: ${len} characters analyzed`,
    ],
    actionItems: [
      { owner: "Priya", task: "Finalize analytics dashboard specs", due: "Aug 12" },
      { owner: "Marcus", task: "Audit current onboarding funnel metrics", due: "Aug 9" },
      { owner: "Alex", task: "Confirm contractor budget with finance", due: "Aug 8" },
      { owner: "Jamie", task: "Schedule weekly progress sync", due: "Ongoing" },
    ],
    risks: [
      "Contractor onboarding could delay Sprint 2 if not started this week",
      "Analytics data pipeline still pending DevOps review",
    ],
  };
}

export function prioritizeTasks(tasks: { title: string; urgency: string; duration: string }[]) {
  return tasks
    .map((t, i) => ({
      ...t,
      id: `t-${i}`,
      priority:
        t.urgency === "High" ? "P0 — Do First" : t.urgency === "Medium" ? "P1 — Schedule" : "P2 — Backlog",
      suggestedSlot:
        t.urgency === "High" ? "Today 9:00–11:00 (deep focus)" : "Tomorrow afternoon",
    }))
    .sort((a, b) => a.priority.localeCompare(b.priority));
}

export function researchInsights(topic: string) {
  return {
    executive: `${topic || "The selected topic"} is experiencing accelerated adoption driven by enterprise demand for measurable productivity gains. Key vendors are consolidating, pricing models are shifting toward usage-based tiers, and integration depth is becoming the primary differentiator.`,
    insights: [
      "Market CAGR projected at 24–28% through 2027",
      "Enterprise buyers prioritize security and audit trails over raw model quality",
      "Vertical-specific solutions outperform horizontal platforms in retention",
      "Average time-to-value has dropped from 90 to 21 days year-over-year",
    ],
    trends: [
      "Shift from chat-only interfaces to embedded workflow assistants",
      "Rising importance of on-premise and VPC deployment options",
      "Multi-agent orchestration emerging as a category",
    ],
    recommendations: [
      "Prioritize integration breadth over model benchmarks in vendor evaluation",
      "Pilot in a single high-volume workflow before broad rollout",
      "Establish governance and review processes before scaling AI usage",
    ],
  };
}

export function chatReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("email") || m.includes("draft"))
    return "I can draft that for you. Could you share the recipient, the main goal of the message, and the tone you'd like (professional, friendly, persuasive)? I'll generate a polished draft along with a subject line.";
  if (m.includes("summar"))
    return "Sure — paste the transcript or notes you'd like summarized, and I'll extract a concise overview, key decisions, action items with owners, and any flagged risks.";
  if (m.includes("plan") || m.includes("workday") || m.includes("schedule"))
    return "Here's a suggested structure for your day:\n\n• 9:00–10:30 — Deep focus on highest-priority task\n• 10:30–11:00 — Email triage and quick replies\n• 11:00–12:30 — Collaborative meetings\n• 13:30–15:00 — Second focus block\n• 15:00–16:00 — Reviews and admin\n• 16:00–17:00 — Tomorrow prep and shutdown\n\nWant me to slot specific tasks into these blocks?";
  if (m.includes("action item"))
    return "To extract action items I'll need the meeting notes. Once you share them I'll produce a clean list with owner, task, and deadline — formatted so you can drop it straight into your tracker.";
  return `Got it — here's how I'd approach "${message.slice(0, 80)}":\n\n1. Clarify the desired outcome and audience\n2. Gather the relevant context and constraints\n3. Draft a structured response with clear next steps\n\nWould you like me to go deeper on any of these, or produce a finished output now?`;
}
