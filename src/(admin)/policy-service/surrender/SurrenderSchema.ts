import z from "zod";

export const forwardSurrenderForm=z.object({
    PolicyNumber: z.string().min(1, "Policy Number is required"),
    SurrenderDate: z.string().optional(),
    Remarks: z.string().optional(),
    policyNumberEncrypted: z.string().optional(),
    
})
export type ForwardSurrenderDTO = z.infer<typeof forwardSurrenderForm>;
export const emptyforwardSurrender = (): ForwardSurrenderDTO => ({
  PolicyNumber: "",
  SurrenderDate: "",
  Remarks: "",
  policyNumberEncrypted:""
});


export const SurrenderSchema = z.object({
    PolicyNumber: z.string().optional(),
    policyNumberEncrypted: z.string().optional(),
    surrenderDate:z.string().min(1, "Surrender Date is required"),
    remarks: z.string().min(1, "Remarks is required"),
    rowId: z.string().optional(),
});

export type SurrenderDTO = z.infer<typeof SurrenderSchema>;



export const emptySurrender = (): SurrenderDTO => ({
  PolicyNumber: "",
  policyNumberEncrypted: "",
  surrenderDate: "",
  remarks: "",
});

export function createEmptyDefaults<T extends z.ZodTypeAny>(schema: T): any {
  const shape = (schema as unknown as z.ZodObject<any>).shape;
  return Object.fromEntries(
    Object.keys(shape).map((key) => [key, ""])
  );
}