import { z } from "zod";
import type { FieldValues } from "react-hook-form";

export const AddUserBranchSchema = z.object({
  userId: z.string().min(1, { message: "Please select a user" }),
  selectedBranches: z.array(z.string()).min(1, { message: "Select at least one branch" }),
});

export type AddUserBranchDTO = z.infer<typeof AddUserBranchSchema>;

export const AddEditUserBranchSchema = AddUserBranchSchema.extend({
  id: z.string().min(1, { message: "Missing ID for edit mode" }),
});

export type AddEditUserBranchDTO = z.infer<typeof AddEditUserBranchSchema> & FieldValues;

export const emptyUserBranch: AddUserBranchDTO = {
  userId: "",
  selectedBranches: [],
};
