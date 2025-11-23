"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bot, Upload, Eye, Sparkles } from "lucide-react";

// ✅ Schema for validation
const jobSchema = z.object({
  jobTitle: z.string().min(3, "Job title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget: z.string().min(1, "Budget is required"),
  location: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function JobPostingForm() {
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobTitle: "",
      category: "",
      description: "",
      budget: "",
      location: "",
    },
  });

  const categories = [
    "Web Development",
    "Mobile Development",
    "Graphic Design",
    "Content Writing",
    "Digital Marketing",
    "Business Consulting",
    "Data Analysis",
    "Video Production",
  ];

  const handleAISuggestions = () => {
    const suggestions = [
      "Consider adding specific deliverables and milestones",
      "Mention your preferred communication style",
      "Include any relevant files or references",
      "Specify your timeline and deadline requirements",
    ];
    setAiSuggestions(suggestions);
  };

  const onSubmit: SubmitHandler<JobFormValues> = async (data) => {
    // 🔗 Here you’d call Supabase/Express API to save job
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Post a New Job
          </CardTitle>
          <p className="text-muted-foreground text-sm sm:text-base">
            Create a detailed job post to attract the best service providers.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title *</label>
              <Input
                placeholder="e.g., Build a responsive e-commerce website"
                {...register("jobTitle")}
              />
              {errors.jobTitle && (
                <p className="text-sm text-red-500">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <Select onValueChange={(val) => setValue("category", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Job Description *</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAISuggestions}
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Get AI Suggestions
                </Button>
              </div>
              <Textarea
                placeholder="Describe your project in detail..."
                rows={6}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
              {aiSuggestions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 animate-in fade-in-50">
                  <h4 className="font-medium text-blue-900 flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    AI Suggestions:
                  </h4>
                  <ul className="space-y-1">
                    {aiSuggestions.map((s, i) => (
                      <li
                        key={i}
                        className="text-sm text-blue-800 flex items-start gap-2"
                      >
                        <span className="text-blue-600">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Budget & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget *</label>
                <Input
                  placeholder="e.g., $500 - $1000"
                  {...register("budget")}
                />
                {errors.budget && (
                  <p className="text-sm text-red-500">
                    {errors.budget.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="e.g., Remote or New York, NY"
                  {...register("location")}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Upload relevant files, images, or documents
                </p>
                <Button variant="outline" type="button" className="mt-2">
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Required Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">JavaScript</Badge>
                <Badge variant="secondary">CSS</Badge>
                <Button variant="outline" size="sm" type="button">
                  + Add Skill
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] text-white"
              >
                {isSubmitting ? "Posting..." : "Post Job"}
              </Button>
              <Button variant="outline" size="lg" type="button">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
