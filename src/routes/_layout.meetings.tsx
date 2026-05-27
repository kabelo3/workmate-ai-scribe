import { createFileRoute } from "@tanstack/react-router";
import { MeetingSummarizer } from "@/pages/MeetingSummarizer";

export const Route = createFileRoute("/_layout/meetings")({
  component: MeetingSummarizer,
});
