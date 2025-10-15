"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Forward,
  MessageCircle,
  Pencil,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";


export type SurrenderList = {
  rowId: number;
  sn: number;
  kycNumber: string;
  policyNumberEncrypted: string;
  name: string;
  address: string;
  mobileNumber: string;
  status: any;
  remarks: string;
  policyNumber: string;
};

type ActionCellProps = {
  row: Row<SurrenderList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const SurrenderRow = row.original;
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.name;
  const { showToast } = useToast();

  const DeleteSurrender = async () => {
	  try {
		const submitData: PostCallData & {
		  policyNumberEncrypted: string;
		} = {
		  policyNumberEncrypted: SurrenderRow.policyNumberEncrypted ?? "",
		  endpoint: "surrender_delete",
		};

		const response = await apiPostCall(submitData);

		if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
		  showToast(
			response.data.code,
			response.data.message,
			"Surrender deleted successfully"
		  );
		  // Optionally redirect or reset form here
		  router.push("/surrender");
		} else {
		  showToast(
			response?.data.code || "ERROR",
			response?.data.message || "Delete failed",
			"Delete Failed"
		  );
		}
	  } catch (error) {
		console.error("Error in delete surrender:", error);
		throw error;
	  }
	};


  
		

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/policy-service/surrender/forward/${SurrenderRow.policyNumber}`
          )
        }
        className="cursor-pointer"
        title="View"
      >
        <Forward />
      </Button>
      {(SurrenderRow.status !== "VERIFIED" || username === "Pradip Gautam") && (
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
          {
            console.log("Edit clicked",SurrenderRow.policyNumberEncrypted),
            router.push(
              `/policy-service/surrender/edit/${SurrenderRow.policyNumberEncrypted}`
            )
          }}
          className="cursor-pointer"
          title="Edit"
        >
          <Pencil />
        </Button>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            title="Delete"
          >
            <Trash />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Surrender</DialogTitle>
            <DialogDescription>
             Are you sure you want to delete this surrender request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={DeleteSurrender}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const createKycColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<SurrenderList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "policyNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Policy Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "branchCode",
    header: "Request Branch",
  },
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "dateOfCommencement",
    header: "DOC",
  },

  {
    accessorKey: "premium",
    header: "Premium",
  },
  {
    accessorKey: "modeOfPayment",
    header: "MOP",
  },
  {
    accessorKey: "sumAssured",
    header: "SA",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "createdDate",
    header: "Date Created",
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <MessageCircle />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="bg-white p-2 rounded shadow-xl mb-3 border border-gray-300 mr-[150px]">
              <p className="truncate max-w-[300px] ">{row.original.remarks} </p>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<SurrenderList>[] = createKycColumns(0, 25);
