"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteAdminServiceCategory } from "@/services/admin-service-categories";
import type { Category } from "../types";

type DeleteCategoryDialogProps = {
  category: Category | null;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
};

export function DeleteCategoryDialog({
  category,
  open,
  onClose,
  onDeleted,
}: DeleteCategoryDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!category) return;
    setLoading(true);
    try {
      await deleteAdminServiceCategory(category.category_id);
      toast.success(`"${category.name}" deleted`);
      onDeleted();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle>Delete category?</DialogTitle>
          </div>
          <DialogDescription className="leading-relaxed">
            <span className="font-semibold text-foreground">
              &ldquo;{category?.name}&rdquo;
            </span>{" "}
            and all its linked questions will be permanently removed. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
