import { useState, useEffect } from "react";
import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDark = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleSidebar={() => setCollapsed((c) => !c)}
          dark={dark}
          onToggleDark={toggleDark}
        />
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-[1600px] w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
