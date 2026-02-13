
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAccreditations } from "@/hooks/UseAccreditations";

interface AccreditationFormData {
  name: string;
  issuing_organization: string;
}

export default function AccreditationsSection() {
  const {
    accreditations,
    isLoading,
    isError,
    createAccreditation,
    updateAccreditation,
    deleteAccreditation,
  } = useAccreditations();

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd, isSubmitting: isAdding },
  } = useForm<AccreditationFormData>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: errorsEdit, isSubmitting: isUpdating },
  } = useForm<AccreditationFormData>();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accreditationToDelete, setAccreditationToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const onAddSubmit = async (data: AccreditationFormData) => {
    try {
      await createAccreditation({
        name: data.name.trim(),
        issuing_organization: data.issuing_organization.trim(),
      });

      resetAdd();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add accreditation:", error);
    }
  };

  const startEdit = (accreditation: any) => {
    setEditingId(accreditation.id);
    setEditValue("name", accreditation.name);
    setEditValue("issuing_organization", accreditation.issuing_organization);
  };

  const onEditSubmit = async (data: AccreditationFormData) => {
    if (!editingId) return;

    try {
      await updateAccreditation(editingId, {
        name: data.name.trim(),
        issuing_organization: data.issuing_organization.trim(),
      });

      setEditingId(null);
      resetEdit();
    } catch (error) {
      console.error("Failed to update accreditation:", error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetEdit();
  };

  const confirmDelete = (id: string) => {
    setAccreditationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!accreditationToDelete) return;

    setDeleting(true);
    try {
      await deleteAccreditation(accreditationToDelete);
      setAccreditationToDelete(null);
    } catch (error) {
      alert("Failed to delete accreditation");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading certifications...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-600">Failed to load certifications. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {accreditations.length > 0 && (
        <div className="space-y-3">
          {accreditations.map((accreditation) => {
            const isEditing = editingId === accreditation.id;

            return (
              <div
                key={accreditation.id}
                className="group rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              >
                {isEditing ? (
                  <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Certification or License Name
                      </label>
                      <input
                        type="text"
                        {...registerEdit("name", {
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                          },
                        })}
                        placeholder="e.g., Certified Public Accountant, Real Estate License"
                        className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {errorsEdit.name && (
                        <p className="mt-1 text-xs text-red-600">{errorsEdit.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Issuing Organization
                      </label>
                      <input
                        type="text"
                        {...registerEdit("issuing_organization", {
                          required: "Issuing organization is required",
                          minLength: {
                            value: 2,
                            message: "Organization name must be at least 2 characters",
                          },
                        })}
                        placeholder="e.g., AICPA, State Board of Realtors"
                        className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {errorsEdit.issuing_organization && (
                        <p className="mt-1 text-xs text-red-600">
                          {errorsEdit.issuing_organization.message}
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
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-400 to-blue-600 text-xl font-bold text-white">
                      {accreditation.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-900">
                        {accreditation.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {accreditation.issuing_organization}
                      </p>
                    </div>

                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => startEdit(accreditation)}
                        className="rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        title="Edit"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => confirmDelete(accreditation.id)}
                        className="rounded p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white p-4 text-slate-600 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="font-medium">Add Certification or License</span>
        </button>
      ) : (
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Add Certification or License
          </h3>

          <form onSubmit={handleSubmitAdd(onAddSubmit)} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Certification or License Name
              </label>
              <input
                type="text"
                {...registerAdd("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                placeholder="e.g., Certified Public Accountant, Real Estate License"
                className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errorsAdd.name && (
                <p className="mt-1 text-xs text-red-600">{errorsAdd.name.message}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                Enter the full name of your certification or professional license
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Issuing Organization
              </label>
              <input
                type="text"
                {...registerAdd("issuing_organization", {
                  required: "Issuing organization is required",
                  minLength: {
                    value: 2,
                    message: "Organization name must be at least 2 characters",
                  },
                })}
                placeholder="e.g., AICPA, State Board of Realtors"
                className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errorsAdd.issuing_organization && (
                <p className="mt-1 text-xs text-red-600">
                  {errorsAdd.issuing_organization.message}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                Name of the organization that issued this credential
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isAdding}
                className="flex-1 rounded-md bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {isAdding ? "Adding..." : "Add Certification"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
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

      {accreditations.length === 0 && !showForm && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <svg
              className="h-8 w-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">
            No certifications yet
          </h3>
          <p className="mb-6 text-sm text-slate-600">
            Showcase your professional certifications and licenses
          </p>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Certification"
        description="Are you sure you want to delete this certification? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleting}
      />
    </div>
  );
}