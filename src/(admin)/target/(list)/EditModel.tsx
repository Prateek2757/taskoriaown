import { zodResolver } from '@hookform/resolvers/zod';
import type { Dispatch, SetStateAction } from 'react';
import {  type SubmitHandler, useForm } from 'react-hook-form';
import FormInput from '@/components/formElements/FormInput';
import FormTextarea from '@/components/formElements/FormTextarea';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/components/uiComponents/custom-toast/custom-toast';
import { SYSTEM_CONSTANTS } from '@/constants/staticConstant';
import { apiPostCall, type PostCallData } from '@/helper/apiService';
import { type AddTargetDTO, AddTargetSchema, emptyTarget } from '../targetSchema';

type ViewModalProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function EditModel({ open, setOpen }: ViewModalProps) {
    const { showToast } = useToast();

    const form = useForm<AddTargetDTO>({
        resolver: zodResolver(AddTargetSchema),
        defaultValues: emptyTarget,
    });

    

    const onSubmit: SubmitHandler<AddTargetDTO> = async (formData) => {
        console.log('formData', formData);

        try {
            console.log('this is Target form data', formData);

            const submitData: PostCallData & {
                userName?: string | undefined | null;
            } = {
                ...formData,
                endpoint: 'target_add',
            };
            console.log('this is target form data payload', submitData);

            const response = await apiPostCall(submitData);

            console.log('this is target form data response', response.data);

            if (
                response &&
                response.data.code === SYSTEM_CONSTANTS.success_code
            ) {
                showToast(
                    response.data.code,
                    response.data.message,
                    'Target Added Successfully',
                );
                window.location.reload();
            } else {
                console.log('this is target form data response error code of the form', response.data.message);
                showToast(
                    response?.data.code,
                    response?.data.message,
                    'Target Addition Failed',
                );
            }
        } catch (error) {
            console.error('Error submitting Target form:', error);
        } finally {
            console.log('Target Craeted');
        }
    };
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="w-full sm:!max-w-[600px] sm:w-[540px] gap-1">
                <SheetHeader className="sticky top-0 border-b">
                    <SheetTitle>Edit Target</SheetTitle>
                </SheetHeader>
                <Form {...form}>
                <form className='min-h-[100vh]' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-wrap overflow-y-auto px-4 py-2 flex-1 gap-y-4">
                        <div className="w-[50%] px-2">
                            <FormInput
                                form={form}
                                name="noOfNewAgent"
                                    type="number"
                                    
                                placeholder="No of New Agent"
                                label="No of New Agent"
                            />
                        </div>
                        <div className="w-[50%] px-2">
                            <FormInput
                                form={form}
                                name="fpiPolicyCount"
                                type="number"
                                placeholder="FPI Policy Count"
                                label="FPI Policy Count"
                            />
                        </div>
                        <div className="w-[50%] px-2">
                            <FormInput
                                form={form}
                                name="fpiPremium"
                                type="number"
                                placeholder="FPI Premium"
                                label="FPI Premium"
                            />
                        </div>
                        <div className="w-[50%] px-2">
                            <FormInput
                                form={form}
                                name="termPolicyCount"
                                type="number"
                                placeholder="Term Policy Count"
                                label="Term Policy Count"
                            />
                        </div>
                        <div className="w-[50%] px-2">
                            <FormInput
                                form={form}
                                name="termPremium"
                                type="number"
                                placeholder="Term Premium"
                                label="Term Premium"
                            />
                        </div>
                        <div className="w-[50%] px-2">
                            <FormInput
                                form={form}
                                name="termPolicyCountIndividual"
                                type="number"
                                placeholder="Term Policy Count Individual"
                                label="Term Policy Count Individual"
                            />
                        </div>
                        <div className="w-[50%] px-2">
                            <FormInput
                                form={form}
                                name="termPremiumIndividual"
                                type="number"
                                placeholder="Term Premium Individual"
                                label="Term Premium Individual"
                            />
                        </div>
                        <div className="w-[50%] px-2">
                            <FormInput
                                form={form}
                                name="rpiPolicyCount"
                                type="number"
                                placeholder="RPI Policy Count"
                                label="RPI Policy Count"
                            />
                        </div>
                        <div className="w-[50%] px-2">
                            <FormInput
                                form={form}
                                name="rpiPremium"
                                type="number"
                                placeholder="RPI Premium"
                                label="RPI Premium"
                            />
                        </div>
                        <div className="w-[50%] px-2">
                            <FormInput
                                form={form}
                                name="noOfMmCreation"
                                type="number"
                                placeholder="No of MM Creation"
                                label="No of MM Creation"
                            />
                        </div>
                        <div className="w-[50%] px-2">
                            <FormInput
                                form={form}
                                name="noOfClubAchiever"
                                type="number"
                                placeholder="No of Club Achiever"
                                label="No of Club Achiever"
                            />
                        </div>
                        <div className="w-[50%] px-2">
                            <FormInput
                                form={form}
                                name="mouWithCooperatives"
                                type="number"
                                placeholder="MOU with Cooperatives"
                                label="MOU with Cooperatives"
                            />
                        </div>
                        <div className="w-[100%] px-2">
                            <FormTextarea
                                form={form}
                                name="remarks"
                                placeholder="Remarks"
                                label="Remarks"
                            />
                        </div>
                    </div>
                    <SheetFooter className="sticky bottom-0 border-t flex-row items-center justify-between">
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                            <Button type="submit"> {form.formState.isSubmitting ? 'Saving...' : 'Save changes'}</Button>
                        </SheetFooter>
                </form>
            </Form>
            </SheetContent>
        </Sheet>
    );
}

