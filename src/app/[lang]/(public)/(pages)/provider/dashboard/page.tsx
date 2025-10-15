"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {useState } from "react";
import  ProviderDashboard  from "@/components/dashboard/ProviderDashboard";


type UserData = {
  user_id: number;
  display_name: string | null;
  email: string;
  phone?: string | null;
  role_name: string;
};

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const userId = localStorage.getItem("user_id");
  //     if (!userId) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const res = await axios.get(`/api/user/me?user_id=${userId}`);
  //       setUserData(res.data);
  //     } catch (err) {
  //       console.error("Failed to fetch user:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-600">Loading dashboard...</p>
//       </div>
//     );
//   }

//   if (!userData) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center">
//         <p className="text-gray-600 mb-3">
//           You must complete onboarding to access your dashboard.
//         </p>
//         <Button asChild>
//           <Link href="/en/onboarding">Go to Onboarding</Link>
//         </Button>
//       </div>
//     );
//   }

//   const { display_name, email, role_name } = userData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back to Home */}
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        {/* Header */}
        {/* <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome, {display_name || "User"} ({role_name})
          </p>
          <p className="text-sm text-gray-500">{email}</p>
        </div> */}

        {/* Dashboard Content */}
        {/* {role_name === "provider" && <ProviderDashboard />}
        {role_name === "customer" && <CustomerDashboard />} */}
        <ProviderDashboard />

        {/* {!["provider", "customer"].includes(role_name) && (
          <p className="text-red-500">
            Your account role is not set correctly. Please contact support.
          </p>
        )} */}
      </div>
    </div>
  );
}