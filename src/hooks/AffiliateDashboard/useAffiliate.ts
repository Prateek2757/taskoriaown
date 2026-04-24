import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  bankDetailsSchema,
  taxInfoSchema,
  withdrawSchema,
  type BankDetailsDTO,
  type BankDetailsFormValues,
  type EarningsSummary,
  type PayoutRecord,
  type TaxInfoFormValues,
  type WithdrawFormValues,
} from '../../types/afffiliate';
import { uploadToSupabase } from '@/lib/uploadFileToSupabase';

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res  = await fetch(url, init);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? `Request failed (${res.status})`);
  return data as T;
}


function useEarnings() {
  const [data, setData]       = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const result = await apiFetch<EarningsSummary>('/api/affiliate/earnings');
      setData(result);
    } catch (e: any) {
      const msg = e.message ?? 'Failed to load earnings';
      setError(msg);
      if (!silent) toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, error, refetch: fetch };
}

function useBankAndTax() {
  const [dto, setDto]             = useState<BankDetailsDTO | null>(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);

  const bankForm = useForm<BankDetailsFormValues>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: { account_name: '', bank_name: '', bsb: '', account_number: '' },
    mode: 'onBlur',
  });

  const taxForm = useForm<TaxInfoFormValues>({
    resolver: zodResolver(taxInfoSchema),
    defaultValues: { abn: '' },
    mode: 'onBlur',
  });

  const populate = useCallback((d: BankDetailsDTO | null) => {
    if (!d) return;
    bankForm.reset({
      account_name:   d.account_name   ?? '',
      bank_name:      d.bank_name      ?? '',
      bsb:            d.bsb            ?? '',
      account_number: d.account_number ?? '',
    });
    taxForm.reset({ abn: d.abn ?? '' });
  }, [bankForm, taxForm]);

  const fetchDetails = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await apiFetch<BankDetailsDTO | null>('/api/affiliate/bank-details');
      setDto(result);
      populate(result);
    } catch (e: any) {
      if (!silent) toast.error(e.message ?? 'Failed to load bank details');
    } finally {
      setLoading(false);
    }
  }, [populate]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const upsert = useCallback(async (payload: Record<string, unknown>) => {
    return apiFetch('/api/affiliate/bank-details', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
  }, []);

  const saveBankDetails = useCallback(async (values: BankDetailsFormValues) => {
    setSaving(true);
    try {
      await upsert({
        accountName:   values.account_name,
        bankName:      values.bank_name,
        bsb:           values.bsb,
        accountNumber: values.account_number,
        abn:           taxForm.getValues('abn'),
      });
      toast.success('Bank details saved!');
      bankForm.reset(values);
      fetchDetails(true);
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to save bank details');
    } finally {
      setSaving(false);
    }
  }, [upsert, taxForm, bankForm, fetchDetails]);

  const saveTaxInfo = useCallback(async (values: TaxInfoFormValues) => {
    setSaving(true);
    try {
      const bv = bankForm.getValues();
      await upsert({
        accountName:   bv.account_name,
        bankName:      bv.bank_name,
        bsb:           bv.bsb,
        accountNumber: bv.account_number,
        abn:           values.abn,
      });
      toast.success('Tax information saved!');
      taxForm.reset(values);
      fetchDetails(true);
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to save tax information');
    } finally {
      setSaving(false);
    }
  }, [upsert, bankForm, taxForm, fetchDetails]);

  const uploadTaxFile = useCallback(async (file: File) => {
    const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!ALLOWED.includes(file.type)) { toast.error('Only PDF, JPG, or PNG files are accepted'); return; }
    if (file.size > 5 * 1024 * 1024)  { toast.error('File must be under 5 MB'); return; }

    setUploading(true);
    try {
      const publicUrl = await uploadToSupabase(file, 'taxaffiliatefile');
      const bv = bankForm.getValues();
      await upsert({
        accountName:   bv.account_name,
        bankName:      bv.bank_name,
        bsb:           bv.bsb,
        accountNumber: bv.account_number,
        abn:           taxForm.getValues('abn'),
        taxFileUrl:    publicUrl,
        taxFileName:   file.name,
      });
      toast.success('Tax declaration uploaded!');
      fetchDetails(true);
    } catch (e: any) {
      toast.error(e.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [upsert, bankForm, taxForm, fetchDetails]);

  return {
    dto, loading, saving, uploading,
    bankForm, taxForm,
    saveBankDetails, saveTaxInfo, uploadTaxFile,
    refetch: fetchDetails,
  };
}

function usePayoutHistory() {
  const [data, setData]       = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchedOnce           = useRef(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiFetch<PayoutRecord[]>('/api/affiliate/withdraw');
      setData(result);
      fetchedOnce.current = true;
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to load payout history');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOnce = useCallback(() => {
    if (!fetchedOnce.current) fetch();
  }, [fetch]);

  return { data, loading, fetch, fetchOnce };
}

function useWithdraw(approvedBalance: number, threshold: number, onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);

  const schema = useMemo(
    () => withdrawSchema(approvedBalance, threshold),
    [approvedBalance, threshold],
  );

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (form.formState.isDirty) form.trigger('amount');
  }, [approvedBalance, form]);

  const submit = useCallback(async (values: WithdrawFormValues) => {
    setLoading(true);
    try {
      await apiFetch('/api/affiliate/withdraw', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ amount: Number(values.amount) }),
      });
      toast.success('Withdrawal request submitted!');
      form.reset();
      setOpen(false);
      onSuccess();
    } catch (e: any) {
      form.setError('amount', { message: e.message ?? 'Withdrawal failed' });
    } finally {
      setLoading(false);
    }
  }, [form, onSuccess]);

  return { form, loading, open, setOpen, submit };
}

export function useAffiliate() {
  const earnings   = useEarnings();
  const bankAndTax = useBankAndTax();
  const history    = usePayoutHistory();

  const approved  = earnings.data?.approved        ?? 0;
  const threshold = earnings.data?.payoutThreshold ?? 100;

  const afterWithdraw = useCallback(() => {
    earnings.refetch(true);
    history.fetch();
  }, [earnings, history]);

  const withdraw = useWithdraw(approved, threshold, afterWithdraw);

  const canWithdraw =
    approved >= threshold &&
    earnings.data?.affiliateStatus === 'active';

  return {
    earnings: {
      data:    earnings.data,
      loading: earnings.loading,
      error:   earnings.error,
      refetch: earnings.refetch,
    },
    bankForm: {
      form:     bankAndTax.bankForm,
      dto:      bankAndTax.dto,
      loading:  bankAndTax.loading,
      saving:   bankAndTax.saving,
      onSubmit: bankAndTax.bankForm.handleSubmit(bankAndTax.saveBankDetails),
    },
    taxForm: {
      form:          bankAndTax.taxForm,
      dto:           bankAndTax.dto,
      loading:       bankAndTax.loading,
      saving:        bankAndTax.saving,
      uploading:     bankAndTax.uploading,
      onSubmit:      bankAndTax.taxForm.handleSubmit(bankAndTax.saveTaxInfo),
      uploadTaxFile: bankAndTax.uploadTaxFile,
    },
    withdraw: {
      form:       withdraw.form,
      loading:    withdraw.loading,
      open:       withdraw.open,
      setOpen:    withdraw.setOpen,
      onSubmit:   withdraw.form.handleSubmit(withdraw.submit),
      canWithdraw,
    },
    history: {
      data:      history.data,
      loading:   history.loading,
      fetch:     history.fetch,
      fetchOnce: history.fetchOnce,
    },
  };
}

export type AffiliateHook = ReturnType<typeof useAffiliate>;