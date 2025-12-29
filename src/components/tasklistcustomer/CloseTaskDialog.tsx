"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

interface CloseTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (questions: Record<string, string>, comments: string) => Promise<void>;
  taskTitle: string;
}

export function CloseTaskDialog({ open, onOpenChange, onConfirm, taskTitle }: CloseTaskDialogProps) {
  const [questions, setQuestions] = useState({ q1: "", q2: "", q3: "" });
  const [comments, setComments] = useState("");
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setQuestions({ q1: "", q2: "", q3: "" });
    setComments("");
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await onConfirm(questions, comments);
      handleClose();
    } finally {
      setSaving(false);
    }
  };

  const isValid = questions.q1 && questions.q2 && questions.q3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            Close This Task
          </DialogTitle>
          <DialogDescription className="text-base">
            Closing: <span className="font-semibold text-slate-900">{taskTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
            Please provide feedback before closing. This helps us improve our platform.
          </div>

          {/* Question 1 */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                1
              </span>
              Did you find a suitable professional?
            </label>
            <Select value={questions.q1} onValueChange={(v) => setQuestions((prev) => ({ ...prev, q1: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">✓ Yes</SelectItem>
                <SelectItem value="no">✗ No</SelectItem>
                <SelectItem value="not_sure">? Not sure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question 2 */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                2
              </span>
              Why are you closing this task?
            </label>
            <Select value={questions.q2} onValueChange={(v) => setQuestions((prev) => ({ ...prev, q2: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">✓ Work completed</SelectItem>
                <SelectItem value="budget">💰 Budget issue</SelectItem>
                <SelectItem value="found_someone">👤 Found someone else</SelectItem>
                <SelectItem value="changed_plan">🔄 Changed plan</SelectItem>
                <SelectItem value="other">➜ Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question 3 */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                3
              </span>
              How satisfied are you with the overall responses?
            </label>
            <Select value={questions.q3} onValueChange={(v) => setQuestions((prev) => ({ ...prev, q3: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Rate your experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="very_satisfied">⭐⭐⭐⭐⭐ Very Satisfied</SelectItem>
                <SelectItem value="satisfied">⭐⭐⭐⭐ Satisfied</SelectItem>
                <SelectItem value="neutral">⭐⭐⭐ Neutral</SelectItem>
                <SelectItem value="unsatisfied">⭐⭐ Unsatisfied</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900">
              Additional Comments <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <Textarea
              placeholder="Share any additional feedback or details..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={!isValid || saving}
            onClick={handleConfirm}
          >
            {saving ? "Closing..." : "Confirm Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}