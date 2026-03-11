"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, X, Loader2 } from "lucide-react";
import { ProviderResponse } from "@/types";
import axios from "axios";
import { useForm } from "react-hook-form";

function buildSignature(response: ProviderResponse) {
  const lines = [];
  if (response.professional_name) lines.push(response.professional_name);
  if (
    response.professional_company_name &&
    response.professional_company_name !== response.professional_name
  ) {
    lines.push(response.professional_company_name);
  }
  if (response.professional_website) lines.push(response.professional_website);
  if (response.professional_contact_number)
    lines.push(response.professional_contact_number);
  return lines.join("\n");
}

function buildDefaultBody(response: ProviderResponse) {
  const customer_name = response.customer_name;
  return `Dear ${customer_name},

I found your project on Taskoria and I'd love to get involved.

I've some thoughts that I'd like to run past you, does today suit you for a chat?

Hope to speak soon,

${buildSignature(response)}`;
}

interface EmailComposeModalProps {
  open: boolean;
  onClose: () => void;
  response: ProviderResponse;
}
type EmailForm = {
  subject: string;
  body: string;
};

export default function EmailComposeModal({
  open,
  onClose,
  response,
}: EmailComposeModalProps) {
  const [subject, setSubject] = useState("Project Discussion");
  const [body, setBody] = useState(buildDefaultBody(response));
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EmailForm>({
    defaultValues: {
      subject: "Project Discussion",
      body: buildDefaultBody(response),
    },
  });

  const handleSend = async () => {
    try {
      setSending(true);

      const res = await axios.post("/api/provider-compose-email", {
        method: "POST",
        email: response.customer_email,
        messageFromProvider: body,
      });

      const data = await res.data;

      if (!res.data.success) {
        throw new Error(data.error);
      }

      setSent(true);

      setTimeout(() => {
        onClose();
        setSubject("Project Discussion");
        setBody(buildDefaultBody(response));
        setSent(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      reset({
        subject: "Project Discussion",
        body: buildDefaultBody(response),
      });

      setSent(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-3xl w-full  p-0 gap-0 overflow-hidden rounded-xl"
      >
        <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Compose your email
          </DialogTitle>
          {/* <a
            href="#"
            className="text-xs text-indigo-500 hover:underline font-medium ml-auto mr-4"
          >
            💡 Tips for writing a great email
          </a> */}
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSend)}>
          <div className="flex flex-1 min-h-0">
            <div className="flex-1 flex flex-col p-6 gap-4">
              <div className="flex items-center gap-3">
                <Label className="text-xs text-gray-500 w-12 shrink-0">
                  To
                </Label>
                <Input
                  readOnly
                  value={response.customer_email ?? ""}
                  className="h-8 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 cursor-default"
                />
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-xs text-gray-500 w-12 shrink-0">
                  Subject
                </Label>
                <Input
                  {...register("subject", { required: true })}
                  className="h-8 text-sm border-gray-200 dark:border-gray-700"
                  placeholder="Subject"
                />
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700" />

              <Textarea
                {...register("body", { required: true })}
                className="flex-1 min-h-[280px] resize-none text-sm border-0 focus-visible:ring-0 p-0 bg-transparent text-gray-800 dark:text-gray-200 leading-relaxed"
                placeholder="Write your message..."
              />
            </div>

            {/* <div className="w-36 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center gap-4 py-6 px-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Content
            </p>
            {[
              {
                icon: "⬛⬛",
                label: "Columns",
              },
              {
                icon: "▭",
                label: "Button",
              },
              {
                icon: "—",
                label: "Divider",
              },
              {
                icon: "🖼",
                label: "Image",
              },
              {
                icon: "A",
                label: "Text",
              },
            ].map(({ icon, label }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-1 w-full py-2 px-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
              >
                <span className="text-lg text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                  {icon}
                </span>
                <span className="text-[10px] text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 font-medium">
                  {label}
                </span>
              </button>
            ))}
          </div> */}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3 bg-white dark:bg-gray-900">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={sending}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={sending || sent}
              className="text-sm bg-[#2563EB] hover:bg-blue-700 text-white min-w-[90px]"
            >
              {sending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Sending…
                </>
              ) : sent ? (
                "✓ Sent!"
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
