"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";

type FormData = {
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  website?: string;
  categories: number[];
  location_id?: number;
  is_nationwide: boolean;
};

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [categoriesList, setCategoriesList] = useState<
    { category_id: number; name: string }[]
  >([]);
  const [citiesList, setCitiesList] = useState<
    { city_id: number; name: string }[]
  >([]);

  const { register, handleSubmit, control, watch } = useForm<FormData>({
    defaultValues: { is_nationwide: false, categories: [] },
  });

  // Fetch categories and cities from backend
  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategoriesList(res.data));
  }, []);

  // Draft user creation
  const createDraftUser = async () => {
    try {
      const res = await axios.post("/api/signup/draft", { role: "provider" });
      setUserId(res.data.user.user_id);
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!userId) return alert("Draft user not created");

    try {
      await axios.post("/api/signup/final-submit", {
        user_id: userId,
        ...data,
      });
      alert("Signup complete!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {step === 1 && (
        <Button
          onClick={createDraftUser}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Become a Professional
        </Button>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Categories */}
          <div>
            <label className="block font-semibold">Select Categories</label>
            <Controller
              name="categories"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  multiple
                  className="w-full border p-2 rounded"
                  value={field.value.map(String)} // convert numbers to strings
                  onChange={(e) => {
                    const selectedValues = Array.from(
                      e.target.selectedOptions,
                      (option) => Number(option.value)
                    );
                    field.onChange(selectedValues);
                  }}
                >
                  {categoriesList.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold">Location</label>
            <input type="checkbox" {...register("is_nationwide")} /> Nationwide
            {!watch("is_nationwide") && (
              <select
                {...register("location_id")}
                className="w-full border p-2 rounded mt-2"
              >
                {citiesList.map((c) => (
                  <option key={c.city_id} value={c.city_id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block font-semibold">Name</label>
            <input
              {...register("name")}
              className="w-full border p-2 rounded"
              required
            />

            <label className="block font-semibold mt-2">Email</label>
            <input
              {...register("email")}
              className="w-full border p-2 rounded"
              required
            />

            <label className="block font-semibold mt-2">Phone</label>
            <input
              {...register("phone")}
              className="w-full border p-2 rounded"
            />

            <label className="block font-semibold mt-2">Company Name</label>
            <input
              {...register("company_name")}
              className="w-full border p-2 rounded"
            />

            <label className="block font-semibold mt-2">Website</label>
            <input
              {...register("website")}
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-cyan-600 text-white px-4 py-2 rounded"
          >
            Complete Signup
          </button>
        </form>
      )}
    </div>
  );
}
