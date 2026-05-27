import { createFileRoute } from "@tanstack/react-router";
import { TaskPlanner } from "@/pages/TaskPlanner";

export const Route = createFileRoute("/_layout/tasks")({
  component: TaskPlanner,
});
