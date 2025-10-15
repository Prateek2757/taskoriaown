"use client";

import FormCombo from "@/components/formElements/FormCombo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Plus, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  DocumentSearchDTO,
  DocumentSearchSchema,
  emptyDocumentSearch,
} from "../schemas/documentSchemas";
import Link from "next/link";

type Props = {
  onSearch?: (data: DocumentSearchDTO) => void;
};

export default function DocumentSearchForm({ onSearch }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycList, setKycList] = useState<SelectOption[]>([]);
  const [policyList, setPolicyList] = useState<SelectOption[]>([]);
  const [agentList, setAgentList] = useState<SelectOption[]>([]);
  type DocumentType = {
    documentFor: string;
    documentOf: string;
    documentName: string;
    uniqueId: string;
    createdDate: string;
    modifiedDate: string;
    isActive: string;
  };

  const [documentList, setDocumentList] = useState<DocumentType[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const form = useForm<DocumentSearchDTO>({
    resolver: zodResolver(DocumentSearchSchema),
    defaultValues: {
      ...emptyDocumentSearch,
    },
    mode: "onChange",
  });

  const { showToast } = useToast();

  const getKycList = useCallback(async (value: string) => {
    try {
      const submitData: PostCallData & {
        flag: string;
        search: string;
      } = {
        flag: "KYCNoAutoComplete",
        search: value,
        endpoint: "get_utility_dropdown",
      };

      const response = await apiPostCall(submitData);
      console.log("Policy List Response:", response);

      if (response && response.status === API_CONSTANTS.success) {
        setKycList(response.data || []);
      }
    } catch (error) {
      console.error("Error getting policy list", error);
    } finally {
    }
  }, []);

  const getPolicyList = useCallback(async (value: string) => {
    try {
      const submitData: PostCallData & {
        flag: string;
        search: string;
      } = {
        flag: "PolicyNumberAutoComplete",
        search: value,
        endpoint: "get_utility_dropdown",
      };

      const response = await apiPostCall(submitData);
      console.log("Policy List Response:", response);

      if (response && response.status === API_CONSTANTS.success) {
        setPolicyList(response.data || []);
      }
    } catch (error) {
      console.error("Error getting policy list", error);
    } finally {
    }
  }, []);

  const getAgentList = useCallback(async (value: string) => {
    try {
      const submitData: PostCallData & {
        flag: string;
        search: string;
      } = {
        flag: "AgentCodeAutoComplete",
        search: value,
        endpoint: "get_utility_dropdown",
      };

      const response = await apiPostCall(submitData);
      console.log("Policy List Response:", response);

      if (response && response.status === API_CONSTANTS.success) {
        setAgentList(response.data || []);
      }
    } catch (error) {
      console.error("Error getting policy list", error);
    } finally {
    }
  }, []);

  const onSubmit: SubmitHandler<DocumentSearchDTO> = async (formData) => {
    try {
      setIsSubmitting(true);
      const submitData: PostCallData = {
        ...formData,
        endpoint: "documentmanagement_list",
      };

      console.log("first", submitData);
      const response = await apiPostCall(submitData);
      console.log("second", response);

      if (response && Array.isArray(response.data)) {
        setDocumentList(response.data);
        showToast(
          SYSTEM_CONSTANTS.success_code,
          `Found ${response.data.length} documents`,
          "Document Search"
        );
      } else if (response?.data?.code === SYSTEM_CONSTANTS.success_code) {
        setDocumentList(response.data.documents || []);
        showToast(response.data.code, response.data.message, "Document Search");
      } else {
        setDocumentList([]);
        showToast(
          response?.data?.code || SYSTEM_CONSTANTS.error_code,
          response?.data?.message || "No documents found",
          "Document Search"
        );
      }
    } catch (error) {
      console.error("Error submitting Kyc Link form:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to save Kyc Link details"}`,
        "Add Kyc List"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const kycNumber = form.getValues("kycNumber");

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Search KYC Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <FormCombo
                      form={form}
                      name="kycNumber"
                      options={kycList}
                      label="KYC Number"
                      onSearch={getKycList}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormCombo
                      form={form}
                      name="policyNumber"
                      options={policyList}
                      label="Policy Number"
                      onSearch={getPolicyList}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormCombo
                      form={form}
                      name="agentCode"
                      options={agentList}
                      label="Agent Code"
                      onSearch={getAgentList}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
              >
                {isSubmitting && (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                )}
                <Search />
                Search
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      {documentList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between ">
              Search Results ({documentList.length} documents found)
              {/* <Button asChild>
                <Link
                  href={`document-management/add/${kycNumber}`}
                  className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
                >
                  <Plus color="#fff" size={18} />
                  <span>Add New Document</span>
                </Link>
              </Button> */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document For</TableHead>
                    <TableHead>Document Of</TableHead>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Unique Id</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Modified Date</TableHead>
                    <TableHead>Preview Document</TableHead>
                    <TableHead>Is Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentList.map((document) => (
                    <TableRow key={`${document.rowId}-${document.uniqueId}`}>
                      <TableCell className="font-medium">
                        {document.documentFor}
                      </TableCell>
                      <TableCell>{document.documentOf}</TableCell>
                      <TableCell>{document.documentName}</TableCell>
                      <TableCell>{document.uniqueId}</TableCell>
                      <TableCell>{document.createdDate}</TableCell>
                      <TableCell>{document.modifiedDate || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog
                            open={isPreviewOpen}
                            onOpenChange={setIsPreviewOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                type="button"
                              >
                                Preview
                              </Button>
                            </DialogTrigger>
                            <DialogOverlay className="bg-transparent" />
                            <DialogContent className="min-w-[90vw] max-h-[90vh] overflow-auto">
                              <div className="flex justify-center items-center">
                                <img src={document.documentFile} alt="" />
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            type="button"
                            asChild
                          >
                            <a href={document.documentFile} download>
                              Download
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {document.isActive === "True" ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-500 text-white dark:bg-green-600"
                          >
                            {document.isActive}
                          </Badge>
                        ) : (
                          <Badge variant={"destructive"}>
                            {document.isActive}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {documentList.length === 0 && isSubmitting === false && (
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-gray-500">
              No documents found. Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
