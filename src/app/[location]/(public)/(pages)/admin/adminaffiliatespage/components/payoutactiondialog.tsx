'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  Building2,
  AlertTriangle,
  ExternalLink,
  Receipt,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Payout {
  payout_id:    string;
  user_id:      number;
  amount:       number;
  status:       'pending' | 'processing' | 'paid' | 'rejected';
  requested_at: string;
  bank_snapshot?: {
    account_name?:   string;
    bank_name?:      string;
    bsb?:            string;
    account_number?: string;
    abn?:            string;
  };
  email?:        string;
  display_name?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number | string) {
  return Number(n).toLocaleString('en-AU', { minimumFractionDigits: 2 });
}
function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label ?? 'Value'} copied`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-2 p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 transition-colors flex-shrink-0 touch-manipulation"
      aria-label={`Copy ${label ?? 'value'}`}
    >
      {copied
        ? <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
        : <Copy className="w-4 h-4" />}
    </button>
  );
}

// ─── Bank detail row ──────────────────────────────────────────────────────────

function BankRow({
  label,
  value,
  mono = false,
  copyLabel,
}: {
  label:      string;
  value:      string;
  mono?:      boolean;
  copyLabel?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-3 border-b border-blue-100 dark:border-blue-900/40 last:border-0 gap-3">
      <span className="text-sm text-blue-600 dark:text-blue-400 flex-shrink-0 w-28">{label}</span>
      <div className="flex items-center gap-1 flex-1 justify-end min-w-0">
        <span
          className={`text-sm font-semibold text-slate-900 dark:text-slate-100 truncate ${
            mono ? 'font-mono' : ''
          }`}
        >
          {value}
        </span>
        <CopyButton value={value} label={copyLabel ?? label} />
      </div>
    </div>
  );
}

// ─── Main dialog ──────────────────────────────────────────────────────────────

export function PayoutActionDialog({
  payout,
  onClose,
  onSuccess,
}: {
  payout:    Payout;
  onClose:   () => void;
  onSuccess: () => void;
}) {
  const [txRef, setTxRef]     = useState('');
  const [loading, setLoading] = useState(false);
  const [action, setAction]   = useState<string | null>(null);
  const [step, setStep]       = useState<'review' | 'confirm'>('review');

  const bank           = payout.bank_snapshot;
  const hasBankDetails = !!(bank?.account_number && bank?.bsb);

  const submit = async (act: 'paid' | 'rejected' | 'processing') => {
    setAction(act);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/affiliates/payouts/${payout.payout_id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          action:    act,
          adminNote: txRef
            ? `Bank transfer ref: ${txRef}`
            : act === 'rejected'
            ? 'Rejected by admin'
            : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(
        act === 'paid'
          ? `$${fmt(payout.amount)} marked as paid ✓`
          : act === 'processing'
          ? 'Set to processing'
          : 'Payout rejected'
      );
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e.message ?? 'Action failed');
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  // ── Step 1 — Review ────────────────────────────────────────────────────────
  if (step === 'review') {
    return (
      <DialogContent
        className={[
          'w-full max-w-lg',
          'max-h-[90dvh] sm:max-h-[85vh]',
          'flex flex-col',
          'p-0 gap-0',
          'rounded-t-2xl sm:rounded-2xl',
          // Dialog surface
          'bg-white dark:bg-slate-900',
          'border-0 dark:border dark:border-slate-700/60',
        ].join(' ')}
      >
        {/* ── Fixed header ── */}
        <DialogHeader className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="flex items-center gap-2 text-base text-slate-900 dark:text-slate-100">
            <Building2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            Process Payout
          </DialogTitle>
        </DialogHeader>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4">

          {/* Affiliate + amount summary */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2.5 text-sm">
            <div className="flex items-start justify-between gap-2">
              <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">Affiliate</span>
              <div className="text-right min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {payout.display_name ?? 'Unnamed'}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{payout.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">Requested</span>
              <span className="text-slate-700 dark:text-slate-300">{fmtDate(payout.requested_at)}</span>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-700 pt-2.5">
              <span className="text-slate-600 dark:text-slate-300 font-medium flex-shrink-0">Amount</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ${fmt(payout.amount)}
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">AUD</span>
              </span>
            </div>
          </div>

          {/* Bank details */}
          {hasBankDetails ? (
            <div className="rounded-xl border border-blue-200 dark:border-blue-800/60 overflow-hidden">
              {/* Bank header bar */}
              <div className="bg-blue-600 dark:bg-blue-700 px-4 py-3 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  Transfer to this account
                </p>
                <Badge className="bg-white/20 text-white border-0 text-xs flex-shrink-0">
                  Manual
                </Badge>
              </div>
              {/* Bank rows */}
              <div className="px-4 bg-blue-50 dark:bg-blue-950/30">
                <BankRow label="Account Name" value={bank?.account_name  ?? ''} copyLabel="account name" />
                <BankRow label="Bank"         value={bank?.bank_name     ?? ''} />
                <BankRow label="BSB"          value={bank?.bsb           ?? ''} mono copyLabel="BSB" />
                <BankRow label="Account No."  value={bank?.account_number ?? ''} mono copyLabel="account number" />
                {bank?.abn && (
                  <BankRow label="ABN" value={bank.abn} copyLabel="ABN" />
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-start gap-3 border border-amber-100 dark:border-amber-800/40">
              <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  No bank details on file
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Contact this affiliate to add their bank details before processing.
                </p>
              </div>
            </div>
          )}

          {/* Bank portal quick-links */}
          {hasBankDetails && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Open your bank to transfer
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'CommBank', url: 'https://www.commbank.com.au/digital-banking.html' },
                  { name: 'ANZ',      url: 'https://www.anz.com.au/ways-to-bank/online-banking/' },
                  { name: 'NAB',      url: 'https://www.nab.com.au/personal/online-banking/' },
                  { name: 'Westpac',  url: 'https://www.westpac.com.au/personal-banking/online-banking/' },
                ].map((b) => (
                  <a
                    key={b.name}
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors touch-manipulation"
                  >
                    {b.name}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ── Fixed footer ── */}
        <div
          className={[
            'flex-shrink-0 px-5 py-4',
            'border-t border-slate-100 dark:border-slate-800',
            'bg-white dark:bg-slate-900',
            'flex flex-col sm:flex-row gap-2',
            'pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4',
          ].join(' ')}
        >
          {payout.status !== 'processing' && (
            <Button
              variant="outline"
              className="w-full sm:w-auto border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              onClick={() => submit('processing')}
              disabled={loading}
            >
              {loading && action === 'processing'
                ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                : <ArrowRight className="w-4 h-4 mr-2" />}
              Mark Processing
            </Button>
          )}

          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 active:bg-green-800 text-white touch-manipulation"
            onClick={() => hasBankDetails ? setStep('confirm') : submit('paid')}
            disabled={loading || !hasBankDetails}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            I've Transferred →
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 active:bg-red-100 dark:active:bg-red-900/50"
            onClick={() => submit('rejected')}
            disabled={loading}
          >
            {loading && action === 'rejected'
              ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
              : <XCircle className="w-4 h-4 mr-2" />}
            Reject
          </Button>
        </div>
      </DialogContent>
    );
  }

  // ── Step 2 — Confirm + reference number ────────────────────────────────────
  return (
    <DialogContent
      className={[
        'w-full max-w-md',
        'max-h-[90dvh] sm:max-h-[85vh]',
        'flex flex-col',
        'p-0 gap-0',
        'rounded-t-2xl sm:rounded-2xl',
        'bg-white dark:bg-slate-900',
        'border-0 dark:border dark:border-slate-700/60',
      ].join(' ')}
    >
      {/* Fixed header */}
      <DialogHeader className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <DialogTitle className="flex items-center gap-2 text-base text-slate-900 dark:text-slate-100">
          <Receipt className="w-5 h-5 text-green-600 dark:text-green-400" />
          Confirm Transfer
        </DialogTitle>
      </DialogHeader>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4">

        {/* Confirmation summary */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl space-y-2.5 text-sm border border-green-100 dark:border-green-800/40">
          <p className="text-sm font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Confirm you've transferred:
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-green-700 dark:text-green-400 flex-shrink-0">Amount</span>
            <span className="text-xl font-bold text-green-900 dark:text-green-200">
              ${fmt(payout.amount)} AUD
            </span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-green-700 dark:text-green-400 flex-shrink-0">To</span>
            <span className="font-medium text-right text-slate-800 dark:text-slate-200">
              {bank?.account_name}
            </span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-green-700 dark:text-green-400 flex-shrink-0">BSB / Account</span>
            <span className="font-mono font-medium text-right text-slate-800 dark:text-slate-200">
              {bank?.bsb} / {bank?.account_number}
            </span>
          </div>
        </div>

        {/* Transaction reference */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Transaction Reference
            <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">(recommended)</span>
          </label>
          <Input
            value={txRef}
            onChange={(e) => setTxRef(e.target.value)}
            placeholder="e.g. CBA ref #TXN-20240421-9832"
            autoFocus
            className="text-base bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Saved as the payment record so the affiliate can verify with their bank.
          </p>
        </div>

      </div>

      {/* Fixed footer */}
      <div
        className={[
          'flex-shrink-0 px-5 py-4',
          'border-t border-slate-100 dark:border-slate-800',
          'bg-white dark:bg-slate-900',
          'flex flex-col sm:flex-row gap-2',
          'pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4',
        ].join(' ')}
      >
        <Button
          variant="outline"
          className="w-full sm:w-auto border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => setStep('review')}
          disabled={loading}
        >
          ← Back
        </Button>
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 active:bg-green-800 text-white touch-manipulation"
          onClick={() => submit('paid')}
          disabled={loading}
        >
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
            : <CheckCircle className="w-4 h-4 mr-2" />}
          Confirm & Mark Paid
        </Button>
      </div>
    </DialogContent>
  );
}