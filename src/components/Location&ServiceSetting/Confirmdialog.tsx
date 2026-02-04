"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "service" | "location";
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  type,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">
            Confirm Removal
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Are you sure you want to remove this{" "}
            {type === "service" ? "service" : "location"}?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            No, Keep it
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white"
            onClick={onConfirm}
          >
            Yes, Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}