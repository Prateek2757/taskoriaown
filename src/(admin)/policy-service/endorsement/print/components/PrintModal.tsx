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

interface ForwardModalProps {
    isOpen: boolean;
    onClose: () => void;
    isSubmitting: boolean;
}

export default function PrintModal({
    isOpen,
    onClose,
    isSubmitting,
}: ForwardModalProps) {
    const [remarks, setRemarks] = useState("");
    const { showToast } = useToast();

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
                        Are you Sure you want to allow Reprint?
                    </DialogTitle>
                </DialogHeader>
                <div className="flex gap-2 justify-center">
                    <Button
                        variant="default"
                        disabled={isSubmitting}
                        onClick={handleClose}
                    >
                        Yes
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={isSubmitting}
                        onClick={handleClose}
                    >
                        No
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}