// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { toast } from 'sonner';
// import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, Sparkles } from 'lucide-react';
// import { useAuth } from './AuthContext';
// import { FaSpinner } from 'react-icons/fa';
// import Image from 'next/image';

// interface LoginPageProps {
//   onRegisterClick: () => void;
//   onForgotPasswordClick: () => void;
// }

// export function LoginPage({ onRegisterClick, onForgotPasswordClick }: LoginPageProps) {
//   const { login, loginWithGoogle, isLoading } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [enable2FA, setEnable2FA] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email || !password) {
//       toast.error('Please fill in all fields');
//       return;
//     }
//     try {
//       await login(email, password);
//       toast.success('Welcome back to Taskoria!');
//     } catch {
//       toast.error('Invalid email or password');
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       await loginWithGoogle();
//       toast.success('Welcome back to Taskoria!');
//     } catch {
//       toast.error('Google login failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
//       {/* Background decorations */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/20 to-cyan-100/20 rounded-full blur-3xl" />
//       </div>

//       <div className="w-full max-w-md relative z-10">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-glow ">
//           <Image
//               src="/taskorialogonew.png"
//               alt="taskorialogo"
//               height={41}
//               width={50}
//             />          </div>
//           <h1 className="text-3xl font-bold text-slate-900">Taskoria</h1>
//           <p className="text-slate-500 mt-1">Affiliate Partner Portal</p>
//         </div>

//         <Card className="shadow-card border-0">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-xl font-semibold">Welcome back</CardTitle>
//             <CardDescription>Sign in to access your affiliate dashboard</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {/* Google Login */}
//             <Button
//               variant="outline"
//               className="w-full h-11 font-medium border-slate-200 hover:bg-slate-50"
//               onClick={handleGoogleLogin}
//               disabled={isLoading}
//             >
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                 <path
//                   fill="currentColor"
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                 />
//                 <path
//                   fill="currentColor"
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                 />
//                 <path
//                   fill="currentColor"
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                 />
//                 <path
//                   fill="currentColor"
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                 />
//               </svg>
//               Continue with Google
//             </Button>

//             <div className="relative">
//               <Separator />
//               <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-slate-400">
//                 Or continue with email
//               </span>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="you@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="pl-10 h-11"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                   <Input
//                     id="password"
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="pl-10 pr-10 h-11"
//                     disabled={isLoading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="remember"
//                     checked={rememberMe}
//                     onCheckedChange={(checked) => setRememberMe(checked as boolean)}
//                   />
//                   <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
//                     Remember me
//                   </Label>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={onForgotPasswordClick}
//                   className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//                 >
//                   Forgot password?
//                 </button>
//               </div>

//               {/* 2FA Toggle */}
//               <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
//                 <Shield className="w-4 h-4 text-slate-500" />
//                 <div className="flex-1">
//                   <Label htmlFor="2fa" className="text-sm font-medium cursor-pointer">
//                     Enable Two-Factor Authentication
//                   </Label>
//                   <p className="text-xs text-slate-500">Add an extra layer of security</p>
//                 </div>
//                 <Checkbox
//                   id="2fa"
//                   checked={enable2FA}
//                   onCheckedChange={(checked) => setEnable2FA(checked as boolean)}
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full h-11  hover:opacity-90 text-white font-medium"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <FaSpinner className="w-4 h-4" />
//                 ) : (
//                   <>
//                     Sign In
//                     <ArrowRight className="w-4 h-4 ml-2" />
//                   </>
//                 )}
//               </Button>
//             </form>

//             <div className="text-center text-sm">
//               <span className="text-slate-500">Don't have an account?</span>{' '}
//               <button
//                 onClick={onRegisterClick}
//                 className="text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 Become an affiliate
//               </button>
//             </div>

//             {/* Trust badges */}
//             <div className="pt-4 border-t border-slate-100">
//               <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
//                 <span className="flex items-center">
//                   <Shield className="w-3 h-3 mr-1" />
//                   Secure SSL
//                 </span>
//                 <span className="flex items-center">
//                   <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                   </svg>
//                   Encrypted
//                 </span>
//                 <span>GDPR Compliant</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
