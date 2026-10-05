export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  priority: Priority;
  deadline: string | null; // YYYY-MM-DD
  completed_at: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

// Sắp xếp cho màn chọn task của Focus Session: High trước, sau đó theo position (AC-F4-3)
export function sortForPicker(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    return p !== 0 ? p : a.position - b.position;
  });
}
