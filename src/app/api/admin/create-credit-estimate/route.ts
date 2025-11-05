import pool from "@/lib/dbConnect";
import { NextResponse } from "next/server";


const calculateCredits = (
  minBudget: number,
  maxBudget: number,
  rule: {
    base_credits: number;
    weight_factor: number;
    min_credits: number;
    max_credits: number;
  }
) => {
  const avgBudget = (minBudget + maxBudget) / 2;
  let estimated =
    Number(rule.base_credits) + avgBudget * Number(rule.weight_factor);
  estimated = Math.max(estimated, Number(rule.min_credits));
  estimated = Math.min(estimated, Number(rule.max_credits));
  return Math.round(estimated);
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const task_id = searchParams.get("task_id");
    const action = searchParams.get("action") || "lead_response";

    const ruleQuery = `
      SELECT *
      FROM credit_rules
      WHERE action = $1 AND is_active = true
      LIMIT 1
    `;
    const { rows: ruleRows } = await pool.query(ruleQuery, [action]);

    if (ruleRows.length === 0) {
      return NextResponse.json(
        { error: "Credit rule not found" },
        { status: 404 }
      );
    }

    const rule = ruleRows[0];

    if (task_id) {
      // 2️⃣ Single task
      const taskQuery = `
        SELECT task_id,budget_min, budget_max
        FROM tasks
        WHERE task_id = $1
        LIMIT 1
      `;
      const { rows: taskRows } = await pool.query(taskQuery, [task_id]);

      if (taskRows.length === 0) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      const task = taskRows[0];
      const estimated = calculateCredits(
        Number(task.budget_min),
        Number(task.budget_max),
        rule
      );

      return NextResponse.json({
        task_id: task.task_id,
        estimated_credits: estimated,
      });
    } else {

      const allTasksQuery = `
        SELECT 
          t.task_id AS task_id,
          t.budget_min,
          t.budget_max,
          ROUND(
          LEAST(
            GREATEST(
              $1 + ((t.budget_min + t.budget_max) / 2) * $2,
              $3
            ),
            $4
    ) )AS estimated_credits
        FROM tasks t
        ORDER BY t.created_at DESC
      `;

      const { rows: allTasks } = await pool.query(allTasksQuery, [
        rule.base_credits,
        rule.weight_factor,
        rule.min_credits,
        rule.max_credits,
      ]);

      return NextResponse.json({ tasks: allTasks });
    }
  } catch (err) {
    console.error("Credit estimate error:", err);
    return NextResponse.json(
      { error: "Failed to estimate credits" },
      { status: 500 }
    );
  }
}
