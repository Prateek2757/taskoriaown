"use client";
import FormInput from "@/components/formElements/FormInput";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { type PostCallData, apiPostCall } from "@/helper/apiService";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type AddLeadDTO, AddLeadSchema, emptyLead } from "../leadSchema";
import FormTextarea from "@/components/formElements/FormTextarea";
import FormInputDate from "@/components/formElements/FormInputDate";
import {
  SheetFooter,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Sheet,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}
function LeadForm({ isOpen, onClose }: ReferralModalProps) {
  const { showToast } = useToast();

  const form = useForm<AddLeadDTO>({
    resolver: zodResolver(AddLeadSchema),
    defaultValues: emptyLead,
  });

  const onSubmit: SubmitHandler<AddLeadDTO> = async (formdata) => {
    console.log("formData", formdata);

    try {
      console.log("this is Target form data", formdata);
      const formData = {
        Status: "Agent",
        ...formdata,
      };

      const submitData: PostCallData & {
        userName?: string | undefined | null;
      } = {
        ...formData,
        endpoint: "lead_add",
      };

      const response = await apiPostCall(submitData);
      console.log("this is response from lead add", response);

      // console.log("this is target form data response", response);

      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "Target Added Successfully"
        );
        // onclose(false);
        onClose();
      } else {
        showToast(
          response?.data.code,
          response?.data.message,
          "Target Addition Failed"
        );
      }
    } catch (error) {
      console.error("Error submitting Target form:", error);
    } finally {
      console.log("Target Craeted");
      
    }
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose} >
      {/* <SheetTrigger className="cursor-pointer whitespace-nowrap  text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary  hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 flex justify-center items-center gap-2 border border-transparent rounded-md shadow-sm text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium">
				<Plus color="#fff" size={18} />
				<span>Add Lead</span>
			</SheetTrigger> */}

      <SheetContent className="!w-full sm:!max-w-[600px] gap-1">
        <SheetHeader className="sticky top-0 border-b">
          <SheetTitle>Add New Lead</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-1 md:px-4 py-2 flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-wrap gap-y-4">
                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="nameOfProspect"
                    type="text"
                    placeholder="Name of Prospect"
                    label="Name of Prospect"
                  />
                </div>

                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="Address"
                    type="text"
                    placeholder="Prospect Address"
                    label="Prospect Address"
                  />
                </div>

                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="MobileNumber"
                    type="text"
                    placeholder="Prospect Contact Number"
                    label="Prospect Contact Number"
                  />
                </div>

                <div className="w-[100%] px-2">
                  <FormTextarea
                    form={form}
                    name="purposeOfVisit"
                    placeholder="Purpose of Visit"
                    label="Purpose of Visit"
                  />
                </div>

                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="Duration"
                    type="text"
                    placeholder="Duration of Meeting"
                    label="Duration of Meeting"
                  />
                </div>

                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="KeyPoints"
                    type="text"
                    placeholder="Key Discussion Points"
                    label="Key Discussion Points"
                  />
                </div>

                <div className="w-[100%] px-2">
                  <FormTextarea
                    form={form}
                    name="Remarks"
                    placeholder="Feedback by Prospect on Product/Service"
                    label="Feedback by Prospect on Product/Service"
                  />
                </div>

                <div className="w-full md:w-[50%]  px-2">
                  <FormInputDate
                    form={form}
                    name="NextMeetingDate"
                    placeholder="Next Meeting Schedule"
                    label="Next Meeting Schedule"
                    futureDate={true}
                  />
                </div>
                {/* <div className="h-4"/> */}
              </div>
              <SheetFooter className="sticky bottom-0 mt-5 border-t flex-row items-center justify-between bg-white">
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
                <Button type="submit">
                  {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default LeadForm;
