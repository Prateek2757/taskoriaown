import type { FieldValues } from "react-hook-form";
import { z } from "zod";


export const BodListSchema = z.object({
  bodType: z.string().min(1, { message: "BOD Type is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  email: z.string().email({ message: "Invalid email" }).optional(),
  phoneNo: z.string().min(1, { message: "Phone number is required" }),
  sequence: z.string().optional(),
  appointedDateBS: z.string().optional(),
  appointedDateAD: z.string().optional(),
  reappointedDateBS: z.string().optional(),
  reappointedDateAD: z.string().optional(),
  image: z
    .any()
    .refine((file) => file, { message: "Image is required" }) 
    .refine((file) => file?.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    }),
  imageName: z.string().optional(),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
});

export type BodListDTO = z.infer<typeof BodListSchema> & FieldValues;


export const emptyBodList: BodListDTO = {
  bodType: "",
  name: "",
  position: "",
  email: "",
  phoneNo: "",
  sequence: "",
  appointedDateBS: "",
  appointedDateAD: "",
  reappointedDateBS: "",
  reappointedDateAD: "",
  image: undefined,
  imageName: "",
  isActive: true,
  description: "",
};
