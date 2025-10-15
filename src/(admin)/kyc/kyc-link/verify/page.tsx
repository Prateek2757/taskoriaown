"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { Check, Loader2Icon, Undo2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AddKycLinkDTO } from "../KycListSchema";

function KycVerificationContent() {
  const [kycLinkData, setKycLinkData] = useState<AddKycLinkDTO>();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isKycLinkVerifyOpen, setIsKycLinkVerifyOpen] = useState(false);
  const [isKycLinkDeclineOpen, setIsKycLinkDeclineOpen] = useState(false);

  const searchparams = useSearchParams();
  const rowId = searchparams.get("rowId") as string;
  const kycNumber = searchparams.get("kycNumber") as string;
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!kycNumber) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const data: PostCallData & {
          rowId: string;
          kycNumber: string;
        } = {
          rowId: rowId,
          kycNumber: kycNumber,
          endpoint: "kyclink_detail",
        };
        const response = await apiPostCall(data);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setKycLinkData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching kyc link Detail data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [kycNumber]);

  const verifyKycLink = async () => {
    try {
      setIsSubmitting(true);
      if (!kycNumber || !rowId) {
        return;
      }
      const submitData: PostCallData & {
        rowId: string;
        kycNumber: string;
      } = {
        rowId: rowId,
        kycNumber: kycNumber,
        endpoint: "kyclink_approve",
      };
      console.log("Kyc Link Number Verification Form data", submitData);
      const response = await apiPostCall(submitData);
      console.log("Kyc Link Number Verification response", response);
      if (response?.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "KYC Link Verified Successfully"
        );
        setIsKycLinkVerifyOpen(false);
        router.push("/kyc/kyc-link");
      } else {
        showToast(
          response?.data.code,
          response?.data.message,
          "KYC Link Verification Failed"
        );
      }
    } catch (error) {
      console.error("Error getting age", error);
      alert(`Error: ${error || "Failed to Verify KYC"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const declineKycLink = async () => {
    try {
      setIsSubmitting(true);
      if (!kycNumber || !rowId) {
        return;
      }
      const submitData: PostCallData & {
        rowId: string;
        kycNumber: string;
      } = {
        rowId: rowId,
        kycNumber: kycNumber,
        endpoint: "kyclink_decline",
      };
      console.log("Kyc Link Number Verification Form data", submitData);
      const response = await apiPostCall(submitData);
      console.log("Kyc Link Number Verification response", response);
      if (response?.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "KYC Link Declined Successfully"
        );
        setIsKycLinkDeclineOpen(false);
        router.push("/kyc/kyc-link");
      } else {
        showToast(
          response?.data.code,
          response?.data.message,
          "KYC Link Decline Failed"
        );
      }
    } catch (error) {
      console.error("Error getting age", error);
      alert(`Error: ${error || "Failed to Verify KYC"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="bg-white rounded-lg border-1 p-6 text-center">
          <p>Loading KYC Link details...</p>
        </div>
      ) : kycLinkData ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle> KYC Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      KYC Number:
                      <span className="ml-1">
                        <b>{kycLinkData.kycNumber}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Name:
                      <span className="ml-1">
                        <b>{kycLinkData.kycDetails.fullName}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      DOB:
                      <span className="ml-1">
                        <b>{kycLinkData.kycDetails.dateOfBirth}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Age:
                      <span className="ml-1">
                        <b>{kycLinkData.kycDetails.age}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Father Name:
                      <span className="ml-1">
                        <b>{kycLinkData.kycDetails.fatherName}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Phone No.:
                      <span className="ml-1">
                        <b>{kycLinkData.kycDetails.mobileNumber}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Document No.:
                      <span className="ml-1">
                        <b>{kycLinkData.kycDetails.identityDocumentNumber}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Gender:
                      <span className="ml-1">
                        <b>{kycLinkData.kycDetails.gender}</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle>Insured Detail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Policy No.:
                      <span className="ml-1">
                        <b>{kycLinkData.insuredDetails.policyNumber}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Name:
                      <span className="ml-1">
                        <b>{kycLinkData.insuredDetails.fullName}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      DOB:
                      <span className="ml-1">
                        <b>{kycLinkData.insuredDetails.dob}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Age:
                      <span className="ml-1">
                        <b>{kycLinkData.insuredDetails.age}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Current Age:
                      <span className="ml-1">
                        <b>{kycLinkData.insuredDetails.currentAge}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Phone No.:
                      <span className="ml-1">
                        <b>{kycLinkData.insuredDetails.mobileNumber}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Product Name:
                      <span className="ml-1">
                        <b>{kycLinkData.insuredDetails.productName}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Document No.:
                      <span className="ml-1">
                        <b>{kycLinkData.insuredDetails.idDocumentNumber}</b>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      Gender:
                      <span className="ml-1">
                        <b>{kycLinkData.insuredDetails.gender}</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {kycLinkData.isApproved === false && (
                <div className="flex gap-3">
                  <Button
                    disabled={isSubmitting}
                    onClick={() => setIsKycLinkVerifyOpen(true)}
                    className={`${
                      isSubmitting
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Verify
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    onClick={() => setIsKycLinkDeclineOpen(true)}
                    className={`${
                      isSubmitting
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    variant={"destructive"}
                  >
                    {isSubmitting ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      <Undo2Icon className="h-4 w-4" />
                    )}
                    Decline
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
          <ConfirmDialog
            isOpen={isKycLinkVerifyOpen}
            onClose={() => setIsKycLinkVerifyOpen(false)}
            title="Verify KYC Link"
            description="Are you sure you want to verify this KYC link? This action will approve the KYC Link verification."
            onSuccess={verifyKycLink}
            isSubmitting={isSubmitting}
          />
          <ConfirmDialog
            isOpen={isKycLinkDeclineOpen}
            onClose={() => setIsKycLinkDeclineOpen(false)}
            title="Decline KYC Link"
            description="Are you sure you want to decline this KYC link? This action will reject the KYC Link verification."
            onSuccess={declineKycLink}
            isSubmitting={isSubmitting}
          />
        </>
      ) : (
        <div className="bg-white rounded-lg border-1 p-6 text-center">
          <p>No KYC Link details found for number: {kycNumber}</p>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <KycVerificationContent />
      </Suspense>
    </div>
  );
}
