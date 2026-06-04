
import axios from "axios";
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
  service_image: string;
  status: string;
  created_at: string;
  estimated_budget:number;
  budget_min?: number | null;
  budget_max?: number | null;
  answers?:Lead_answers[];
  queries?:string;
  response_count?:number;

};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/tasks/mytasks");
      const json = await res.data;
      const normalizedTasks = (json.tasks || []).map((task: Task) => ({
        ...task,
        response_count: Number(task.response_count ?? 0),
      }));
      setTasks(normalizedTasks);
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
