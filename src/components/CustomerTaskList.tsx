"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTasks } from "@/hooks/useTasks";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Task {
  task_id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  budget_min?: number | null;
  budget_max?: number | null;
}

interface TasksListProps {
  tasks?: Task[];
}

export default function TasksList({ tasks: taskFromProp }: TasksListProps) {
  const router = useRouter();
  //   const { tasks: tasksFromHook } = useTasks();
  const tasks: Task[] = taskFromProp ?? [];

  const [openTaskId, setOpenTaskId] = useState<number | null>(null);

  if (!tasks || tasks.length === 0)
    return <p className="text-gray-500 text-center mt-10">No tasks found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your Posted Tasks
      </motion.h2>

      <div className="space-y-6">
        {tasks.map((task, idx) => {
          const isOpen = openTaskId === task.task_id;
          return (
            <motion.div
              key={task.task_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="rounded-2xl border border-gray-200">
                <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span
                        className={`font-medium ${
                          task.status === "Open"
                            ? "text-green-600"
                            : task.status?.toLowerCase() === "in progress"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        Status: {task.status}
                      </span>
                      {task.budget_min != null && task.budget_max != null && (
                        <span className="text-gray-600">
                          Budget: ${task.budget_min} - ${task.budget_max}
                        </span>
                      )}
                      <span className="text-gray-400">
                        Posted on:{" "}
                        {new Date(task.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/tasks/${task.task_id}`)
                      }
                      className="px-4 py-2 rounded-lg bg-white border hover:shadow-sm"
                    >
                      Update job status
                    </button>

                    <button
                      onClick={() =>
                        setOpenTaskId((prev) =>
                          prev === task.task_id ? null : task.task_id
                        )
                      }
                      className="px-3 py-2 rounded-lg bg-white border"
                      aria-expanded={isOpen}
                    >
                      {isOpen ? "Hide responses" : "View responses"}
                    </button>
                  </div>
                </CardContent>

                {isOpen && (
                  <div className="border-t px-6 pb-6 pt-4">
                    <ResponsesRow taskId={task.task_id} />
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ResponsesRow({ taskId }: { taskId: number }) {
  // load responses via hook
  const [responses, setResponses] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchResponses = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/tasks/taskResponses/${taskId}`);
    const json = await res.json();
    setResponses(json.responses || []);
    console.log(responses);
    
    setLoading(false);
  }, [taskId]);


  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);


  if (loading) return <p className="p-4 text-gray-500">Loading responses...</p>;
  if (!responses || responses.length === 0)
    return <p className="p-4 text-gray-500">No responses yet.</p>;

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-[800px]">
        {responses.map((r: any) => (
          <div key={r.response_id} className="w-64 shrink-0">
            <Card className="p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <img
                  src={r.avatar_url || "/images/default-avatar.png"}
                  alt={r.display_name}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{r.display_name}</h4>
                  <p className="text-xs text-gray-500">{r.profile_title}</p>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                {r.title}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    const convId =
                      r.conversation_id ??
                      `new?task=${taskId}&to=${r.professional_id}`;
                    router.push(`/message/${r.id}`);
                  }}
                  className="flex-1 px-3 py-2 rounded-md bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm"
                >
                  Message
                </button>

                <button
                  onClick={() => router.push(`/profile/${r.professional_id}`)}
                  className="px-3 py-2 rounded-md border text-sm"
                >
                  View profile
                </button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
