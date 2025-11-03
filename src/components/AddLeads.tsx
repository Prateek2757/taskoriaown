"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type FormData = {
  title: string;
  description?: string;
  category_id: string;
  city_id?: string;
  budget_min: string;
  budget_max: string;
  preferred_date_start: string;
  preferred_date_end: string;
  is_remote_allowed: boolean;
};

export default function AddLeadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<
    { category_id: number; name: string }[]
  >([]);
  const [locations, setLocations] = useState<
    { city_id: number; name: string }[]
  >([]);
  const [locationError, setLocationError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      is_remote_allowed: false,
    },
    mode: "onChange",
  });

  const isRemoteAllowed = watch("is_remote_allowed");
  const selectedCity = watch("city_id");

  useEffect(() => {
    axios
      .get("/api/signup/category-selection")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));

    axios
      .get("/api/signup/location")
      .then((res) => setLocations(res.data))
      .catch(() => toast.error("Failed to load locations"));
  }, []);

  const handleRemoteChange = (checked: boolean) => {
    setValue("is_remote_allowed", checked);
    setLocationError(""); // clear any previous error
  };

  const handleLocationChange = (value: string) => {
    setValue("city_id", value);
    setLocationError(""); // clear any previous error
  };

  const onSubmit = async (data: FormData) => {
    // ✅ Validate location or remote BEFORE submit
    if (!data.is_remote_allowed && !data.city_id) {
      setLocationError("Please select a location or enable remote work.");
      return;
    }

    if (!session?.user?.id) {
      toast.error("You must be logged in as a customer.");
      return;
    }

    try {
      await axios.post("/api/leads", {
        ...data,
        customer_id: session.user.id,
      });

      toast.success("Lead added successfully!");
      reset();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit lead");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[95%] sm:w-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl overflow-y-auto max-h-[90vh] backdrop-blur-md animate-in fade-in-0 zoom-in-95">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-[#00E5FF]  via-[#6C63FF] to-[#8A2BE2] bg-clip-text text-transparent">
            Post a New Lead
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            Describe your task — professionals will reach out with offers.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-3">
          {/* Title */}
          <div className="space-y-1">
            <Label>Title *</Label>
            <Input
              {...register("title", {
                required: "Please input a title",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
              placeholder="e.g., Fix kitchen sink"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Describe the task..."
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label>Category *</Label>
            <Select
              onValueChange={(value) => setValue("category_id", value)}
              value={watch("category_id")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.category_id}
                    value={String(cat.category_id)}
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-red-500 text-sm">Category is required</p>
            )}
          </div>

          {/* Budget */}
          <div className="flex gap-3">
            <div className="w-1/2 space-y-1">
              <Label>Min Budget *</Label>
              <Input
                type="number"
                {...register("budget_min", {
                  required: "Min budget is required",
                })}
              />
              {errors.budget_min && (
                <p className="text-red-500 text-sm">
                  {errors.budget_min.message}
                </p>
              )}
            </div>
            <div className="w-1/2 space-y-1">
              <Label>Max Budget *</Label>
              <Input
                type="number"
                {...register("budget_max", {
                  required: "Max budget is required",
                })}
              />
              {errors.budget_max && (
                <p className="text-red-500 text-sm">
                  {errors.budget_max.message}
                </p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="flex gap-3">
            <div className="w-1/2 space-y-1">
              <Label>Start Date *</Label>
              <Input
                type="date"
                {...register("preferred_date_start", {
                  required: "Start date required",
                })}
              />
              {errors.preferred_date_start && (
                <p className="text-red-500 text-sm">
                  {errors.preferred_date_start.message}
                </p>
              )}
            </div>
            <div className="w-1/2 space-y-1">
              <Label>End Date *</Label>
              <Input
                type="date"
                {...register("preferred_date_end", {
                  required: "End date required",
                })}
              />
              {errors.preferred_date_end && (
                <p className="text-red-500 text-sm">
                  {errors.preferred_date_end.message}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <Label>Location (optional if remote enabled)</Label>
            <Select onValueChange={handleLocationChange} value={selectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.city_id} value={String(loc.city_id)}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Remote Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="remote"
              checked={isRemoteAllowed}
              onCheckedChange={handleRemoteChange}
            />
            <Label htmlFor="remote">Remote work allowed</Label>
          </div>

          {/* Location or Remote Validation Error */}
          {locationError && (
            <p className="text-red-500 text-sm">{locationError}</p>
          )}

          {/* Submit */}
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 text-white bg-gradient-to-r from-[#00E5FF]  via-[#6C63FF] to-[#8A2BE2] hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg rounded-xl"
            >
              {isSubmitting ? "Submitting..." : "Submit Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
