"use client";
import FormInput from "@/components/formElements/FormInput";
import FormTextarea from "@/components/formElements/FormTextarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UseAddTarget } from "@/hooks/Admin/Target/UseAddTarget";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}
function DailyTargetForm({ isOpen, onClose }: ReferralModalProps) {
  const { form, onSubmit } = UseAddTarget({ onClose });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="!w-full sm:!max-w-[600px] gap-1">
        <SheetHeader className="sticky top-0 border-b">
          <SheetTitle>Add Target</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-1 md:px-4 py-2 flex-1">
          <Form {...form}>
            <form
              className="min-h-[100vh]"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-wrap overflow-y-auto py-2 flex-1 gap-y-4">
                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="NoOfNewAgent"
                    type="number"
                    placeholder="No of New Agent"
                    label="No of New Agent"
                  />
                </div>
                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="FPIPolicyCount"
                    type="number"
                    placeholder="FPI Policy Count"
                    label="FPI Policy Count"
                  />
                </div>
                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="FPIPreimum"
                    type="number"
                    placeholder="FPI Premium"
                    label="FPI Premium"
                  />
                </div>
                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="TermPolicyCount"
                    type="number"
                    placeholder="Term Policy Count"
                    label="Term Policy Count"
                  />
                </div>
                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="TermPreimum"
                    type="number"
                    placeholder="Term Premium"
                    label="Term Premium"
                  />
                </div>
                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="TermPolicyCountIndividual"
                    type="number"
                    placeholder="Term Policy Count Individual"
                    label="Term Policy Count Individual"
                  />
                </div>
                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="TermPreimumIndividual"
                    type="number"
                    placeholder="Term Premium Individual"
                    label="Term Premium Individual"
                  />
                </div>
                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="RPIPolicyCount"
                    type="number"
                    placeholder="RPI Policy Count"
                    label="RPI Policy Count"
                  />
                </div>
                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="RPIPreimum"
                    type="number"
                    placeholder="RPI Premium"
                    label="RPI Premium"
                  />
                </div>
                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="NoOfAMCreation"
                    type="number"
                    placeholder="No of MM Creation"
                    label="No of MM Creation"
                  />
                </div>
                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="NoOfClubAchiever"
                    type="number"
                    placeholder="No of Club Achiever"
                    label="No of Club Achiever"
                  />
                </div>
                <div className="w-full md:w-[50%] px-2">
                  <FormInput
                    form={form}
                    name="MOUWithCooperatives"
                    type="number"
                    placeholder="MOU with Cooperatives"
                    label="MOU with Cooperatives"
                  />
                </div>
                <div className="w-[100%] px-2">
                  <FormTextarea
                    form={form}
                    name="Remarks"
                    placeholder="Remarks"
                    label="Remarks"
                  />
                </div>
              </div>
              <SheetFooter className="sticky bottom-0 border-t flex-row items-center justify-between bg-white">
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
                <Button type="submit" className="cursor-pointer">
                  {" "}
                  {form.formState.isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DailyTargetForm;
