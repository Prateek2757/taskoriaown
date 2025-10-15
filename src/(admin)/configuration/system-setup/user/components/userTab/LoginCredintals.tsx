"use client";

import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import FormToggle from "@/components/formElements/FormToggle";
import { FormSwitch } from "@/components/formElements/FormSwitch";

type LoginCredentialsFormProps<T> = {
  form: UseFormReturn<T>;
  roleList: { label: string; value: string }[];
};

export default function LoginCredentials<T>({
  form,
  roleList,
}: LoginCredentialsFormProps<T>) {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Login Credentials
      </h2>

      <div className="border-blue-200 rounded-lg pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* username */}
          <FormInput
            form={form}
            name="userName"
            label="username"
            placeholder="Enter username"
            type="text"
            required={true}
          />

          {/* Password */}
          <FormInput
            form={form}
            name="password"
            label="Password"
            placeholder="Enter Password"
            type="password"
            required={false}
          />

          {/* User Role */}
          <FormSelect
            form={form}
            name="role"
            label="User Role"
            caption="Select Role"
            options={roleList}
            required
          />

          {/* Employee ID */}
          <FormInput
            form={form}
            name="employeeId"
            label="Employee ID"
            placeholder="Enter Employee ID"
            type="text"
            required
          />

          <FormSwitch label="Allow Login" name="allowLogin" form={form} />
        </div>
      </div>
    </>
  );
}
