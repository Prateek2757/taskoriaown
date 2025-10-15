'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import ClaimForm from '../ManageClaimDetails';
// import ClaimForm from '@/components/claims/ClaimForm';

type ClaimFormFields = {
  policyNo: string;
  requestedBranch: string;
  claimType: string;
  
};

export default function AddClaimPage() {
  const form = useForm<ClaimFormFields>({
    defaultValues: {
      policyNo: '',
      requestedBranch: '',
      claimType: '',
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log('Submitted data:', data);
    
  });

  return (
    <div className="mx-1 my-4">

      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <ClaimForm />
        </form>
      </FormProvider>
    </div>
  );
}
