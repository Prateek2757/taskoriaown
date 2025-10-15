"use client";

import FormCombo from "@/components/formElements/FormCombo";
import FormInputFile from "@/components/formElements/FormInputFile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  AddDocumentDTO,
  AddDocumentSchema,
  emptyDocument,
} from "../schemas/documentSchemas";

interface KycDocumentsProps {}

const fetchDocumentOfList = async () => {
  const data: PostCallData = { endpoint: "documentmanagement_requiredlist" };
  const response = await apiPostCall(data);
  if (response?.status === API_CONSTANTS.success) {
    return response.data.documentofList;
  }
  throw new Error("Failed to fetch Document if list");
};

const fetchDocumentForList = async () => {
  const data: PostCallData = { endpoint: "documentmanagement_requiredlist" };
  const response = await apiPostCall(data);
  if (response?.status === API_CONSTANTS.success) {
    return response.data.documentForList;
  }
  throw new Error("Failed to fetch Document if list");
};
const fetchDocumentNameList = async () => {
  const data: PostCallData = { endpoint: "documentmanagement_requiredlist" };
  const response = await apiPostCall(data);
  if (response?.status === API_CONSTANTS.success) {
    return response.data.documentNameList;
  }
  throw new Error("Failed to fetch Document if list");
};
export default function DocumentForm({}: KycDocumentsProps) {
  const [uniqueId, setUniqueId] = useState<SelectOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(AddDocumentSchema),
    defaultValues: {
      ...emptyDocument,
    },
    mode: "onChange",
  });

  const { data: documentOfList } = useQuery<SelectOption[]>({
    queryKey: ["documentOfList"],
    queryFn: fetchDocumentOfList,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const { data: documentForList } = useQuery<SelectOption[]>({
    queryKey: ["documentForList"],
    queryFn: fetchDocumentForList,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const { data: documentNameList } = useQuery<SelectOption[]>({
    queryKey: ["documentNameList"],
    queryFn: fetchDocumentNameList,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const documentOf = form.watch("documentOf");

  const fetchUniqueId = useCallback(async (value: string) => {
    try {
      const submitData: PostCallData & {
        flag: string;
        search: string;
      } = {
        flag: documentOf as string,
        search: value,
        endpoint: "get_utility_dropdown",
      };

      const response = await apiPostCall(submitData);

      if (response && response.status === API_CONSTANTS.success) {
        setUniqueId(response.data || []);
      }
    } catch (error) {
      console.error("Error getting unique list", error);
    } finally {
    }
  }, []);

  const [documents, setDocuments] = useState<any[]>(() => {
    const formDocument =
      ((form as any).getValues("VoucherEntryListJson") as any[]) || [];
    if (formDocument.length === 0) {
      return [
        {
          id: 1,
          collectionType: "",
          BankName: "",
          ChequeNo: "",
          DepositeDateBS: "",
          DepositeDateAD: "",
          TendorAmount: "",
          Remarks: "",
        },
      ];
    }
    return formDocument.map((documents, index) => ({
      ...documents,
      id: index + 1,
    }));
  });

  const addDocument = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentDocuments =
      ((form as any).getValues("VoucherEntryListJson") as any[]) || [];
    const nextId = Math.max(...documents.map((n: any) => n.id), 0) + 1;
    const newDocuments = {
      id: nextId,
      collectionType: "",
      BankName: "",
      ChequeNo: "",
      DepositeDateBS: "",
      DepositeDateAD: "",
      TendorAmount: "",
      Remarks: "",
    };

    const updatedDocuments = [...currentDocuments, newDocuments];
    (form as any).setValue("VoucherEntryListJson", updatedDocuments);
    setDocuments((prev: any[]) => [
      ...prev,
      {
        ...newDocuments,
      },
    ]);
  };
  const removeDocument = (id: number) => {
    if (documents.length > 1) {
      const indexToRemove = documents.findIndex(
        (document: any) => document.id === id
      );
      const currentDocuments =
        ((form as any).getValues("VoucherEntryListJson") as any[]) || [];
      const updatedDocuments = currentDocuments.filter(
        (_: any, index: number) => index !== indexToRemove
      );

      (form as any).setValue("VoucherEntryListJson", updatedDocuments);
      setDocuments(documents.filter((document: any) => document.id !== id));
    }
  };

  const onSubmit: SubmitHandler<AddDocumentDTO> = async (formData) => {
    try {
      setIsSubmitting(true);

      console.log("this is form data", formData);

      const submitData: PostCallData = {
        ...formData,
        endpoint: "department_manage",
      };

      const response = await apiPostCall(submitData);
      console.log("this is department data response", response);

      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response?.data.code,
          response?.data.message,
          "Add department"
        );
        router.push("/configuration/organization-setup/doctor");
      } else {
        showToast(
          response?.data.code,
          response?.data.message,
          "Add department"
        );
      }
    } catch (error) {
      console.error("Error submitting department:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to save department details"}`,
        "Add department"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>KYC Document Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <FormCombo
                  form={form}
                  name="documentOf"
                  label="Document Of"
                  options={documentOfList}
                />
              </div>
              <div className="space-y-2">
                <FormCombo
                  form={form}
                  name="uniqueId"
                  label="Unique Id"
                  options={uniqueId}
                  onSearch={fetchUniqueId}
                />
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden mb-5">
              <div className="flex gap-4 border-y font-semibold px-4 py-2 bg-gray-100/50">
                <div className="flex-1">
                  <span className="text-sm text-gray-600">Document For</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-600">Document Name</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-600">Document File</span>
                </div>
                <div className="w-[36px]"></div>
              </div>
              {documents.map((document, index) => (
                <div key={document.id} className="flex gap-4 px-4 py-2">
                  <div className="flex-1">
                    <FormCombo
                      form={form}
                      name={`documentList.${index}.documentFor`}
                      label=""
                      options={documentForList}
                    />
                  </div>
                  <div className="flex-1">
                    <FormCombo
                      form={form}
                      name={`documentList.${index}.documentName`}
                      label=""
                      options={documentNameList}
                    />
                  </div>
                  <div className="flex-1">
                    <FormInputFile
                      form={form}
                      name={`documentList.${index}.documentFile`}
                      label=""
                      fileNameField={`documentList.${index}.documentFileName`}
                      accept=".png,.jpg,.jpeg,.pdf"
                      maxSize={5}
                      validTypes={[
                        "image/png",
                        "image/jpeg",
                        "application/pdf",
                      ]}
                      {...(document.documentUrl && {
                        editMode: true,
                        initialImageUrl: document.documentUrl,
                        initialFileName: document.documentFileName,
                      })}
                      required
                    />
                  </div>

                  <div className="w-[36px]">
                    {documents.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeDocument(document.id)}
                        size={"icon"}
                        title="Remove Item"
                      >
                        <Trash />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div className="border-t-1 flex justify-end items-center px-4 py-2 font-semibold">
                <Button type="button" onClick={addDocument}>
                  <Plus /> Add Document
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
            >
              {isSubmitting && <Loader2Icon className="h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
