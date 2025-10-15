import { z } from "zod";

// Define the denomination row schema
const DenominationRowSchema = z.object({
  denomination: z.number(),
  numberOfNotes: z.number().min(0, "Number of notes must be non-negative"),
  amount: z.number().min(0, "Amount must be non-negative"),
});

// Define the main denomination schema
export const DenominationSchema = z.object({
  date: z.string().min(1, "Date is required"),
  bankDeposited: z.string().min(1, "Bank deposited is required"),
  todayCollection: z.number().min(0, "Today collection must be non-negative"),
  previousDayCollection: z.number().min(0, "Previous day collection must be non-negative"),
  cashDenomination: z.string().optional(),
  denominations: z.array(DenominationRowSchema),
});

export type DenominationSchemaDTO = z.infer<typeof DenominationSchema>;

// Default denomination values
export const defaultDenominations = [
  { denomination: 1000, numberOfNotes: 0, amount: 0 },
  { denomination: 500, numberOfNotes: 0, amount: 0 },
  { denomination: 100, numberOfNotes: 0, amount: 0 },
  { denomination: 50, numberOfNotes: 0, amount: 0 },
  { denomination: 25, numberOfNotes: 0, amount: 0 },
  { denomination: 20, numberOfNotes: 0, amount: 0 },
  { denomination: 10, numberOfNotes: 0, amount: 0 },
  { denomination: 5, numberOfNotes: 0, amount: 0 },
  { denomination: 2, numberOfNotes: 0, amount: 0 },
  { denomination: 1, numberOfNotes: 0, amount: 0 },
];

// Empty denomination form data
export const emptyDenomination: DenominationSchemaDTO = {
  date: "",
  bankDeposited: "",
  todayCollection: 120023,
  previousDayCollection: 120023,
  cashDenomination: "",
  denominations: defaultDenominations,
};