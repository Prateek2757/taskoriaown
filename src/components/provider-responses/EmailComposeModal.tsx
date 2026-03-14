"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ProviderResponse } from "@/types";

import EmailBuilder, { EmailBuilderHandle } from "../email/components/EmailEditor";


function buildSignature(response: ProviderResponse): string {
  const lines: string[] = [];
  if (response.professional_name) lines.push(response.professional_name);
  if (
    response.professional_company_name &&
    response.professional_company_name !== response.professional_name
  )
    lines.push(response.professional_company_name);
  if (response.professional_website) lines.push(response.professional_website);
  if (response.professional_contact_number)
    lines.push(response.professional_contact_number);
  return lines.join("\n");
}

function buildDefaultBody(response: ProviderResponse): string {
  return `Dear ${response.customer_name},\nI found your project on Taskoria and I'd love to get involved.\nI've some thoughts that I'd like to run past you, does today suit you for a chat?\nHope to speak soon,\n\n${buildSignature(response)}`;
}


type EmailForm = { subject: string };

interface EmailComposeModalProps {
  open: boolean;
  onClose: () => void;
  response: ProviderResponse;
}


export default function EmailComposeModal({
  open,
  onClose,
  response,
}: EmailComposeModalProps) {
  const emailBuilderRef = useRef<EmailBuilderHandle>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const defaultBody = buildDefaultBody(response);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmailForm>({
    defaultValues: { subject: "Project Discussion" },
  });

  // ── Send ──────────────────────────────────────────────────────────────────

  const handleSend = async (formData: EmailForm) => {
    try {
      setSending(true);

      // 1. Ask Unlayer to render the current editor state into HTML
      const messageFromProvider = await emailBuilderRef.current?.exportHtml();

      if (!messageFromProvider) {
        throw new Error("Could not export email content. Please try again.");
      }

      // 2. POST to your existing API route
      //    The API receives `messageFromProvider` which is now full HTML from Unlayer
      const res = await axios.post("/api/provider-compose-email", {
        email: response.customer_email,
        subject: formData.subject,
        messageFromProvider, // ← full Unlayer HTML
      });

      if (!res.data.success) throw new Error(res.data.error);

      setSent(true);
      setTimeout(() => {
        resetState();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // ── Reset ─────────────────────────────────────────────────────────────────

  const resetState = () => {
    reset({ subject: "Project Discussion" });
    setSent(false);
  };

  const handleClose = () => {
    if (sending) return;
    resetState();
    onClose();
  };


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-4xl lg:min-w-5xl w-full p-0 gap-0 overflow-hidden rounded-xl flex flex-col max-h-[92vh]"
      >
        <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <DialogTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Compose Email
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSend)}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          <div className="px-6 pt-4 pb-3 flex flex-col gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <Label className="text-xs text-gray-500 w-14 shrink-0">To</Label>
              <Input
                readOnly
                value={response.customer_email ?? ""}
                className="h-8 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 cursor-default"
              />
            </div>

            <div className="flex items-center gap-3">
              <Label className="text-xs text-gray-500 w-14 shrink-0">Subject</Label>
              <div className="flex-1 flex flex-col gap-1">
                <Input
                  {...register("subject", { required: "Subject is required" })}
                  className="h-8 text-sm border-gray-200 dark:border-gray-700"
                  placeholder="Subject"
                />
                {errors.subject && (
                  <span className="text-xs text-red-500">{errors.subject.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mx-6 border-t border-gray-100 dark:border-gray-700 shrink-0" />

          {/* Unlayer visual editor */}
          <div className="flex-1 min-h-0 overflow-auto px-6 py-4">
            <EmailBuilder ref={emailBuilderRef} defaultBody={defaultBody} />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3 bg-white dark:bg-gray-900 shrink-0">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              The email will be sent from Taskoria on your behalf.
            </p>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={handleClose} disabled={sending} className="text-sm">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={sending || sent}
                className="text-sm bg-[#2563EB] hover:bg-blue-700 text-white min-w-[90px]"
              >
                {sending ? (
                  <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />Sending…</>
                ) : sent ? (
                  "✓ Sent!"
                ) : (
                  <><Send className="w-3.5 h-3.5 mr-2" />Send</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}