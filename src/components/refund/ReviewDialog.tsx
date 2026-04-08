"use client";

import { useState, useEffect, useRef } from "react";

import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { StatusBadge } from "./StatusBadge";
import { TypeBadge } from "./TypeBadge";
import { Spinner } from "./spinner";
import {
  REASON_LABELS,
  TOPIC_LABELS,
  type RefundRequest,
  type WalletCheckResponse,
} from "@/types/refunds";
import { decodeHtml, fmtDate } from "./refund-utils";

interface ReviewDialogProps {
  request: RefundRequest | null;
  open: boolean;
  onClose: () => void;
  onAction: (
    id: number,
    status: "approved" | "rejected",
    note: string,
    creditAmount?: number
  ) => Promise<void>;
}

type WalletState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "found"; currentCredits: number; userId: number }
  | { status: "not_found" }
  | { status: "error"; message: string };

const labelCls =
  "text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1 block";
const valueCls = "text-sm text-zinc-800 dark:text-zinc-200";
const inputCls =
  "w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6] focus:border-transparent resize-none transition-all";

export function ReviewDialog({
  request,
  open,
  onClose,
  onAction,
}: ReviewDialogProps) {
  const [note, setNote] = useState("");
  const [creditAmount, setCreditAmount] = useState<number | "">("");
  const [walletState, setWalletState] = useState<WalletState>({
    status: "idle",
  });
  const [loading, setLoading] = useState<"approved" | "rejected" | null>(null);
  const amountRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open && request) {
      setNote(request.admin_note ?? "");
      setCreditAmount("");
      setWalletState({ status: "idle" });
    }
  }, [open, request]);

  if (!request) return null;

  const isCreditReturn = request.issue_type === "credit_return";
  const isPending = request.status === "pending";

  const isAmountValid = creditAmount !== "" && Number(creditAmount) > 0;

  const canApprove =
    isPending &&
    (!isCreditReturn || (walletState.status === "found" && isAmountValid));

  const checkWallet = async () => {
    setWalletState({ status: "checking" });
    try {
      const res = await axios.get<WalletCheckResponse>(
        `/api/admin/refunds/refund-creditwallet-check?email=${encodeURIComponent(request.email)}`
      );
      if (res.data.success && res.data.hasWallet) {
        setWalletState({
          status: "found",
          currentCredits: res.data.currentCredits!,
          userId: res.data.userId!,
        });
      
        // ✅ auto focus
        setTimeout(() => {
          amountRef.current?.focus();
        }, 100);
      } else {
        setWalletState({ status: "not_found" });
      }
    } catch {
      setWalletState({ status: "error", message: "Failed to check wallet." });
    }
  };

  const handleAction = async (status: "approved" | "rejected") => {
    if (status === "approved" && !canApprove) return;
  
    setLoading(status);
  
    const credits =
      isCreditReturn &&
      status === "approved" &&
      walletState.status === "found" &&
      isAmountValid
        ? Number(creditAmount)
        : undefined;
  
    await onAction(request.id, status, note, credits);
    setLoading(null);
  };

  const handleEmailOpen = () => {
    window.location.href = `mailto:${request.email}?subject=Re: Your Refund Request #${request.id}`;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <TypeBadge type={request.issue_type} />
            <StatusBadge status={request.status} />
          </div>
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Request #{request.id}
          </DialogTitle>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            Submitted {fmtDate(request.created_at)}
          </p>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={labelCls}>Requester</span>
              <p className={`${valueCls} font-medium`}>{request.email}</p>
            </div>
            {/* <button
              onClick={handleEmailOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2563EB] dark:text-[#3B82F6] bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors shrink-0"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Send Email
            </button> */}
          </div>

          {isCreditReturn && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className={labelCls}>Lead Name</span>
                <p className={valueCls}>{request.lead_name ?? "—"}</p>
              </div>
              <div>
                <span className={labelCls}>Lead Email</span>
                <p className={valueCls}>{request.lead_email ?? "—"}</p>
              </div>
              <div className="col-span-2">
                <span className={labelCls}>Reason</span>
                <p className={valueCls}>
                  {request.reason
                    ? (REASON_LABELS[request.reason] ?? request.reason)
                    : "—"}
                </p>
              </div>
            </div>
          )}

          {!isCreditReturn && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className={labelCls}>Topic</span>
                <p className={valueCls}>
                  {request.support_topic
                    ? (TOPIC_LABELS[request.support_topic] ??
                      request.support_topic)
                    : "—"}
                </p>
              </div>
              <div>
                <span className={labelCls}>Subject</span>
                <p className={valueCls}>{request.subject ?? "—"}</p>
              </div>
            </div>
          )}

          <div>
            <span className={labelCls}>Description</span>
            <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {decodeHtml(request.description)}
            </div>
          </div>

          {isCreditReturn && isPending && (
            <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-900/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-0.5">
                    💳 Credit Refund
                  </p>
                  <p className="text-xs  text-zinc-500 dark:text-zinc-400">
                    Check wallet first, then enter the amount to refund on
                    approval.
                  </p>
                </div>
                <button
                  onClick={checkWallet}
                  disabled={walletState.status === "checking"}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors shrink-0"
                >
                  {walletState.status === "checking" ? (
                    <>
                      <Spinner className="w-3 h-3" /> Checking…
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Check Wallet
                    </>
                  )}
                </button>
              </div>

              {walletState.status === "found" && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  Wallet found · Current balance:{" "}
                  <strong>{walletState.currentCredits} credits</strong>
                </div>
              )}
              {walletState.status === "not_found" && (
                <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  No wallet found for this user. Credits cannot be added.
                </div>
              )}
              {walletState.status === "error" && (
                <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {walletState.message}
                </div>
              )}

              {walletState.status === "found" && (
                <div>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">
                    Credits to refund
                  </label>
                  <input
                    ref={amountRef}
                    type="number"
                    min={1}
                    value={creditAmount}
                    onChange={(e) => {
                      const val = e.target.value;

                      if (val === "" || Number(val) > 0) {
                        setCreditAmount(val === "" ? "" : Number(val));
                      }
                    }}
                    placeholder="e.g. 5"
                    className={`w-full bg-white dark:bg-zinc-800 border rounded-xl px-4 py-2.5 text-sm
    ${
      !isAmountValid && walletState.status === "found"
        ? "border-red-300 focus:ring-red-500"
        : "border-zinc-200 dark:border-zinc-700 focus:ring-[#2563EB]"
    }
    text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400
    focus:outline-none focus:ring-2 focus:border-transparent transition-all
  `}
                  />
                  {creditAmount !== "" && creditAmount > 0 && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                      New balance after approval:{" "}
                      <strong className="text-zinc-600 dark:text-zinc-300">
                        {walletState.currentCredits + Number(creditAmount)}{" "}
                        credits
                      </strong>
                    </p>
                  )}
                  {walletState.status === "found" && !isAmountValid && (
                    <p className="text-xs text-red-500 mt-1">
                      Enter a valid credit amount (greater than 0)
                    </p>
                  )}

                
                </div>
              )}
            </div>
          )}

          {isPending && (
            <div>
              <label className={`${labelCls} mb-2`}>
                Admin Note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Add a note visible to your team…"
                className={inputCls}
              />
            </div>
          )}

          {!isPending && request.admin_note && (
            <div>
              <span className={labelCls}>Admin Note</span>
              <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 italic">
                {request.admin_note}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          {isPending ? (
            <div className="flex gap-3 w-full">
              <button
                onClick={() => handleAction("rejected")}
                disabled={!!loading}
                className="flex-1 py-2.5 rounded-xl border-2 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading === "rejected" ? (
                  <Spinner />
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
                Reject
              </button>
              <button
  onClick={() => handleAction("approved")}
  disabled={!!loading || !canApprove}
  className={`flex-1 py-2.5  rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2
    ${canApprove
      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
      : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed"
    }
  `}
>
                {loading === "approved" ? (
                  <Spinner />
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                Approve
                {creditAmount && walletState.status === "found"
                  ? ` & Refund ${creditAmount} cr`
                  : ""}
              </button>
            </div>
          ) : (
            <p className="text-xs text-center text-zinc-400 dark:text-zinc-500 w-full">
              This request was <strong>{request.status}</strong> on{" "}
              {fmtDate(request.updated_at)}
            </p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
