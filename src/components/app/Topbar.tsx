import { Menu, Moon, Sun, Bell, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar({
  onToggleSidebar,
  dark,
  onToggleDark,
}: {
  onToggleSidebar: () => void;
  dark: boolean;
  onToggleDark: () => void;
}) {
  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="shrink-0">
        <Menu className="size-5" />
      </Button>

      <div className="relative hidden sm:block flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          placeholder="Search tasks, summaries, emails…"
          className="w-full pl-10 pr-4 h-10 rounded-lg border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleDark} aria-label="Toggle theme">
          {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-muted transition">
              <div className="size-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                AM
              </div>
              <span className="hidden md:inline text-sm font-medium">Alex M.</span>
              <ChevronDown className="hidden md:inline size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">Alex Morgan</span>
                <span className="text-xs text-muted-foreground font-normal">alex@workplace.ai</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Saved Prompts</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
