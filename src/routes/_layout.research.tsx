import { createFileRoute } from "@tanstack/react-router";
import { ResearchAssistant } from "@/pages/ResearchAssistant";

export const Route = createFileRoute("/_layout/research")({
  component: ResearchAssistant,
});
