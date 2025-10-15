"use client";

import { useFormContext } from "react-hook-form";
import { AddRoleDTO } from "./schemas/RoleSchemas";
// import { AddRoleDTO } from "../schemas/RoleSchemas"; // adjust this path if needed

interface RoleSelectorProps {
  availableRoles: any[];
}

export default function RoleSelector({ availableRoles }: RoleSelectorProps) {
  const { watch, setValue } = useFormContext<AddRoleDTO>();
  const selectedRoles = watch("selectedRoles");

  const toggleRole = (slug: string) => {
    const newRoles = selectedRoles.includes(slug)
      ? selectedRoles.filter((s) => s !== slug)
      : [...selectedRoles, slug];

    setValue("selectedRoles", newRoles, { shouldValidate: true });
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Permissions</h3>

      {availableRoles?.map((group, idx) => (
        <div key={idx} className="mb-6 border rounded p-4">
          <h4 className="font-semibold text-blue-600">
            {group.groupName} - {group.subGroupName}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {group.roleDetails.map((role: any) => (
              <label
                key={role.slug}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.slug)}
                  onChange={() => toggleRole(role.slug)}
                />
                {role.menuName}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
