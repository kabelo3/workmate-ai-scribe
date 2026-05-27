import { createFileRoute } from "@tanstack/react-router";
import { EmailGenerator } from "@/pages/EmailGenerator";

export const Route = createFileRoute("/_layout/email")({
  component: EmailGenerator,
});
