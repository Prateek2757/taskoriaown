// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { toast } from 'sonner';
// import { Mail, ArrowLeft, CheckCircle, Sparkles, Shield } from 'lucide-react';
// import { useAuth } from './AuthContext';
// import LoadingSpinner from '../showinglead/LoadingSpinner';

// interface ForgotPasswordPageProps {
//   onBackToLogin: () => void;
// }

// export function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
//   const { forgotPassword, isLoading } = useAuth();
//   const [email, setEmail] = useState('');
//   const [submitted, setSubmitted] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email) {
//       toast.error('Please enter your email');
//       return;
//     }
//     try {
//       await forgotPassword(email);
//       setSubmitted(true);
//       toast.success('Password reset link sent!');
//     } catch {
//       toast.error('Failed to send reset link');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />
//       </div>

//       <div className="w-full max-w-md relative z-10">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-glow mb-4">
//             <Sparkles className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-slate-900">Taskoria</h1>
//           <p className="text-slate-500 mt-1">Affiliate Partner Portal</p>
//         </div>

//         <Card className="shadow-card border-0">
//           <CardHeader className="space-y-1">
//             <div className="flex items-center">
//               <button
//                 onClick={onBackToLogin}
//                 className="mr-3 p-1 hover:bg-slate-100 rounded-full transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5 text-slate-500" />
//               </button>
//               <div>
//                 <CardTitle className="text-xl font-semibold">
//                   {submitted ? 'Check your email' : 'Reset password'}
//                 </CardTitle>
//                 <CardDescription>
//                   {submitted 
//                     ? `We've sent a reset link to ${email}` 
//                     : 'Enter your email to receive a reset link'}
//                 </CardDescription>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {!submitted ? (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="you@example.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="pl-10 h-11"
//                       disabled={isLoading}
//                     />
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full h-11 gradient-primary hover:opacity-90 text-white font-medium"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <LoadingSpinner  />
//                   ) : (
//                     'Send Reset Link'
//                   )}
//                 </Button>

//                 <div className="flex items-center justify-center p-3 bg-slate-50 rounded-lg">
//                   <Shield className="w-4 h-4 text-slate-400 mr-2" />
//                   <span className="text-xs text-slate-500">
//                     Secure, encrypted password reset
//                   </span>
//                 </div>
//               </form>
//             ) : (
//               <div className="text-center space-y-4">
//                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//                   <CheckCircle className="w-8 h-8 text-green-600" />
//                 </div>
//                 <p className="text-slate-600">
//                   Click the link in your email to reset your password. 
//                   The link will expire in 24 hours.
//                 </p>
//                 <div className="space-y-2">
//                   <Button
//                     onClick={onBackToLogin}
//                     className="w-full h-11 gradient-primary hover:opacity-90 text-white font-medium"
//                   >
//                     Back to Login
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     onClick={() => setSubmitted(false)}
//                     className="w-full h-10"
//                   >
//                     Didn't receive it? Resend
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
