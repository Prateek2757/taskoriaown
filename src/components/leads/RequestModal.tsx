"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import StepOneCategoryForm from "./stepOneCategorySelection";
import StepTwoQuestionsForm from "./StepTwoQuestionSelection";


type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NewRequestModal({ open, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState<string>("");

  const next = () => setStep(2);
  const back = () => setStep(1);
  const close = () => {
    onClose();
    setStep(1);
    setSelectedCategoryId("");
    setSelectedLocationId("");
    setSelectedCategoryTitle("");
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-2xl w-[95%] p-0  rounded-2xl">
        <DialogHeader className="border-b bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 text-center">
          <DialogTitle className="text-xl text-center font-semibold">
            {step === 1 ? "Place a new request" : "A few quick questions"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative ">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <StepOneCategoryForm
                  onNext={next}
                  onClose={close}
                  setSelectedCategoryId={setSelectedCategoryId}
                  setSelectedCategoryTitle={setSelectedCategoryTitle}
                  setSelectedLocationId={setSelectedLocationId}
                />
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4"
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
      </DialogContent>
    </Dialog>
  );
}