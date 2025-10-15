"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Circle, HelpCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import ColumnHide from "./column-hide";
// import { Filter } from "./filter";
import Pagination from "./pagination";
import { SearchForm, type TableSearchOptions } from "./search";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

// const statuses = [
// 	{
// 		value: "VERIFIED",
// 		label: "VERIFIED",
// 		icon: HelpCircle,
// 	},
// 	{
// 		value: "NEW",
// 		label: "NEW",
// 		icon: Circle,
// 	},
// ];

interface DataTableProps<TData, TValue> {
  columns:
    | ColumnDef<TData, TValue>[]
    | ((pageIndex: number, pageSize: number) => ColumnDef<TData, TValue>[]);
  data?: TData[];
  endpoint?: string;
  searchOptions: TableSearchOptions[];
  extraData?: PostCallData;
  queryKey?: string;
  staleTime?: number;
  refetchInterval?: number;
  enableBackground?: boolean;
}

const fetchTableData = async (params: {
  endpoint: string;
  searchParams: Record<string, any>;
  pageIndex: number;
  pageSize: number;
  extraData?: PostCallData;
}) => {
  const { endpoint, searchParams, pageIndex, pageSize, extraData } = params;

  const submitData = {
    DisplayLength: pageSize.toString(),
    DisplayStart: (pageIndex * pageSize).toString(),
    endpoint: endpoint,
    ...searchParams,
    ...extraData,
  };

  const response = await apiPostCall(submitData as PostCallData);
  console.log("Table list response", response);

  if (response?.status !== API_CONSTANTS.success) {
    throw new Error(response?.data?.message || "Failed to fetch data");
  }

  return {
    data: response.data || [],
    totalCount:
      response.data.length > 0 && response.data[0].totalCount
        ? Number.parseInt(response.data[0].totalCount)
        : 0,
    hasError: response.data.error === "Token generation failed",
  };
};

