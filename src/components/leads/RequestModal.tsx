"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import StepOneCategoryForm from "./stepOneCategorySelection";
import StepTwoQuestionsForm from "./StepTwoQuestionSelection";

type Props = {
  open: boolean;
  onClose: () => void;
  presetCategory?: { category_id: number; name: string; slug?: string } | null;
  presetLocation?: {city_id?:number , display_name?:string, city?:string} | null;
    initialStep?: 1 | 2; 

};

export default function NewRequestModal({
  open,
  onClose,
  presetCategory,
  presetLocation,
  initialStep = 1
}: Props) {
  const [showConfirmClose, setShowConfirmClose] = useState(false);

const [step, setStep] = useState<1 | 2>(initialStep );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    presetCategory ? String(presetCategory.category_id) : ""
  );
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState<string>(
    presetCategory ? presetCategory.name : ""
  );
  
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");

  const [selectedLocation, setSelectedLocation] = useState<{
    city_id?: number;
    display_name?: string;
    city?: string;
  } | null>(presetLocation || null);

  useEffect(() => {
    if (presetCategory) {
      setSelectedCategoryId(String(presetCategory?.category_id));
      setSelectedCategoryTitle(String(presetCategory?.name));
    }
  }, [presetCategory]);

  useEffect(() => {
    if (presetLocation) {
      setSelectedLocationId(String(presetLocation?.city_id));
      
    } 
  }, [presetLocation]);

  const next = () => setStep(2);
  const back = () => setStep(1);
  const close = () => {
    onClose();
    setStep(1);
    setSelectedCategoryId("");
    setSelectedLocationId("");
    setSelectedCategoryTitle("");
  };``

  return (
    <Dialog open={open}   onOpenChange={(isOpen) => {
    if (!isOpen) {
      setShowConfirmClose(true);
    }
  }}>
      <DialogContent
       onInteractOutside={(e) => e.preventDefault()}
       onEscapeKeyDown={(e) => e.preventDefault()}
        className="
          max-w-2xl w-[95%] p-0 rounded-2xl
          max-h-[90vh] overflow-visible flex flex-col
        "
      >
        <DialogHeader className="border-b bg-gray-50 dark:bg-slate-900 rounded-t-2xl p-4 text-center flex-shrink-0">
          <DialogTitle className="text-xl text-center font-semibold">
            {step === 1 ? "Place a new request" : "A few quick questions"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1  p-4">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StepOneCategoryForm
                  onNext={next}
                  onClose={close}
                  presetCategory={
                    selectedCategoryId && selectedCategoryTitle
                      ? {
                          category_id: Number(selectedCategoryId),
                          name: selectedCategoryTitle,
                        }
                      : undefined
                  }
                    presetLocation = {presetLocation || selectedLocation} 
                                      setSelectedCategoryId={setSelectedCategoryId}
                  setSelectedCategoryTitle={setSelectedCategoryTitle}
                  setSelectedLocationId={setSelectedLocationId}
                  setSelectedLocation={setSelectedLocation}

                />
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StepTwoQuestionsForm
                  onBack={back}
                  onClose={close}
                  selectedCategoryId={selectedCategoryId}
                  selectedTitle={selectedCategoryTitle}
                  selectedLocationId={selectedLocationId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AlertDialog open={showConfirmClose}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Discard changes?</AlertDialogTitle>
      <AlertDialogDescription>
        If you close this form, your progress will be lost.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel
        onClick={() => setShowConfirmClose(false)}
      >
        Continue filling
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={() => {
          setShowConfirmClose(false);
          close();
        }}
      >
        Close anyway
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

      </DialogContent>
    </Dialog>
  );
}
