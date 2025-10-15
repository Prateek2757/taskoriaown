"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { apiGetCall, type PostCallData } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type RoleDetail = {
  group: string;
  subGroupName: string;
  menuName: string;
  slug: string;
  displayOrder: string;
  isActive: string;
  selected: boolean;
};

type RoleGroup = {
  roleName: string | null;
  groupName: string;
  subGroupName: string;
  roleDetails: RoleDetail[];
};

type RoleListProps = {
  selectedRoles?: string[];
};

const getSubGroupKey = (groupName: string, subGroupName: string) =>
  `${groupName}__${subGroupName}`;

export default function RoleList({ selectedRoles = [] }: RoleListProps) {
  const form = useFormContext();
  const { setValue } = form;

  const [groupedData, setGroupedData] = useState<
    Record<string, Record<string, RoleDetail[]>>
  >({});
  const [slugToMenuName, setSlugToMenuName] = useState<Record<string, string>>(
    {}
  );
  const [isGroupOpen, setIsGroupOpen] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload: PostCallData = { endpoint: "role_required_fields" };
        const response = await apiGetCall(payload);

        if (response?.data && response.status === API_CONSTANTS.success) {
          const flatData: RoleGroup[] = response.data;
          const grouped: Record<string, Record<string, RoleDetail[]>> = {};
          const slugMap: Record<string, string> = {};

          flatData.forEach(({ groupName, subGroupName, roleDetails }) => {
            if (!grouped[groupName]) grouped[groupName] = {};
            if (!grouped[groupName][subGroupName])
              grouped[groupName][subGroupName] = [];
            grouped[groupName][subGroupName].push(...roleDetails);

            roleDetails.forEach((detail) => {
              const isSelected =
                selectedRoles.includes(detail.slug) || detail.selected;
              setValue(detail.slug, isSelected);
              slugMap[detail.slug] = detail.menuName;
            });

            const subGroupKey = getSubGroupKey(groupName, subGroupName);
            const allSelected = roleDetails.every((d) => d.selected);
            setValue(subGroupKey, allSelected);
          });

          const openState: Record<string, boolean> = {};
          Object.keys(grouped).forEach((groupName) => {
            openState[groupName] = true;
          });

          setGroupedData(grouped);
          setSlugToMenuName(slugMap);
          setIsGroupOpen(openState);
        } else {
          setError("Failed to load permissions.");
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("An error occurred while fetching permissions.");
      }
    };

    fetchData();
  }, [setValue, selectedRoles]);

  const groupsInfo = useMemo(() => {
    const groups: {
      groupName: string;
      parentKey: string;
      childrenKeys: string[];
      label: string;
    }[] = [];

    for (const [groupName, subGroups] of Object.entries(groupedData)) {
      for (const [subGroupName, roleDetails] of Object.entries(subGroups)) {
        const parentKey = getSubGroupKey(groupName, subGroupName);
        const childrenKeys = roleDetails.map((d) => d.slug);
        groups.push({
          groupName,
          parentKey,
          childrenKeys,
          label: subGroupName,
        });
      }
    }
    return groups;
  }, [groupedData]);

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 border border-red-300 rounded">
        {error}
      </div>
    );
  }

  if (!Object.keys(groupedData).length) {
    return (
      <div className="p-4 text-gray-600 animate-pulse">
        Loading permissions...
      </div>
    );
  }

  return (
    <section className="border border-gray-200 rounded-lg p-3 mb-4 bg-white mt-3">
      {Object.entries(groupedData).map(([groupName, subGroups]) => (
        <div key={groupName} className="">
          {/* Group Header */}
          <div className="flex justify-between items-center bg-gray-50 px-2 m-4 py-3 rounded-lg">
            <span className="text-lg  font-semibold text-gray-800 ">
              {groupName}
            </span>
            <button
              type="button"
              onClick={() =>
                setIsGroupOpen((prev) => ({
                  ...prev,
                  [groupName]: !prev[groupName],
                }))
              }
              className="text-gray-700 hover:text-gray-900"
            >
              {isGroupOpen[groupName] ? (
                <Minus size={18} />
              ) : (
                <Plus size={18} />
              )}
            </button>
          </div>

          {isGroupOpen[groupName] && (
            <div className="p-4 space-y-4">
              {Object.entries(subGroups).map(([subGroupName]) => {
                const parentKey = getSubGroupKey(groupName, subGroupName);
                const groupInfo = groupsInfo.find(
                  (g) => g.parentKey === parentKey
                );
                if (!groupInfo) return null;

                return (
                  <GroupSync
                    key={parentKey}
                    parentKey={parentKey}
                    childrenKeys={groupInfo.childrenKeys}
                    label={groupInfo.label}
                    slugToMenuName={slugToMenuName}
                  />
                );
              })}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function GroupSync({
  parentKey,
  childrenKeys,
  label,
  slugToMenuName,
}: {
  parentKey: string;
  childrenKeys: string[];
  label: string;
  slugToMenuName: Record<string, string>;
}) {
  const form = useFormContext();
  const { watch, setValue } = form;

  const parentValue = useWatch({ name: parentKey });
  const childrenValues = useWatch({ name: childrenKeys });

  useEffect(() => {
    if (parentValue) {
      childrenKeys.forEach((key) => setValue(key, true));
    }
  }, [parentValue, childrenKeys, setValue]);

  useEffect(() => {
    const allChildrenOn = childrenValues?.every((v) => v === true);
    const anyChildOff = childrenValues?.some((v) => v === false);

    if (anyChildOff && parentValue) {
      setValue(parentKey, false);
    } else if (allChildrenOn && !parentValue) {
      setValue(parentKey, true);
    }
  }, [childrenValues, parentValue, parentKey, setValue]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <FormSwitch form={form} name={parentKey} label={`Enable ${label}`} />
      <div className="mt-4 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-dashed border-blue-200 rounded">
        {childrenKeys.map((key) => {
          const menuName = slugToMenuName[key] ?? "";
          return (
            <FormSwitch key={key} form={form} name={key} label={menuName} />
          );
        })}
      </div>
    </div>
  );
}
