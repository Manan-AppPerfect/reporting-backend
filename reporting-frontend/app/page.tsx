"use client";
import Chart from "@/components/Chart";
import Filters from "@/components/Filters";
import Table from "@/components/Table";
import { getReportingData } from "@/lib/api";
import { useEffect, useRef, useState } from "react";

export default function Home() {

  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const limit = 6;

  const [filters, setFilters] = useState({
    startDate: "2025-04-01",
    endDate: new Date().toISOString().split("T")[0],
    aggregation: "monthly",
    csp: [] as string[],
    gpu_type: [] as string[],
  });

  const handleFilters = (filters: {
    startDate: string;
    endDate: string;
    aggregation: string;
    csp: string[];
    gpu_type: string[];
  }) => {
    setPage(1);
    setFilters(filters); 
  };

  const prevFiltersRef = useRef(filters);


  useEffect(() => {
    const fetchData = async () => {
      const isFilterChange =
        JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);

      if (isFilterChange || isFirstLoad) {
        setLoading(true);        // full loader for filters + first load
      } else {
        setPageLoading(true);    // only pagination
      }

      const start = Date.now();

      try {
        const res = await getReportingData({ ...filters, page, limit });
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        const elapsed = Date.now() - start;
        const minTime = 300;

        if (elapsed < minTime) {
          await new Promise(resolve => setTimeout(resolve, minTime - elapsed));
        }

        setLoading(false);
        setPageLoading(false);
        setIsFirstLoad(false);
        prevFiltersRef.current = filters;
      }
    };

    fetchData();
  }, [filters, page]);

  const hasData =
    data?.table?.rows &&
    data.table.rows.length > 2;

  return (
    <div className="min-h-screen bg-[#132a20]">
      <h1 className="p-8 font-bold text-4xl text-white">Supply Summary</h1>
      <div className="flex flex-col gap-2">
        <Filters onApply={handleFilters} />
        {loading && !pageLoading && (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-600 border-t-white mb-3"></div>
            <p>Loading data...</p>
          </div>
        )}
        {!loading && hasData && (
          <Chart data={data?.chart} aggregation={filters.aggregation} gpu_type={filters.gpu_type}/>
        )}
        {!loading && hasData && (
          <Table data={data} page={page} limit={limit} aggregation={filters.aggregation} setPage={setPage}/>
        )}
        {!loading && !hasData && (
          <div className="p-8 text-white text-center">No data available</div>
        )}
      </div>
    </div>
  )
}
