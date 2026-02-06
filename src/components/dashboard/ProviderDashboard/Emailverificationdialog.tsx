"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { Loader2, Mail, CheckCircle2, Shield } from "lucide-react";

interface EmailVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  userEmail?: string;
}

export function EmailVerificationDialog({
  open,
  onOpenChange,
  onSuccess,
  userEmail,
}: EmailVerificationDialogProps) {
  const [step, setStep] = useState<"send" | "verify">("send");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/emailVerification/send-verification-email"
      );

      if (response.data.success) {
        toast.success("Verification code sent to your email!");
        setStep("verify");
        startCountdown();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send verification email"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (fullCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/emailVerification/verify-email", {
        fullCode,
      });

      if (response.data.success) {
        toast.success("Email verified successfully! 🎉");
        setCode([]);
        setStep("send");
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }

    if (e.key === "Enter") {
      handleVerifyCode();
    }
  };

  const fullCode = code.join("");

  const handleResendCode = async () => {
    setCode([]);
    await handleSendCode();
  };

  const handleClose = () => {
    setCode([]);
    setStep("send");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
            {step === "send" ? (
              <Mail className="h-8 w-8 text-white" />
            ) : (
              <Shield className="h-8 w-8 text-white" />
            )}
          </div>
          <DialogTitle className="text-center text-2xl">
            {step === "send" ? "Verify Your Email" : "Enter Verification Code"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === "send" ? (
              <>
                We'll send a 6-digit verification code to
                <br />
                <span className="font-semibold text-foreground">
                  {userEmail}
                </span>
              </>
            ) : (
              "Enter the 6-digit code we sent to your email"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === "send" ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-medium mb-1">Why verify?</p>
                    <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                      <li>• Be verified User</li>
                      <li>• Secure your account</li>
                      {/* <li>• Unlock all features</li> */}
                      <li>• Receive important notifications</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full h-11 text-base font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="h-14 w-12 text-center text-2xl font-bold"
                  />
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center mt-2">
                Code expires in 10 minutes
              </p>

              <Button
                onClick={handleVerifyCode}
                disabled={loading || fullCode.length !== 6}
                className="w-full h-11 text-base font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={loading || countdown > 0}
                  className="text-sm"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
