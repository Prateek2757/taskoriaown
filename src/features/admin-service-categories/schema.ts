import { z } from "zod";
import type { Category } from "./types";

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

export const categorySchema = z.object({
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

export type CategoryFormValues = z.infer<typeof categorySchema>;

export function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildDefaultValues(category?: Category | null): CategoryFormValues {
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
    questions: (category?.questions ?? []).map((question) => ({
      ...question,
      options: Array.isArray(question.options)
        ? question.options.map(String)
        : [],
    })),
  };
}
