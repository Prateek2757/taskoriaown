"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  HelpCircle,
  LayoutGrid,
  ListChecks,
  Loader2,
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload/image-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { saveAdminServiceCategory } from "@/services/admin-service-categories";
import {
  buildDefaultValues,
  categorySchema,
  toSlug,
  type CategoryFormValues,
} from "../schema";
import type { Category } from "../types";
import { FaqsFieldArray } from "./FaqsFieldArray";
import { KeywordsInput } from "./KeywordsInput";
import { QuestionsFieldArray } from "./QuestionsFieldArray";

type CategoryFormDialogProps = {
  category: Category | null;
  allCategories: Category[];
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export function CategoryFormDialog({
  category,
  allCategories,
  open,
  onClose,
  onSaved,
}: CategoryFormDialogProps) {
  const isEdit = !!category;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: buildDefaultValues(category),
  });

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
      await saveAdminServiceCategory(values, category?.category_id);
      toast.success(isEdit ? "Category updated" : "Category created");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    }
  }

  const questionCount = form.watch("questions")?.length ?? 0;
  const faqCount = form.watch("faqs")?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="flex max-h-[92vh] w-full max-w-3xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5 shrink-0">
          <DialogTitle className="text-lg">
            {isEdit ? `Edit - ${category?.name}` : "New Category"}
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
                    className="gap-1.5 rounded-none border-b-2 border-transparent px-3 pb-3 pt-1 text-sm bg-transparent"
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
                    className="gap-1.5 rounded-none border-b-2 border-transparent px-3 pb-3 pt-1 text-sm"
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
                <div className="grid gap-4">
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
                          onValueChange={(value) =>
                            field.onChange(value === "none" ? null : Number(value))
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
                              - None (top-level) -
                            </SelectItem>
                            {allCategories
                              .filter(
                                (item) =>
                                  item.category_id !== category?.category_id
                              )
                              .map((item) => (
                                <SelectItem
                                  key={item.category_id}
                                  value={String(item.category_id)}
                                >
                                  {item.name}
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
                            onChange={(event) =>
                              field.onChange(Number(event.target.value))
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
