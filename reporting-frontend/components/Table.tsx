"use client";

import formatLabel from "@/utils/utils";
import { useState } from "react";

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
  data: ApiResponse | null;
  page: number;
  limit: number;
  aggregation: string;
  setPage: (p: number | ((prev: number) => number)) => void;
};

export default function Table({ data, page, limit, aggregation, setPage }: Props) {
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const tableRows = data?.table?.rows || [];
  const total = data?.total ?? tableRows.length;

  const sortedRows = [
    ...tableRows.filter(r => r.category === "Total Contracted GPUs - Contracted Delivery"),
    ...tableRows.filter(r => r.category === "Total Contracted GPUs - Delivered & Expected"),
    ...tableRows.filter(r => !r.category.includes("Total"))
  ];

  const rows = sortedRows;

  const allDates = new Set<string>();
  tableRows.forEach((row) => {
    Object.keys(row.data).forEach((d) => allDates.add(d));
  });

  const dates = Array.from(allDates).sort();

  const totalPages = Math.ceil(total / limit) || 1;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  if (!data) return null;

  return (
    <div className="px-8 py-4 min-h-screen text-white">
      <h2 className="text-3xl font-bold text-start mb-4">Table View</h2>

      <div className="overflow-x-auto rounded-lg">
        <table className="w-full">
          {/* HEADER */}
          <thead className="bg-[#272e2b]">
            <tr>
              <th className="px-4 w-64 py-3 text-left">
                Category
              </th>
              {dates.map((d) => (
                <th
                  key={d}
                  onClick={() => setActiveDate(d)}
                  className={`px-4 py-3 text-md text-center cursor-pointer text-nowrap
                    ${activeDate === d ? "bg-lime-900 text-white" : "hover:bg-black "}
                  `}
                  
                >
                  {formatLabel(d, aggregation)}
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
                      ? "bg-lime-900 hover:bg-black"
                      : "odd:bg-[#272e2b] even:bg-mist-700 hover:bg-black"
                  }
                >
                  <td className="w-64 px-4 py-3 text-left text-nowrap">
                    {row.category}
                  </td>

                  {dates.map((d) => (
                    <td
                      key={d}
                      className={`px-4 py-3 text-center
                        ${activeDate === d ? "bg-lime-900 text-white" : "text-[#e5e7eb]"}
                      `}
                    >
                      {row.data[d] !== undefined ? formatNumber(row.data[d]) : ""}
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
          type="button"
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
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
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