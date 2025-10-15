import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from "react-hook-form";
import { type AddTargetDTO, AddTargetSchema, emptyTarget } from "@/app/(admin)/target/targetSchema";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";


export const UseAddTarget = ({onClose}:{onClose: () => void;}) => {
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
                // window.location.reload();
                onClose();
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
    const { showToast } = useToast();

    const form = useForm<AddTargetDTO>({
        resolver: zodResolver(AddTargetSchema),
        defaultValues: emptyTarget,
    });

  return {
    onSubmit,
    form
  };
}
