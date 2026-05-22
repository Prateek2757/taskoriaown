"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  X,
  GripVertical,
  AlertTriangle,
  LayoutGrid,
  ListChecks,
  HelpCircle,
} from "lucide-react";

import { fetcher } from "@/lib/fetcher";
import ImageUpload from "@/components/ImageUpload/image-upload";

export interface CategoryQuestion {
  category_question_id?: number;
  category_id?: number;
  question: string;
  field_type: "select" | "text" | "textarea" | "number" | "checkbox";
  options: string[];
  is_required: boolean;
  sort_order: number;
}

export interface Category {
  category_id: number;
  parent_category_id: number | null;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  remote_available: boolean;
  rank: number;
  public_id: string;
  main_category: string;
  faqs: { question: string; answer: string }[];
  service_detail: string;
  keywords: string[];
  image_url: string;
  questions: CategoryQuestion[];
  created_at: string;
  updated_at: string;
}

const questionSchema = z.object({
  category_question_id: z.number().optional(),
  question: z.string().min(1, "Question text is required"),
  field_type: z.enum(["select", "text", "textarea", "number", "checkbox"]),
  options: z.array(z.string()),
  is_required: z.boolean().default(false),
  sort_order: z.number(),
});

const faqSchema = z.object({
  question: z.string().min(1, "FAQ question is required"),
  answer: z.string().min(1, "FAQ answer is required"),
});

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ),
  description: z.string().min(1, "Description is required"),
  main_category: z.string().min(1, "Main category label is required"),
  parent_category_id: z.number().nullable(),
  is_active: z.boolean(),
  remote_available: z.boolean().default(false),
  rank: z.number(),
  image_url: z.string().url("Must be a valid URL").or(z.literal("")),
  service_detail: z.string(),
  keywords: z.array(z.string()),
  faqs: z.array(faqSchema),
  questions: z.array(questionSchema),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const FIELD_TYPE_OPTIONS = [
  { value: "select", label: "Select (dropdown)" },
  { value: "text", label: "Text input" },
  { value: "textarea", label: "Textarea" },
  { value: "number", label: "Number" },
  { value: "checkbox", label: "Checkbox" },
] as const;

function buildDefaultValues(category?: Category | null): CategoryFormValues {
  return {
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    main_category: category?.main_category ?? "",
    parent_category_id: category?.parent_category_id ?? null,
    is_active: category?.is_active ?? true,
    remote_available: category?.remote_available ?? false,
    rank: category?.rank ?? 0,
    image_url: category?.image_url ?? "",
    service_detail: category?.service_detail ?? "",
    keywords: category?.keywords ?? [],
    faqs: category?.faqs ?? [],
    questions: (category?.questions ?? []).map((q) => ({
      ...q,
      options: Array.isArray(q.options) ? q.options.map(String) : [],
    })),
  };
}

