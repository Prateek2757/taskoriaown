'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TemplateSetup from './TemplateSetup';
import { AddemailSmsDTO, AddemailSmsSchema, emptyemailSms } from '../schemas/emailSmsSchemas';

export default function TemplateForm() {
  const form = useForm<AddemailSmsDTO>({
    resolver: zodResolver(AddemailSmsSchema),
    defaultValues: emptyemailSms,
  });

  const onSubmit = (data: AddemailSmsDTO) => {
    console.log("Submitted Template:", data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <TemplateSetup form={form} />
      </form>
    </FormProvider>
  );
}
