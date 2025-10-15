"use client";

import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { groupedBranchData } from "../branchGroupStaticData";
import { Minus, Plus } from "lucide-react";

export default function UserWiseBranchList() {
  const form = useFormContext();
  const { setValue } = form;

  const [slugToName, setSlugToName] = useState<Record<string, string>>({});
  const [isGroupOpen, setIsGroupOpen] = useState<Record<string, boolean>>({});

  const getGroupKey = (groupName: string) => groupName;

  useEffect(() => {
    const slugMap: Record<string, string> = {};
    const openState: Record<string, boolean> = {};

    for (const [groupName, subGroups] of Object.entries(groupedBranchData)) {
      openState[groupName] = true;

      const allDetails = Object.values(subGroups).flat();

      allDetails.forEach((detail) => {
        slugMap[detail.slug] = detail.menuName;
        setValue(detail.slug, detail.selected);
      });

      const allSelected = allDetails.every((d) => d.selected);
      setValue(getGroupKey(groupName), allSelected);
    }

    setSlugToName(slugMap);
    setIsGroupOpen(openState);
  }, [setValue]);

  return (
    <section className="border border-gray-200 rounded-lg p-3 mb-8 bg-white mt-3">
      {Object.entries(groupedBranchData).map(([groupName, subGroups]) => {
        const allDetails = Object.values(subGroups).flat();
        const childrenKeys = allDetails.map((d) => d.slug);
        const groupKey = getGroupKey(groupName);

        return (
          <div key={groupName}>
            {/* Group Accordion Header */}
            <div className="flex justify-between items-center bg-gray-50 px-4 py-3 m-4 rounded-lg">
              <span className="text-lg font-semibold text-gray-800">
                {groupName}
              </span>
              <button
                type="button"
                className="text-gray-700 hover:text-gray-900"
                onClick={() =>
                  setIsGroupOpen((prev) => ({
                    ...prev,
                    [groupName]: !prev[groupName],
                  }))
                }
              >
                {isGroupOpen[groupName] ? (
                  <Minus size={18} />
                ) : (
                  <Plus size={18} />
                )}
              </button>
            </div>

            {/* Accordion Content */}
            {isGroupOpen[groupName] && (
              <div className="p-4 space-y-4">
                <GroupSwitchSync
                  parentKey={groupKey}
                  childrenKeys={childrenKeys}
                  slugToName={slugToName}
                  form={form}
                />
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

function GroupSwitchSync({
  parentKey,
  childrenKeys,
  slugToName,
  form,
}: {
  parentKey: string;
  childrenKeys: string[];
  slugToName: Record<string, string>;
  form: any;
}) {
  const { watch, setValue } = form;

  const parentValue = useWatch({ name: parentKey });
  const childrenValues = useWatch({ name: childrenKeys });

  React.useEffect(() => {
    if (parentValue !== undefined) {
      childrenKeys.forEach((key) => setValue(key, parentValue));
    }
  }, [parentValue, childrenKeys, setValue]);

  React.useEffect(() => {
    if (childrenValues) {
      const allChecked = childrenValues.every((v) => v === true);
      const anyUnchecked = childrenValues.some((v) => v === false);

      if (anyUnchecked && parentValue) setValue(parentKey, false);
      else if (allChecked && !parentValue) setValue(parentKey, true);
    }
  }, [childrenValues, parentValue, parentKey, setValue]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <FormSwitch form={form} name={parentKey} label={`Enable ${parentKey}`} />
      <div className="mt-4 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-dashed border-blue-200 rounded">
        {childrenKeys.map((key) => (
          <FormSwitch
            key={key}
            form={form}
            name={key}
            label={slugToName[key]}
          />
        ))}
      </div>
    </div>
  );
}
