
// "use client"
// import { User } from 'next-auth';
// import React, { createContext, useContext, useState, useCallback } from 'react';

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   loginWithGoogle: () => Promise<void>;
//   register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
//   logout: () => void;
//   verifyOTP: (otp: string) => Promise<void>;
//   resendOTP: () => Promise<void>;
//   forgotPassword: (email: string) => Promise<void>;
//   resetPassword: (token: string, password: string) => Promise<void>;
//   enable2FA: () => Promise<void>;
//   verify2FA: (code: string) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const login = useCallback(async (email: string, _password: string) => {
//     setIsLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setUser({
//         id: '1',
//         email,
//         firstName: 'Alex',
//         lastName: 'Johnson',
//         role: 'affiliate',
//         isVerified: true,
//         createdAt: new Date(),
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const loginWithGoogle = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setUser({
//         id: '2',
//         email: 'alex.johnson@gmail.com',
//         firstName: 'Alex',
//         lastName: 'Johnson',
//         role: 'affiliate',
//         isVerified: true,
//         createdAt: new Date(),
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const register = useCallback(async (email: string, _password: string, firstName: string, lastName: string) => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setUser({
//         id: '3',
//         email,
//         firstName,
//         lastName,
//         role: 'affiliate',
//         isVerified: false,
//         createdAt: new Date(),
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const logout = useCallback(() => {
//     setUser(null);
//   }, []);

//   const verifyOTP = useCallback(async (_otp: string) => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 800));
//       if (user) {
//         setUser({ ...user, isVerified: true });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user]);

//   const resendOTP = useCallback(async () => {
//     await new Promise(resolve => setTimeout(resolve, 500));
//   }, []);

//   const forgotPassword = useCallback(async (_email: string) => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 800));
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const resetPassword = useCallback(async (_token: string, _password: string) => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 800));
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const enable2FA = useCallback(async () => {
//     await new Promise(resolve => setTimeout(resolve, 500));
//   }, []);

//   const verify2FA = useCallback(async (_code: string) => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 800));
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         isLoading,
//         login,
//         loginWithGoogle,
//         register,
//         logout,
//         verifyOTP,
//         resendOTP,
//         forgotPassword,
//         resetPassword,
//         enable2FA,
//         verify2FA,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }
