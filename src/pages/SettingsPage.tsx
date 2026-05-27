import { Settings, User, Bell, Palette, Shield, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/app/shared";

const sections = [
  {
    icon: User,
    title: "Profile",
    description: "Your personal info and how you appear in the app.",
    content: (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Full name</Label><Input defaultValue="Alex Morgan" className="mt-1.5" /></div>
          <div><Label>Email</Label><Input defaultValue="alex@workplace.ai" className="mt-1.5" /></div>
        </div>
        <div><Label>Job title</Label><Input defaultValue="Head of Operations" className="mt-1.5" /></div>
      </div>
    ),
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Choose what you want to be notified about.",
    content: (
      <div className="space-y-3">
        {[
          ["AI task completions", true],
          ["Weekly productivity summary", true],
          ["Product updates", false],
          ["Tips & shortcuts", true],
        ].map(([label, on]) => (
          <div key={label as string} className="flex items-center justify-between py-2">
            <span className="text-sm">{label}</span>
            <Switch defaultChecked={on as boolean} />
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Palette,
    title: "Appearance",
    description: "Customize the look and feel of your workspace.",
    content: (
      <div className="space-y-3">
        <div className="flex items-center justify-between"><span className="text-sm">Reduced motion</span><Switch /></div>
        <div className="flex items-center justify-between"><span className="text-sm">Compact density</span><Switch /></div>
        <p className="text-xs text-muted-foreground pt-2">Use the moon icon in the top bar to toggle dark mode.</p>
      </div>
    ),
  },
  {
    icon: Shield,
    title: "Privacy & data",
    description: "Control how your data is used to improve AI outputs.",
    content: (
      <div className="space-y-3">
        <div className="flex items-center justify-between"><span className="text-sm">Allow anonymous usage analytics</span><Switch defaultChecked /></div>
        <div className="flex items-center justify-between"><span className="text-sm">Save AI history for personalization</span><Switch defaultChecked /></div>
        <Button variant="outline" size="sm" className="mt-2">Export my data</Button>
      </div>
    ),
  },
  {
    icon: CreditCard,
    title: "Billing",
    description: "Pro plan — $24/user/month",
    content: (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-accent/40 border border-accent">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Usage this month</div>
          <div className="text-2xl font-bold mt-1">12,430 <span className="text-sm text-muted-foreground font-normal">/ 25,000 credits</span></div>
          <div className="h-2 rounded-full bg-background mt-3 overflow-hidden">
            <div className="h-full w-1/2 gradient-primary rounded-full" />
          </div>
        </div>
        <Button variant="outline">Manage subscription</Button>
      </div>
    ),
  },
];

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        icon={Settings}
        title="Settings"
        description="Manage your account, notifications, and AI preferences."
      />

      {sections.map((s) => (
        <Card key={s.title} className="p-6 shadow-card">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-9 rounded-lg bg-accent/60 flex items-center justify-center shrink-0">
              <s.icon className="size-4 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">{s.title}</h2>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </div>
          </div>
          {s.content}
        </Card>
      ))}
    </div>
  );
}
