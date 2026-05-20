
import { useState, useMemo, useEffect } from "react";

function usePagination<T>(
  data: T[],
  itemsPerPage: number,
  dependency?: unknown
) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [dependency]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    return data.slice(0, currentPage * itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const loadLess = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const hasMore = currentPage < totalPages;
  const hasLess = currentPage > 1;

  return {
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
    loadMore,
    loadLess,
    hasMore,
    hasLess,
  };
}

export default usePagination;