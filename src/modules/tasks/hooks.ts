"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/modules/auth/AuthProvider";
import {
  createTask,
  deleteTask,
  fetchCompletedTasks,
  fetchOpenTasks,
  setTaskCompleted,
  updateTask,
  updateTaskPosition,
} from "./api";
import type { Priority, Task } from "./types";

export function useOpenTasks() {
  return useQuery({ queryKey: ["tasks"], queryFn: fetchOpenTasks });
}

export function useCompletedTasks() {
  return useQuery({ queryKey: ["tasks", "done"], queryFn: fetchCompletedTasks });
}

function useInvalidator() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["tasks"] });
  };
}

export function useCreateTask() {
  const { session } = useAuth();
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: (input: { title: string; priority: Priority; deadline: string | null }) =>
      createTask(session!.user.id, input),
    onSuccess: invalidate,
  });
}

export function useUpdateTask() {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: ({ id, ...patch }: { id: string } & Partial<Pick<Task, "title" | "priority" | "deadline">>) =>
      updateTask(id, patch),
    onSuccess: invalidate,
  });
}

export function useToggleDone() {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) => setTaskCompleted(id, done),
    onSuccess: invalidate,
  });
}

export function useDeleteTask() {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: invalidate,
  });
}

export function useReorderTask() {
  const invalidate = useInvalidator();
  return useMutation({
    mutationFn: ({ id, position }: { id: string; position: number }) => updateTaskPosition(id, position),
    onSuccess: invalidate,
  });
}
