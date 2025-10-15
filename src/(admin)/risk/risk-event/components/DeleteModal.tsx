"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { useEffect, useState } from "react";

interface ProposalVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onApprove: (remarks: string) => void;
  onDecline: (remarks: string) => void;
}

export default function DeleteForward({
  isOpen,
  onClose,
  isSubmitting,
  onApprove,
  onDecline,
}: ProposalVerifyModalProps) {
  const [remarks, setRemarks] = useState("");
  const { showToast } = useToast();

  const handleApproveClick = () => {
    if (!remarks.trim()) {
      showToast(
        SYSTEM_CONSTANTS.error_code,
        "Remarks are required to approve.",
        "Validation Error"
      );
      return;
    }
    onApprove(remarks);
  };

  const handleDeclineClick = () => {
    if (!remarks.trim()) {
      showToast(
        SYSTEM_CONSTANTS.error_code,
        "Remarks are required to decline.",
        "Validation Error"
      );
      return;
    }
    onDecline(remarks);
  };

  const handleClose = () => {
    setRemarks("");
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setRemarks("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-[90vw] md:min-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Confirmation
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-2">
          <p className="text-sm text-gray-700">
            Are you sure to delete this Event Details?
          </p>

          <Textarea
            rows={4}
            placeholder="Enter your Deletion remarks here..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="default"
              disabled={isSubmitting}
              onClick={handleApproveClick}
            >
              {isSubmitting ? "Approving..." : "Approve"}
            </Button>
            <Button
              variant="destructive"
              disabled={isSubmitting}
              onClick={handleDeclineClick}
            >
              {isSubmitting ? "Declining..." : "Decline"}
            </Button>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
