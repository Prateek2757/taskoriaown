'use client';

import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import FormSelect from '@/components/formElements/FormSelect';
import FormInputFile from '@/components/formElements/FormInputFile';
import { FormSwitch } from '@/components/formElements/FormSwitch';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FileDown } from 'lucide-react';

type ClaimFormFields = {
  policyNo: string;
  requestedBranch: string;
  claimType: string;
  citizenship?: FileList;
  policyPaper?: FileList;
  claimApplication?: FileList;
  hasLoan: boolean;
  hasDocument: boolean;
  isSignatureVerified: boolean;
};

export default function ClaimForm() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const form = useForm<ClaimFormFields>({
    defaultValues: {
      policyNo: '',
      requestedBranch: '',
      claimType: '',
      hasLoan: false,
      hasDocument: false,
      isSignatureVerified: false,
    },
  });

  const { handleSubmit, watch, setValue } = form;

      const claimTypes = [
        { value: 'maturity', text: 'Maturity' },
        { value: 'anticipation', text: 'Anticipation' },
      ];

      const onSubmit = (data: ClaimFormFields) => {
        console.log('Form Submitted:', data);
      };

      const onInvalid = (errors: any) => {
        const errorMessages: string[] = [];

        Object.entries(errors).forEach(([key, value]) => {
          if (value?.message) {
            errorMessages.push(`${key}: ${value.message}`);
          }
        });

        setValidationErrors(errorMessages);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

  return (
    <>
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {validationErrors.map((err, idx) => (
                  <li key={`err-${idx}`}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
            
            <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Claim Details</h2>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={'outline'}
                  onClick={() => {
                    setValue('claimType', 'maturity');
                    window.open('/files/anticipation-application.pdf', '_blank');
                  }}
                >
                  <FileDown />
                  Anticipation Application
                </Button>

                <Button
                  type="button"
                  variant={'outline'}
                  onClick={() => {
                    setValue('claimType', 'maturity');
                    window.open('/files/maturity-application.pdf', '_blank');
                  }}
                
                >
                  <FileDown />
                  Maturity Application
                </Button>
              </div>
            </div>

            <div className="mb-6 border border-dashed border-blue-200 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormSelect
                form={form}
                name="policyNo"
                type="text"
                caption="Enter Policy No"
                label="Policy No"
                required
              />
              <FormSelect
                form={form}
                name="requestedBranch"
                type="text"
                caption="Enter Branch"
                label="Requested Branch"
                required
              />
              <FormSelect
                form={form}
                name="claimType"
                label="Claim Type"
                options={claimTypes}
                caption="Please Select Claim Type"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInputFile form={form} name="citizenship" label="Citizenship" />
              <FormInputFile form={form} name="policyPaper" label="Policy Paper" />
              <FormInputFile form={form} name="claimApplication" label="Claim Application" />
            </div>
          </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-4">Update Claim Details</h2>
          <div className="mb-6 border border-dashed border-blue-200 p-4 rounded-md">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSwitch form={form} name="hasLoan" label="Has Loan?" />
              <FormSwitch form={form} name="hasDocument" label="Has Document?" />
              <FormSwitch form={form} name="isSignatureVerified" label="Is Signature Verified?" />
            </div>
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md"
          >
            Submit 
          </Button>
        </form>
      </Form>
    </>
  );
}
