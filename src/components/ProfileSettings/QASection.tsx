"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useFAQs } from "@/hooks/useFAQS";

interface FAQFormData {
  question: string;
  answer: string;
  category?: string;
}

const PRESET_QUESTIONS = [
  {
    id: "love-about-job",
    question: "What do you love most about your job?",
    category: "About Us",
    minLength: 50,
  },
  {
    id: "inspiration",
    question: "What inspired you to start your own business?",
    category: "About Us",
    minLength: 50,
  },
  {
    id: "why-choose",
    question: "Why should our clients choose you?",
    category: "Services",
    minLength: 50,
  },
  {
    id: "online-services",
    question:
      "Can you provide your services online or remotely? If so, please add details.",
    category: "Services",
    minLength: 50,
  },
  {
    id: "covid-safety",
    question:
      "What changes have you made to keep your customers safe from Covid-19?",
    category: "Safety",
    minLength: 50,
  },
];

export default function FAQSection() {
  const { faqs, isLoading, isError, createFAQ, updateFAQ, deleteFAQ } =
    useFAQs();

  const [presetAnswers, setPresetAnswers] = useState<Record<string, string>>(
    {}
  );
  const [presetErrors, setPresetErrors] = useState<Record<string, string>>({});
  const [savingPreset, setSavingPreset] = useState<string | null>(null);

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd, isSubmitting: isAdding },
  } = useForm<FAQFormData>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: errorsEdit, isSubmitting: isUpdating },
  } = useForm<FAQFormData>();

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isPresetAnswered = (presetId: string) => {
    return faqs.some((faq) => faq.presetId === presetId);
  };

  const getPresetAnswer = (presetId: string) => {
    return faqs.find((faq) => faq.presetId === presetId);
  };

  const handlePresetAnswer = (presetId: string, value: string) => {
    setPresetAnswers((prev) => ({ ...prev, [presetId]: value }));
    if (presetErrors[presetId]) {
      setPresetErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[presetId];
        return newErrors;
      });
    }
  };

  const savePresetAnswer = async (preset: (typeof PRESET_QUESTIONS)[0]) => {
    const answer = presetAnswers[preset.id]?.trim();

    if (!answer || answer.length < preset.minLength) {
      setPresetErrors((prev) => ({
        ...prev,
        [preset.id]: `Answer must be at least ${preset.minLength} characters`,
      }));
      return;
    }

    setSavingPreset(preset.id);
    try {
      await createFAQ({
        question: preset.question,
        answer: answer,
        category: preset.category,
        presetId: preset.id,
      });

      setPresetAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[preset.id];
        return newAnswers;
      });
    } catch (error) {
      console.error("Failed to save preset answer:", error);
      setPresetErrors((prev) => ({
        ...prev,
        [preset.id]: "Failed to save answer. Please try again.",
      }));
    } finally {
      setSavingPreset(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const onAddSubmit = async (data: FAQFormData) => {
    try {
      await createFAQ({
        question: data.question.trim(),
        answer: data.answer.trim(),
        category: data.category?.trim() || undefined,
      });

      resetAdd();
      setShowCustomForm(false);
    } catch (error) {
      console.error("Failed to add FAQ:", error);
    }
  };

  const startEdit = (faq: any) => {
    setEditingId(faq.id);
    setEditValue("question", faq.question);
    setEditValue("answer", faq.answer);
    setEditValue("category", faq.category || "");
    setExpandedId(null);
  };

  const onEditSubmit = async (data: FAQFormData) => {
    if (!editingId) return;

    try {
      await updateFAQ(editingId, {
        question: data.question.trim(),
        answer: data.answer.trim(),
        category: data.category?.trim() || undefined,
      });

      setEditingId(null);
      resetEdit();
    } catch (error) {
      console.error("Failed to update FAQ:", error);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    resetEdit();
  };

  // Confirm delete
  const confirmDelete = (id: string) => {
    setFaqToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!faqToDelete) return;

    setDeleting(true);
    try {
      await deleteFAQ(faqToDelete);
      setFaqToDelete(null);
    } catch (error) {
      alert("Failed to delete FAQ");
    } finally {
      setDeleting(false);
    }
  };

  // Separate preset and custom FAQs
  const presetFAQs = faqs.filter((faq) => faq.presetId);
  const customFAQs = faqs.filter((faq) => !faq.presetId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading FAQs...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-600">Failed to load FAQs. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Questions Clients Often Ask
        </h2>
        <p className="text-sm text-slate-600">
          Address key concerns in advance to build trust, clarify expectations,
          and help customers feel confident choosing your services.
        </p>
      </div>

      <div className="space-y-4">
        {PRESET_QUESTIONS.map((preset) => {
          const existingAnswer = getPresetAnswer(preset.id);
          const isEditing = editingId === existingAnswer?.id;

          return (
            <div key={preset.id} className="rounded-lg border bg-white p-4">
              {existingAnswer && !isEditing ? (
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h4 className="font-medium text-slate-900">
                      {preset.question}
                    </h4>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(existingAnswer)}
                        className="text-xs text-slate-600 hover:text-slate-900 underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(existingAnswer.id)}
                        className="text-xs text-red-600 hover:text-red-700 underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {existingAnswer.answer}
                  </p>
                </div>
              ) : isEditing && existingAnswer ? (
                <form
                  onSubmit={handleSubmitEdit(onEditSubmit)}
                  className="space-y-3"
                >
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      {preset.question}
                    </label>
                    <textarea
                      {...registerEdit("answer", {
                        required: "Answer is required",
                        minLength: {
                          value: preset.minLength,
                          message: `Answer must be at least ${preset.minLength} characters`,
                        },
                      })}
                      rows={4}
                      className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errorsEdit.answer && (
                      <p className="mt-1 text-xs text-red-600">
                        {errorsEdit.answer.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                      Minimum {preset.minLength} characters
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-900">
                    {preset.question}
                  </label>
                  <textarea
                    value={presetAnswers[preset.id] || ""}
                    onChange={(e) =>
                      handlePresetAnswer(preset.id, e.target.value)
                    }
                    placeholder="Type your answer here..."
                    rows={4}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {presetErrors[preset.id] && (
                    <p className="text-xs text-red-600">
                      {presetErrors[preset.id]}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      Minimum {preset.minLength} characters
                    </p>
                    <button
                      onClick={() => savePresetAnswer(preset)}
                      disabled={savingPreset === preset.id}
                      className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                      {savingPreset === preset.id ? "Saving..." : "Save Answer"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {customFAQs.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-50 px-4 text-sm text-slate-500">
              Custom FAQs
            </span>
          </div>
        </div>
      )}

      {customFAQs.length > 0 && (
        <div className="space-y-3">
          {customFAQs.map((faq) => {
            const isEditing = editingId === faq.id;
            const isExpanded = expandedId === faq.id;

            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md"
              >
                {isEditing ? (
                  <div className="p-4">
                    <form
                      onSubmit={handleSubmitEdit(onEditSubmit)}
                      className="space-y-4"
                    >
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Category{" "}
                          <span className="text-slate-500">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          {...registerEdit("category")}
                          placeholder="e.g., Pricing, Services, General"
                          className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Question
                        </label>
                        <input
                          type="text"
                          {...registerEdit("question", {
                            required: "Question is required",
                            minLength: {
                              value: 5,
                              message: "Question must be at least 5 characters",
                            },
                          })}
                          placeholder="What is your question?"
                          className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {errorsEdit.question && (
                          <p className="mt-1 text-xs text-red-600">
                            {errorsEdit.question.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Answer
                        </label>
                        <textarea
                          {...registerEdit("answer", {
                            required: "Answer is required",
                            minLength: {
                              value: 10,
                              message: "Answer must be at least 10 characters",
                            },
                          })}
                          placeholder="Provide a clear and helpful answer..."
                          rows={4}
                          className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {errorsEdit.answer && (
                          <p className="mt-1 text-xs text-red-600">
                            {errorsEdit.answer.message}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                        >
                          {isUpdating ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="flex w-full items-start justify-between gap-4 p-4 text-left transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                          Q
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">
                            {faq.question}
                          </h4>
                        </div>
                      </div>

                      <svg
                        className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="border-t bg-slate-50 px-4 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                            A
                          </div>
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                              {faq.answer}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2 pl-11">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(faq);
                            }}
                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(faq.id);
                            }}
                            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!showCustomForm ? (
        <button
          onClick={() => setShowCustomForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white p-6 text-slate-600 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="font-medium">Add Custom FAQ</span>
        </button>
      ) : (
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Add Custom FAQ
          </h3>

          <form onSubmit={handleSubmitAdd(onAddSubmit)} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                type="text"
                {...registerAdd("category")}
                placeholder="e.g., Pricing, Services, General"
                className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Group related questions together with a category name
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Question
              </label>
              <input
                type="text"
                {...registerAdd("question", {
                  required: "Question is required",
                  minLength: {
                    value: 5,
                    message: "Question must be at least 5 characters",
                  },
                })}
                placeholder="What do customers frequently ask about?"
                className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errorsAdd.question && (
                <p className="mt-1 text-xs text-red-600">
                  {errorsAdd.question.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Answer
              </label>
              <textarea
                {...registerAdd("answer", {
                  required: "Answer is required",
                  minLength: {
                    value: 10,
                    message: "Answer must be at least 10 characters",
                  },
                })}
                placeholder="Provide a clear, helpful answer..."
                rows={5}
                className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errorsAdd.answer && (
                <p className="mt-1 text-xs text-red-600">
                  {errorsAdd.answer.message}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isAdding}
                className="flex-1 rounded-md bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {isAdding ? "Adding..." : "Add FAQ"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomForm(false);
                  resetAdd();
                }}
                className="rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleting}
      />
    </div>
  );
}
