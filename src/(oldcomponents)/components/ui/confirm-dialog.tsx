import { Check, Loader2Icon, X } from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface ProposalVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  isSubmitting,
  onSuccess,
  title,
  description,
}: ProposalVerifyModalProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-[90vw] md:min-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-2">
          <p className="text-sm text-gray-700 text-center">{description}</p>

          <div className="flex justify-center gap-2 pt-4">
            <Button
              className="bg-green-600"
              disabled={isSubmitting}
              onClick={onSuccess}
            >
              {isSubmitting && <Loader2Icon className="h-4 w-4 animate-spin" />}
              <Check />
              Yes
            </Button>
            <DialogClose asChild>
              <Button variant="destructive" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                )}
                <X />
                No
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
