import { useState, useMemo, useEffect } from "react";

function usePagination<T>(data: T[], itemsPerPage: number, dependency?: unknown) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [dependency]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  return { paginatedData, currentPage, setCurrentPage, totalPages };
}

export default usePagination;