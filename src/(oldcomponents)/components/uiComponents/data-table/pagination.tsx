import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

type PaginationProps<TData> = {
	table: Table<TData>;
	pageSizeOptions?: number[];
	isLoading?: boolean;
};

function Pagination<TData>({
	table,
	pageSizeOptions = [10, 20, 30, 40, 50],
	isLoading = false,
}: PaginationProps<TData>) {
	const { pageIndex, pageSize = 10 } = table.getState().pagination;
	const pageCount = table.getPageCount();
	return (
		<>
			<div className="mt-3 justify-end print:hidden  flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
				<div className="flex items-center space-x-2">
					<p className="whitespace-nowrap font-medium text-sm">Rows per page</p>
					<Select
						value={`${pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
						disabled={isLoading}
					>
						<SelectTrigger className="h-8 w-[4.5rem] [&[data-size]]:h-8">
							<SelectValue placeholder={pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{pageSizeOptions.map((size) => (
								<SelectItem key={size} value={`${size}`}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center justify-center font-medium text-sm">
					Page {pageIndex + 1} of {pageCount}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						aria-label="Go to first page"
						variant="outline"
						size="icon"
						className="hidden size-8 lg:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage() || isLoading}
					>
						<ChevronsLeft />
					</Button>
					<Button
						aria-label="Go to previous page"
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage() || isLoading}
					>
						<ChevronLeft />
					</Button>
					<Button
						aria-label="Go to next page"
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage() || isLoading}
					>
						<ChevronRight />
					</Button>
					<Button
						aria-label="Go to last page"
						variant="outline"
						size="icon"
						className="hidden size-8 lg:flex"
						onClick={() => table.setPageIndex(pageCount - 1)}
						disabled={!table.getCanNextPage() || isLoading}
					>
						<ChevronsRight />
					</Button>
				</div>
			</div>
		</>
	);
}

export default Pagination;
