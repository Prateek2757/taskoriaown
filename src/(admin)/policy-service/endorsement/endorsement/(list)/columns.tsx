"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Check,
  FilePen,
  Pencil,
  FileText,
  Trash,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { De } from "zod/v4/locales";
import DeleteForward from "../components/DeleteForward";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { useState } from "react";

export type PolicyList = {
  rowId: number;
  sn: number;
  kycNumber: string;
  proposalNumberEncrypted: string;
  name: string;
  address: string;
  mobileNumber: string;
  status: "APPROVED" | "ENDORSEMENT" | "DELETED";
  branch?: string;
  endorsementId?: string;
  policyNumber?: string;
  clientId?: string;
  Term?: string;
  payterm?: string;
  plan?: string;
  fullname?: string;
  agent?: string;
  sumAssured?: string;
  premium?: string;
  endorsementType?: string;
};

type ActionCellProps = {
  row: Row<PolicyList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const kycRow = row.original;
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.name;
  const [isProposalVerifyOpen, setIsProposalVerifyOpen] = useState(false);
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);
    const handleVerifyProposalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsProposalVerifyOpen(true);
  };

  const handleApprove = async (remarks: string) => {
    try {
      setIsSubmittingDecision(true);
      if (!proposalNumber) {
        return;
      }
      const submitData: PostCallData = {
        ProposalNumberEncrypted: proposalNumber,
        remarks: remarks,
        endpoint: "proposal_verify",
      } as PostCallData;
      console.log("Proposal Approval data", submitData);
      const response = await apiPostCall(submitData);

      console.log("Proposal Approval response", response);
      if (response?.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "Proposal Approved Successfully"
        );
        sessionStorage.removeItem("mobile-phone");
        sessionStorage.removeItem("otp");
        router.push("/proposal");
      } else {
        showToast(
          response?.data.code,
          response?.data.message,
          "Proposal Approval Failed"
        );
      }
    } catch (error) {
      console.error("Error approving proposal:", error);
      alert(`Error: ${error || "Failed to Verify Proposal"}`);
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  const handleDecline = async (remarks: string) => {
    try {
      setIsSubmittingDecision(true);
      if (!proposalNumber) {
      }
      const submitData: PostCallData = {
        ProposalNumberEncrypted: proposalNumber,
        remarks: remarks,
        endpoint: "proposal_decline_remarks",
      } as PostCallData;

      console.log("Proposal Decline data", submitData);
      const response = await apiPostCall(submitData);

      console.log("Proposal Decline response", response);
      if (response?.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "Proposal Declined Successfully"
        );
        sessionStorage.removeItem("mobile-phone");
        sessionStorage.removeItem("otp");
        router.push("/proposal");
      } else {
        showToast(
          response?.data.code,
          response?.data.message,
          "Proposal Decline Failed"
        );
      }
    } catch (error) {
      console.error("Error declining proposal:", error);
      alert(`Error: ${error || "Failed to Declining Proposal"}`);

    } finally {
      setIsSubmittingDecision(false);
    }
  };

  return (
    <div className="flex gap-1">
      {(kycRow.status !== "ENDORSEMENT" || username === "Pradip Gautam") && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/proposal/verify/${kycRow.proposalNumberEncrypted}`)}
            className="cursor-pointer"
            title="View Underwriting Sheet"
          >
            <Eye />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`endorsement/memo/${kycRow.proposalNumberEncrypted}`)}
            className="cursor-pointer"
            title="Generate Memo"
          >
            <FileText />
          </Button>


        </>
      )}



      {(kycRow.status !== "APPROVED" || username === "Pradip Gautam") && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push(`endorsement/edit/${kycRow.kycNumberEncrypted}`)
            }
            className="cursor-pointer"
            title="Edit"
          >
            <Pencil />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push(`endorsement/verify/${kycRow.kycNumberEncrypted}`)
            }
            className="cursor-pointer"
            title="Verify"
          >
            <Check />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            title="Generate Proposal"
            onClick={handleVerifyProposalClick}
          >
            <Trash />
          </Button>
          <DeleteForward
            isOpen={isProposalVerifyOpen}
            onClose={() => setIsProposalVerifyOpen(false)}
            isSubmitting={isSubmittingDecision}
            onApprove={handleApprove}
            onDecline={handleDecline}
          />


        </>
      )}



    </div>
  );
};

export const createPolicyColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<PolicyList>[] => [
    {
      accessorKey: "sn",
      header: "SN",
      cell: ({ row }) => {
        const dynamicSN = pageIndex * pageSize + row.index + 1;
        return <div>{dynamicSN}</div>;
      },
    },
    { accessorKey: "branch", header: "Branch" },
    { accessorKey: "endorsementId", header: "Endorsement ID" },
    { accessorKey: "policyNumber", header: "Policy Number" },
    { accessorKey: "Term", header: "Term" },
    { accessorKey: "payterm", header: "Pay Term" },
    { accessorKey: "plan", header: "Plan" },
    { accessorKey: "fullname", header: "Full Name" },
    { accessorKey: "agent", header: "Agent" },
    { accessorKey: "sumAssured", header: "Sum Assured" },
    { accessorKey: "premium", header: "Premium" },
    { accessorKey: "endorsementType", header: "Endorsement Type" },

    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        switch (status) {
          case "NEW":
            return <Badge variant="secondary">{status}</Badge>;

          case "VERIFIED":
            return (
              <Badge
                variant="secondary"
                className="bg-green-500 text-white dark:bg-green-600"
              >
                {status}
              </Badge>
            );

          case "DELETED":
            return <Badge variant="destructive">{status}</Badge>;

          default:
            return <Badge variant="outline">{status}</Badge>;
        }
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];

export const columns: ColumnDef<PolicyList>[] = createPolicyColumns(0, 25);
function showToast(code: any, message: any, arg2: string) {
  throw new Error("Function not implemented.");
}

