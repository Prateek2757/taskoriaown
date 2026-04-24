import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Shield, Sparkles, Timer } from 'lucide-react';
import { useAuth } from './AuthContext';
import { FaSpinner } from 'react-icons/fa';

interface OTPVerificationPageProps {
  onComplete: () => void;
}

export function OTPVerificationPage({ onComplete }: OTPVerificationPageProps) {
  const { verifyOTP, resendOTP, isLoading } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (index === 5 && value) {
      const fullOtp = [...newOtp.slice(0, 5), value].join('');
      if (fullOtp.length === 6) {
        handleSubmit(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (fullOtp: string) => {
    try {
      await verifyOTP(fullOtp);
      toast.success('Email verified successfully!');
      onComplete();
    } catch {
      toast.error('Invalid verification code');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP();
      setResendTimer(60);
      toast.success('Verification code resent!');
    } catch {
      toast.error('Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-glow mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Taskoria</h1>
          <p className="text-slate-500 mt-1">Affiliate Partner Portal</p>
        </div>

        <Card className="shadow-card border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-7 h-7 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-semibold">Verify your email</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:opacity-50"
                  disabled={isLoading}
                />
              ))}
            </div>

            <Button
              onClick={() => handleSubmit(otp.join(''))}
              className="w-full h-11 gradient-primary hover:opacity-90 text-white font-medium"
              disabled={isLoading || otp.some(d => !d)}
            >
              {isLoading ? (
                <FaSpinner className="w-4 h-4" />
              ) : (
                'Verify Email'
              )}
            </Button>

            <div className="text-center space-y-3">
              <div className="flex items-center justify-center text-sm text-slate-500">
                <Timer className="w-4 h-4 mr-1" />
                {resendTimer > 0 ? (
                  <span>Resend code in {resendTimer}s</span>
                ) : (
                  <span>Didn't receive the code?</span>
                )}
              </div>
              
              <Button
                variant="ghost"
                onClick={handleResend}
                disabled={resendTimer > 0 || isLoading}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Resend Code
              </Button>
            </div>

            <div className="flex items-center justify-center p-3 bg-slate-50 rounded-lg">
              <Shield className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-xs text-slate-500">
                Your verification code is secure and encrypted
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
