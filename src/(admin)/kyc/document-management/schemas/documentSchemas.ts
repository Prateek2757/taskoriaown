import { z } from "zod";

export const DocumentSearchSchema = z.object({
  kycNumber: z.string().optional().nullable(),
  policyNumber: z.string().optional().nullable(),
  agentCode: z.string().optional().nullable(),
});

export type DocumentSearchDTO = z.infer<typeof DocumentSearchSchema>;

export const emptyDocumentSearch = {
  kycNumber: "",
  policyNumber: "",
  agentCode: "",
};

// ============================

export const DocumentListSchema = z.object({
  documentFor: z.string().optional().nullable(),
  documentName: z.string().min(1, "Document type is required"),
  documentFile: z.union([z.string(), z.any()]),
  documentFileName: z.string().min(1, "Document file name is required"),
  documentUrl: z.string().optional(),
  documentPath: z.string().optional(),
});

export type DocumentListDTO = z.infer<typeof DocumentListSchema>;

export const emptyDocumentList: DocumentListDTO = {
  documentFor: "",
  documentName: "",
  documentFile: "",
  documentFileName: "",
  documentUrl: "",
  documentPath: "",
};

export const AddDocumentSchema = z.object({
  documentOf: z.string().optional().nullable(),
  uniqueId: z.string().optional().nullable(),
  documentListParam: z.array(DocumentListSchema).optional(),
});

export type AddDocumentDTO = z.infer<typeof AddDocumentSchema>;

export const emptyDocument: AddDocumentDTO = {
  documentOf: "",
  uniqueId: "",
  documentListParam: [],
};
