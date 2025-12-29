
import { useEffect, useState, useCallback } from "react";

type Lead_answers ={
  question_id?:string | number;
  question:string;
  answer:string;
}

export type Task = {
  task_id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  estimated_budget:number;
  budget_min?: number | null;
  budget_max?: number | null;
  answers?:Lead_answers[];
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
console.log(tasks,"fporjfspoj");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks/mytasks");
      const json = await res.json();
      setTasks(json.tasks || []);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refresh: fetchTasks, setTasks };
}
