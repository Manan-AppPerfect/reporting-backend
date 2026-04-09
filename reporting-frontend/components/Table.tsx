"use client";

import formatLabel from "@/utils/utils";
import { Limelight } from "next/font/google";
import { useEffect, useState } from "react";

type TableRow = {
  category: string;
  data: Record<string, number>;
};

type ApiResponse = {
  table: {
    rows: TableRow[];
  };
  total?: number;
};

type Props = {
  filters: {
    startDate: string;  
    endDate: string;
    aggregation: string;
    csp: string[];
    gpu_type: string[];
  };
  page: number;
  limit: number;
  setPage: (p: number | ((prev: number) => number)) => void;
};

export default function Table({ filters, page, limit, setPage }: Props) {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/reporting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date: filters.startDate,
        end_date: filters.endDate,
        aggregation: filters.aggregation,
        csp: filters.csp,
        gpu_type: filters.gpu_type,
        page: page,
        limit: limit,
      }),
    })
      .then((res) => res.json())
      .then((res: ApiResponse) => {
        const tableRows = res.table?.rows || [];
        const sortedRows = [
          ...tableRows.filter(r => r.category === "Total Contracted GPUs - Contracted Delivery"),
          ...tableRows.filter(r => r.category === "Total Contracted GPUs - Delivered & Expected"),
          ...tableRows.filter(r => !r.category.includes("Total"))
        ];

        setRows(sortedRows);
        setTotal(res.total || 0);

        const allDates = new Set<string>();
        tableRows.forEach((row) => {
          Object.keys(row.data).forEach((d) => allDates.add(d));
        });

        setDates(Array.from(allDates).sort());
      });
  }, [filters, page]);

  if (!rows.length) return <div>Loading...</div>;
  const totalPages = Math.ceil(total / limit) || 1;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="px-8 py-4 min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-xl font-semibold mb-4">Table View</h2>

      <div className="overflow-x-auto rounded-lg ">
        <table className="w-full">
          {/* HEADER */}
          <thead className="bg-teal-800 sticky top-0 z-10">
            <tr>
              <th className="px-4 w-64 py-3 text-left">
                Category
              </th>
              {dates.map((d) => (
                <th
                  key={d}
                  onClick={() => setActiveDate(d)}
                  className={`px-4 py-3 text-md text-center cursor-pointer text-nowrap
                    ${activeDate === d ? "bg-[#2f4f2f] text-white" : "hover:bg-[#1a2a22]"}
                  `}
                  
                >
                  {formatLabel(d, filters.aggregation)}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {rows.map((row, idx) => {
              const isTotal = row.category.includes("Total");

              return (
                <tr
                  key={idx}
                  className={
                    isTotal
                      ? "bg-slate-900 hover:bg-black"
                      : "odd:bg-slate-700 even:bg-slate-800 hover:bg-black"
                  }
                >
                  <td className="w-64 px-4 py-3 text-left text-nowrap">
                    {row.category}
                  </td>

                  {dates.map((d) => (
                    <td
                      key={d}
                      className={`px-4 py-3 text-center
                        ${activeDate === d ? "bg-[#2a3f2f] text-white" : "text-[#e5e7eb]"}
                      `}
                    >
                      {formatNumber(row.data[d] ?? " ")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-4 mt-4">

        <span className="text-white">
          {start} to {end} of {total}
        </span>
        
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-white">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={rows.length < limit}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
}

function formatNumber(num: number) {
  return num.toLocaleString();
}