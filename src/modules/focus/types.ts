export type EndedReason = "in_progress" | "completed" | "stopped_early";

export interface FocusSession {
  id: string;
  user_id: string;
  task_id: string | null;
  task_title: string;
  planned_minutes: number;
  started_at: string;
  ended_at: string | null;
  actual_focus_seconds: number | null;
  distraction_seconds: number;
  ended_reason: EndedReason;
  created_at: string;
}
