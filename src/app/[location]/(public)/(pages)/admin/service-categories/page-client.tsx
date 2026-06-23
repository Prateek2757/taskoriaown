"use client";

import { useState } from "react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

import { CategoryFormDialog } from "@/features/admin-service-categories/components/CategoryFormDialog";
import { DeleteCategoryDialog } from "@/features/admin-service-categories/components/DeleteCategoryDialog";
import type { Category } from "@/features/admin-service-categories/types";
import { listAdminServiceCategories } from "@/services/admin-service-categories";

export default function AdminCategoriesPage() {
  const {
    data: categories,
    isLoading,

    mutate,
  } = useSWR<Category[]>("admin-service-categories", listAdminServiceCategories);

  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  function openCreate() {
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(cat: Category) {
    setEditTarget(cat);
    setFormOpen(true);
  }

  function openDelete(cat: Category) {
    setDeleteTarget(cat);
  }

  const filtered = (categories ?? []).filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      c.main_category?.toLowerCase().includes(search.toLowerCase());

    const matchActive =
      filterActive === "all"
        ? true
        : filterActive === "active"
          ? c.is_active
          : !c.is_active;

    return matchSearch && matchActive;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage service categories and their intake questions.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          New category
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, slug, or label..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "active", "inactive"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filterActive === f ? "default" : "outline"}
              onClick={() => setFilterActive(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
        <p className="ml-auto text-sm text-muted-foreground">
          {filtered.length} / {categories?.length ?? 0}
        </p>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="sm:w-65 w-auto">Name</TableHead>
              <TableHead>Label</TableHead>
              <TableHead className="text-center">Questions</TableHead>
              <TableHead className="text-center">Rank</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="text-center">Remote</TableHead>
              <TableHead className="w-13" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-40 text-center text-muted-foreground"
                >
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((cat) => (
                <TableRow key={cat.category_id} className="group">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm leading-none">
                        {cat.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        /{cat.slug}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-normal">
                      {cat.main_category || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-muted text-xs font-medium px-1.5">
                      {cat.questions?.length ?? 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm tabular-nums text-muted-foreground">
                    {cat.rank}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex h-2 w-2 rounded-full ${
                        cat.is_active
                          ? "bg-emerald-500"
                          : "bg-zinc-300 dark:bg-zinc-600"
                      }`}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex h-2 w-2 rounded-full ${
                        cat.remote_available
                          ? "bg-blue-500"
                          : "bg-zinc-300 dark:bg-zinc-600"
                      }`}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8  data-[state=open]:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => openEdit(cat)}>
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => openDelete(cat)}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CategoryFormDialog
        category={editTarget}
        allCategories={categories ?? []}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={() => mutate()}
      />

      <DeleteCategoryDialog
        category={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => mutate()}
      />
    </div>
  );
}
