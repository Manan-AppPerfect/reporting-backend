"use client";
import Chart from "@/components/Chart";
import Filters from "@/components/Filters";
import Table from "@/components/Table";
import { useState } from "react";

export default function Home() {

  const [page, setPage] = useState(1);
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
    setFilters(filters); 
  };

  return (

    <div className="min-h-screen bg-gray-800">
      <h1 className="p-8 font-bold text-4xl text-white">Supply Summary</h1>
      <div className="flex flex-col gap-2">
        <Filters onApply={handleFilters} />
        <Chart filters={filters}/>
        <Table filters={filters} page={page} limit={limit} setPage={setPage}/>
      </div>
    </div>
  )
}

