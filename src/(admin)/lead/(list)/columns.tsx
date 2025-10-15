'use client';

import type { ColumnDef, Row } from '@tanstack/react-table';
import {
    ArrowUpDown,
    Eye,
    MessageSquarePlus,
    Pencil,
    Trash,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CommentModal from './commentModal';

export type LeadlList = {
    rowId: number;
    firstName: string;
    lastName: string;
    payTerm: string;
    premium: string;
    sumAssured: string;
    term: string;
    status: 'ISSUED' | 'NEW' | 'DELETED';
    paymentStatus: 'NEW' | 'COMPLETE';
    proposalNumber: string;
    proposalNumberEncrypted: string;
};

type ActionCellProps = {
    row: Row<LeadlList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
    const policyRow = row.original;
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [openComment, setOpenComment] = useState(false);

    const esewaRecheck = async (row) => {
        const url = `/api/esewa-recheck?total_amount=${row.premium}&transaction_uuid=${row.referenceId}`;
        try {
            const response = await fetch(url);
            const resultText = await response.text();

            let parsedData: any;

            try {
                parsedData = JSON.parse(resultText);
            } catch {
                parsedData = { raw: resultText };
            }
            if (resultText) {
                const encodedData = btoa(JSON.stringify(parsedData));
                router.push(
                    `/proposal/proposalpayment/paymentresponse?data=${encodedData}`,
                );
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex gap-1">
            <Button
                variant="outline"
                size="icon"
                onClick={() => setOpen(true)}
                className="cursor-pointer"
                title="View"
            >
                <Eye />
            </Button>

            {/* <ViewModal open={open} setOpen={setOpen} /> */}

            <Button
                variant="outline"
                size="icon"
                onClick={() =>
                    router.push(
                        `/proposal/edit/${policyRow.proposalNumberEncrypted}`,
                    )
                }
                className="cursor-pointer"
                title="Edit"
            >
                <Pencil />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setOpenComment(true)}
                className="cursor-pointer"
                title="Edit"
            >
                <MessageSquarePlus />
            </Button>

            <CommentModal open={openComment} setOpen={setOpenComment} />

            <Button
                variant="outline"
                size="icon"
                onClick={() => console.log('first')}
                className="cursor-pointer"
                title="Delete"
            >
                <Trash />
            </Button>
        </div>
    );
};

export const createProposalColumns = (
    pageIndex: number,
    pageSize: number,
): ColumnDef<LeadlList>[] => [
    {
        accessorKey: 'sn',
        header: 'SN',
        cell: ({ row }) => {
            const dynamicSN = pageIndex * pageSize + row.index + 1;
            return <div>{dynamicSN}</div>;
        },
    },
    {
        accessorKey: 'proposalNumber',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Proposal Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'name',
        header: 'Full Name',
        cell: ({ row }) => {
            return `${row.original.firstName} ${row.original.lastName}`;
        },
    },

    {
        accessorKey: 'term',
        header: 'Term',
    },
    {
        accessorKey: 'payTerm',
        header: 'Pay Term',
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.original.status;
            switch (status) {
                case 'NEW':
                    return <Badge variant="secondary">{status}</Badge>;

                case 'ISSUED':
                    return (
                        <Badge
                            variant="secondary"
                            className="bg-green-500 text-white dark:bg-green-600"
                        >
                            {status}
                        </Badge>
                    );

                case 'DELETED':
                    return <Badge variant="destructive">{status}</Badge>;

                default:
                    return <Badge variant="outline">{status}</Badge>;
            }
        },
    },
    {
        accessorKey: 'paymentStatus',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Payment Status
                </Button>
            );
        },
        cell: ({ row }) => {
            const paymentStatus = row.original.paymentStatus;
            switch (paymentStatus) {
                case 'COMPLETE':
                    return (
                        <Badge
                            variant="secondary"
                            className="bg-green-500 text-white dark:bg-green-600"
                        >
                            {paymentStatus}
                        </Badge>
                    );
                case 'NEW':
                    return <Badge variant="secondary">{paymentStatus}</Badge>;
                default:
                    return <Badge variant="destructive">{paymentStatus}</Badge>;
            }
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ActionsCell row={row} />,
    },
];

export const columns: ColumnDef<LeadlList>[] = createProposalColumns(0, 25);