function DeleteDialog({
  category,
  open,
  onClose,
  onDeleted,
}: {
  category: Category | null;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!category) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/service-categories/${category.category_id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error((await res.json()).message);
      toast.success(`"${category.name}" deleted`);
      onDeleted();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle>Delete category?</DialogTitle>
          </div>
          <DialogDescription className="leading-relaxed">
            <span className="font-semibold text-foreground">
              &ldquo;{category?.name}&rdquo;
            </span>{" "}
            and all its linked questions will be permanently removed. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OptionsSubArray({
  control,
  questionIndex,
  register,
  setValue,
}: {
  control: any;
  questionIndex: number;
  register: any;
  setValue: (name: string, value: string[]) => void;
}) {
  const options: string[] =
    useWatch({ control, name: `questions.${questionIndex}.options` }) ?? [];

  function removeOption(i: number) {
    setValue(
      `questions.${questionIndex}.options`,
      options.filter((_, idx) => idx !== i)
    );
  }

  function addOption() {
    setValue(`questions.${questionIndex}.options`, [...options, ""]);
  }

  return (
    <div>
      <p className="text-xs font-medium mb-1.5 text-muted-foreground">
        Options
      </p>
      <div className="space-y-1.5">
        {options.map((_, oi) => (
          <div key={oi} className="flex gap-2">
            <Input
              {...register(`questions.${questionIndex}.options.${oi}`)} // ← key change
              placeholder={`Option ${oi + 1}`}
              className="h-8 text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeOption(oi)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-primary"
          onClick={addOption}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add option
        </Button>
      </div>
    </div>
  );
}

function QuestionsFieldArray({
  control,
  setValue,
  register,
}: {
  control: any;
  setValue: (name: string, value: any) => void;
  register: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <div className="space-y-3">
      {fields.map((field, i) => (
        <Card key={field.id} className="border py-3 border-dashed shadow-none">
          <CardHeader className=" px-4 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Question {i + 1}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => remove(i)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <FormField
              control={control}
              name={`questions.${i}.question`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Question text</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. What type of property needs cleaning?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={control}
                name={`questions.${i}.field_type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Field type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FIELD_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`questions.${i}.is_required`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xs">Required</FormLabel>
                    <FormControl>
                      <div className="flex items-center h-10">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <OptionsSubArray
              control={control}
              questionIndex={i}
              setValue={setValue}
              register={register} // ← pass it down
            />
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() =>
          append({
            question: "",
            field_type: "select",
            options: [],
            is_required: true,
            sort_order: fields.length + 1,
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add question
      </Button>
    </div>
  );
}

function FaqsFieldArray({ control }: { control: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "faqs",
  });

  return (
    <div className="space-y-3">
      {fields.map((field, i) => (
        <Card key={field.id} className="border py-3 border-dashed shadow-none">
          <CardHeader className="py-0 px-4 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              FAQ {i + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => remove(i)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <FormField
              control={control}
              name={`faqs.${i}.question`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Question</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="What is included in..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`faqs.${i}.answer`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="The service usually covers..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => append({ question: "", answer: "" })}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add FAQ
      </Button>
    </div>
  );
}

function KeywordsInput({
  control,
  setValue,
}: {
  control: any;
  setValue: (name: string, value: string[]) => void;
}) {
  const keywords: string[] = useWatch({ control, name: "keywords" }) ?? [];
  const [input, setInput] = useState("");

  function add() {
    const kw = input.trim().toLowerCase();
    if (!kw || keywords.includes(kw)) return;
    setValue("keywords", [...keywords, kw]);
    setInput("");
  }

  function remove(i: number) {
    setValue(
      "keywords",
      keywords.filter((_, idx) => idx !== i)
    );
  }

  return (
    <div
      className={`
        flex flex-wrap gap-1.5 min-h-10 w-full rounded-md border border-input
        bg-background px-3 py-2 text-sm ring-offset-background
        focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
        transition-shadow cursor-text
      `}
      onClick={(e) => {
        (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus();
      }}
    >
      {keywords.map((kw, i) => (
        <span
          key={kw + i}
          className="inline-flex items-center gap-1 rounded-md bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-medium shrink-0"
        >
          {kw}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              remove(i);
            }}
            className="opacity-50 hover:opacity-100 hover:text-destructive transition-colors"
            aria-label={`Remove ${kw}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
          if (e.key === "Backspace" && !input && keywords.length > 0) {
            remove(keywords.length - 1);
          }
        }}
        placeholder={
          keywords.length === 0 ? "Type and press Enter or comma…" : ""
        }
        className="flex-1 min-w-35 bg-transparent outline-none placeholder:text-muted-foreground text-sm"
      />
    </div>
  );
}

function CategoryFormDialog({
  category,
  allCategories,
  open,
  onClose,
  onSaved,
}: {
  category: Category | null;
  allCategories: Category[];
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!category;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: buildDefaultValues(category),
  });

  const register = form.register;

  useEffect(() => {
    if (open) form.reset(buildDefaultValues(category));
  }, [open, category?.category_id]);

  const nameValue = form.watch("name");
  useEffect(() => {
    if (!isEdit) {
      form.setValue("slug", toSlug(nameValue ?? ""), { shouldValidate: false });
    }
  }, [nameValue, isEdit]);

  async function onSubmit(values: CategoryFormValues) {
    try {
      const url = isEdit
        ? `/api/admin/service-categories/${category!.category_id}`
        : `/api/admin/service-categories`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error((await res.json()).message);
      toast.success(isEdit ? "Category updated" : "Category created");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  }

  const questionCount = form.watch("questions")?.length ?? 0;
  const faqCount = form.watch("faqs")?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[92vh] w-full max-w-3xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5 shrink-0">
          <DialogTitle className="text-lg">
            {isEdit ? `Edit — ${category?.name}` : "New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update category details, linked questions, and FAQs."
              : "Fill in the details to create a new service category."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <Tabs
              defaultValue="details"
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="border-b px-6 pt-4 pb-0 shrink-0">
                <TabsList className="h-9 gap-1 bg-transparent p-0">
                  <TabsTrigger
                    value="details"
                    className="gap-1.5 rounded-none border-b-2 border-transparent px-3 pb-3 pt-1 text-sm bg-transparent"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="questions"
                    className="gap-1.5 rounded-none border-b-2 border-transparent px-3 pb-3 pt-1 text-sm bg-transparent "
                  >
                    <ListChecks className="h-3.5 w-3.5" />
                    Questions
                    {questionCount > 0 && (
                      <Badge className="ml-1 h-5 min-w-5 rounded-full px-1 text-[11px]">
                        {questionCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="faqs"
                    className="gap-1.5 rounded-none border-b-2 border-transparent px-3 pb-3 pt-1 text-sm  
                    "
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    FAQs
                    {faqCount > 0 && (
                      <Badge className="ml-1 h-5 min-w-5 rounded-full px-1 text-[11px]">
                        {faqCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="details"
                className="mt-0 flex-1 overflow-y-auto px-6 py-5 space-y-5"
              >
                <div className="grid  gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="House Cleaning" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Slug <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="house-cleaning"
                            className="font-mono text-sm"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Auto-generated from name. Edit if needed.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="main_category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main category label</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Cleaning Services" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parent_category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent category</FormLabel>
                        <Select
                          onValueChange={(v) =>
                            field.onChange(v === "none" ? null : Number(v))
                          }
                          value={
                            field.value == null ? "none" : String(field.value)
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Top-level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              — None (top-level) —
                            </SelectItem>
                            {allCategories
                              .filter(
                                (c) => c.category_id !== category?.category_id
                              )
                              .map((c) => (
                                <SelectItem
                                  key={c.category_id}
                                  value={String(c.category_id)}
                                >
                                  {c.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          placeholder="Professional domestic cleaning services across Australia"
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="service_detail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service detail (HTML)</FormLabel>
                      <FormDescription>
                        Full page content rendered on the category landing page.
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={8}
                          placeholder="<h1>House Cleaning</h1>..."
                          className="resize-y font-mono text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                    
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          folder="service-categories"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormDescription>
                    Type a keyword and press Enter or comma to add. Backspace
                    removes the last tag.
                  </FormDescription>
                  <KeywordsInput
                    control={form.control}
                    setValue={(name, value) =>
                      form.setValue(name as any, value)
                    }
                  />
                </FormItem>

                <Separator />

                <div className="grid grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Active</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="remote_available"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Remote available</FormLabel>
                        <FormControl>
                          <Switch
                            checked={!!field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(Boolean(checked))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rank"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rank</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent
                value="questions"
                className="mt-0 flex-1 overflow-y-auto px-6 py-5"
              >
                <QuestionsFieldArray
                  control={form.control}
                  setValue={(name, value) => form.setValue(name as any, value)}
                  register={form.register}
                />
              </TabsContent>

              <TabsContent
                value="faqs"
                className="mt-0 flex-1 overflow-y-auto px-6 py-5"
              >
                <FaqsFieldArray control={form.control} />
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-between border-t px-6 py-4 shrink-0">
              <p className="text-xs text-muted-foreground">
                {Object.keys(form.formState.errors).length > 0 && (
                  <span className="text-destructive">
                    Please fix the validation errors before saving.
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEdit ? "Save changes" : "Create category"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminCategoriesPage() {
  const {
    data: categories,
    isLoading,

    mutate,
  } = useSWR<Category[]>("/api/admin/service-categories", fetcher);

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

      <DeleteDialog
        category={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => mutate()}
      />
    </div>
  );
}
