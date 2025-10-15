"use client";

import { useForm, FormProvider } from "react-hook-form";
import EndorsementForm from "./search-policy";
import { Search } from "lucide-react";
import SearchingPolicy from "./components/SearchingPolicy";
import EndorsementRequesting from "./components/EndorsementRequesting";
import SearchDocuments from "./components/Documents";
import { Button } from "@/components/ui/button";
// import EndorsementForm from "../policy-endorsement/search-policy";


export default function Page() {
  // Initialize react-hook-form
  const form = useForm({
    defaultValues: {
      policyNo: "",
      endorsementType: "",
      requesterName: "",
      requesterMobileNo: "",
      requesterEmail: "",
      remarks: "",
      documentList: [{ documentName: "", documentFile: null, documentFileName: "" }],
    },
  });

  return (
    <FormProvider {...form}>
      <div className="min-h-screen">
       <div className="bg-white rounded-lg border mb-6 mt-4 justify-start">
       
      
        {/* <EndorsementForm */}
       <SearchingPolicy form={form} /> 
       
       <EndorsementRequesting form={form} />
       <SearchDocuments form={form} />
      </div>
      </div>
      
     <div className="">
  <Button
    type="submit"
    className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-600"
  >
    <span>Submit</span>
  </Button>
</div>
      
    </FormProvider>
  );
}