export function DataTable<TData, TValue>({
  columns,
  data,
  endpoint,
  searchOptions,
  extraData,
  queryKey = "tableData",
  staleTime = 30000, // 30 seconds
  refetchInterval = 90000, // 15 minutes
  enableBackground = true,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const dynamicColumns = React.useMemo(() => {
    if (typeof columns === "function") {
      return (columns as any)(pagination.pageIndex, pagination.pageSize);
    }
    return columns;
  }, [columns, pagination.pageIndex, pagination.pageSize]);

  const {
    data: queryResult,
    isLoading,
    error,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      queryKey,
      endpoint,
      searchParams,
      pagination.pageIndex,
      pagination.pageSize,
      extraData,
    ],
    queryFn: () =>
      fetchTableData({
        endpoint: endpoint!,
        searchParams,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        extraData,
      }),
    enabled: !!endpoint,
    staleTime,
    gcTime: 5 * 60 * 1000,
    refetchInterval: refetchInterval,
    refetchOnWindowFocus: enableBackground,
    refetchOnReconnect: enableBackground,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes("Token generation failed")) {
        return false;
      }
      return failureCount < 3;
    },
    throwOnError: false,
  });

  const tableData = queryResult?.data || data || [];
  const totalCount = queryResult?.totalCount || 0;

  useEffect(() => {
    if (queryResult?.hasError) {
      router.push("/login");
    }
  }, [queryResult?.hasError, router]);

  const table = useReactTable({
    data: tableData,
    columns: dynamicColumns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,
  });

  // const fetchData = useCallback(
  // 	async (
  // 		searchData: Record<string, any> = {},
  // 		pageIndex = 0,
  // 		pageSize = 10,
  // 	) => {
  // 		if (!endpoint) return;

  // 		setIsLoading(true);
  // 		try {
  // 			const submitData = {
  // 				DisplayLength: pageSize.toString(),
  // 				DisplayStart: (pageIndex * pageSize).toString(),
  // 				endpoint: endpoint,
  // 				...searchData,
  // 				...extraData,
  // 			};

  // 			// console.log(`Fetching ${endpoint} with payload:`, submitData);

  // 			const response = await apiPostCall(submitData as PostCallData);
  // 			console.log(`Response for ${endpoint}:`, response);

  // 			if (response?.data && response.status === API_CONSTANTS.success) {
  // 				setTableData(response.data);
  // 				if (response.data.length > 0 && response.data[0].totalCount) {
  // 					setTotalCount(Number.parseInt(response.data[0].totalCount));
  // 				}
  // 				if (response.data.error === "Token generation failed") {
  // 					router.push("/login");
  // 				}
  // 			} else {
  // 				setTableData([]);
  // 				setTotalCount(0);
  // 			}
  // 		} catch (error) {
  // 			// console.error(`Error fetching ${endpoint} data:`, error);
  // 			setTableData([]);
  // 			setTotalCount(0);
  // 		} finally {
  // 			setIsLoading(false);
  // 		}
  // 	},
  // 	[endpoint, router, extraData],
  // );

  // const handleManualSearch = useCallback(
  // 	(searchData: Record<string, any>) => {
  // 		// console.log("Manual search data:", searchData);
  // 		setSearchParams(searchData);
  // 		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  // 		fetchData(searchData, 0, pagination.pageSize);
  // 	},
  // 	[fetchData, pagination.pageSize],
  // );

  const handleManualSearch = useCallback(
    (searchData: Record<string, any>) => {
      setSearchParams(searchData);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));

      queryClient.invalidateQueries({
        queryKey: [queryKey, endpoint],
      });
    },
    [queryClient, queryKey, endpoint]
  );

  // const handleReset = useCallback(() => {
  // 	// console.log("Resetting search");
  // 	setSearchParams({});
  // 	setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  // 	fetchData({}, 0, pagination.pageSize);
  // }, [fetchData, pagination.pageSize]);

  const handleReset = useCallback(() => {
    setSearchParams({});
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

    queryClient.invalidateQueries({
      queryKey: [queryKey, endpoint],
    });
  }, [queryClient, queryKey, endpoint]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // useEffect(() => {
  // 	if (!endpoint) return;

  // 	const pageIndex = pagination?.pageIndex ?? 0;
  // 	const pageSize = pagination?.pageSize ?? 10;

  // 	fetchData(searchParams, pageIndex, pageSize);
  // }, [
  // 	endpoint,
  // 	fetchData,
  // 	pagination.pageIndex,
  // 	pagination.pageSize,
  // 	searchParams,
  // 	extraData,
  // ]);

  useEffect(() => {
    const hasNextPage =
      pagination.pageIndex + 1 < Math.ceil(totalCount / pagination.pageSize);

    if (hasNextPage && !isLoading) {
      queryClient.prefetchQuery({
        queryKey: [
          queryKey,
          endpoint,
          searchParams,
          pagination.pageIndex + 1,
          pagination.pageSize,
          extraData,
        ],
        queryFn: () =>
          fetchTableData({
            endpoint: endpoint!,
            searchParams,
            pageIndex: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
            extraData,
          }),
        staleTime: staleTime,
      });
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    totalCount,
    isLoading,
    queryClient,
    queryKey,
    endpoint,
    searchParams,
    extraData,
    staleTime,
  ]);

  return (
    <div>
      <div className="flex items-center pb-4 gap-3">
        <SearchForm
          searchOptions={searchOptions}
          onSearch={handleManualSearch}
          onReset={handleReset}
          isLoading={isLoading}
        />

        {/* {table.getColumn("status") && (
					<Filter
						column={table.getColumn("status")}
						title="Status"
						options={statuses}
					/>
				)} */}
        <ColumnHide table={table} />
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh Table
        </Button>
      </div>

      {isFetching && !isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-4">
          <div className="flex items-center">
            <RefreshCw className="h-4 w-4 animate-spin text-blue-600 mr-2" />
            <p className="text-sm text-blue-800">Updating data...</p>
          </div>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Failed to load data
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {error?.message || "An error occurred while fetching data"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(10)].map((_, index) => (
                <TableRow key={`skeleton-${index * 2}`}>
                  {dynamicColumns.map((_: any, colIndex: number) => (
                    <TableCell key={`skeleton-${index * 2}-${colIndex}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={dynamicColumns.length}
                  className="h-24 text-center"
                >
                  No Data Available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="relative">
        <Pagination table={table} />
        {isFetching && (
          <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
}
