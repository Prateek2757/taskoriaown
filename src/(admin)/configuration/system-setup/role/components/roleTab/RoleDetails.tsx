"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import { Minus, Plus } from "lucide-react";

export default function RoleDetails() {
  const form = useFormContext();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="border border-gray-200 rounded-lg p-3 mb-8 bg-white mt-3">
      <div className="flex justify-between items-center bg-gray-50 px-2 m-4 py-3 rounded-lg">
        <span className="text-lg font-semibold text-gray-800">
          ADD ROLE DETAILS
        </span>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 hover:text-gray-900"
        >
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </button>
      </div>

      {isOpen && (
        <div className="p-4">
          <div className="border border-dashed border-blue-200 rounded p-4 bg-white">
            <FormInput
              form={form}
              name="roleName"
              type="text"
              label="Role Name"
              placeholder="Enter role name"
              required
            />
          </div>
        </div>
      )}
    </section>
  );
}
