"use client";

import React, { useState, useEffect } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useProfileServices } from "@/hooks/useProfileSetting";

export default function ServicesSection() {
  const {
    services,
    isLoading,
    isError,
    createService,
    updateService,
    deleteService,
    bulkUpdateServices,
  } = useProfileServices();

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    
    setAdding(true);
    try {
      await createService(newTitle, newDesc);
      setNewTitle("");
      setNewDesc("");
    } catch (error) {
      console.error("Failed to add service:", error);
      alert("Failed to add service. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (service: any) => {
    setEditingId(service.id);
    setEditTitle(service.title);
    setEditDesc(service.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDesc("");
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle.trim()) return;
    
    setUpdating(id);
    try {
      await updateService(id, editTitle, editDesc);
      setEditingId(null);
      setEditTitle("");
      setEditDesc("");
    } catch (error) {
      console.error("Failed to update service:", error);
      alert("Failed to update service. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const confirmDelete = (id: string) => {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    
    setDeleting(true);
    try {
      await deleteService(serviceToDelete);
      setServiceToDelete(null);
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("Failed to delete service. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-slate-600">Loading services...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">Failed to load services. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-start justify-between gap-3 border rounded-md p-3 bg-white  dark:bg-gray-900"
          >
            {editingId === service.id ? (
              <div className="flex-1 space-y-2">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Service title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Short description"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(service.id)}
                    disabled={updating === service.id}
                    className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white disabled:opacity-60 hover:bg-blue-600"
                  >
                    {updating === service.id ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="rounded-md border px-3 py-1 text-sm hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <div className="font-medium text-sm">{service.title}</div>
                  {service.description && (
                    <div className="text-sm text-slate-600">{service.description}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(service)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(service.id)}
                    disabled={deleting}
                    className="text-sm text-red-500 hover:underline disabled:opacity-60"
                  >
                    {deleting ? "Deleting..." : "Remove"}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-500">
            No services added yet. Add your first service below.
          </div>
        )}

        <div className="mt-4 p-4 border rounded-md bg-slate-50  dark:bg-gray-900">
          <h3 className="text-sm font-medium mb-3">Add New Service</h3>
          <div className="grid gap-2">
            <input
              className="rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-900 "
              placeholder="Service title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTitle.trim()) {
                  handleAdd();
                }
              }}
            />
            <input
              className="rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-900"
              placeholder="Short description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTitle.trim()) {
                  handleAdd();
                }
              }}
            />
            <button
              onClick={handleAdd}
              disabled={adding || !newTitle.trim()}
              className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white disabled:opacity-60 hover:bg-blue-600"
            >
              {adding ? "Adding..." : "Add Service"}
            </button>
          </div>
        </div>
      </div>
      
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleting}
      />
    </div>
  );
}