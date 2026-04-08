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
};

type Props = {
  filters: {
    startDate: string;
    endDate: string;
    aggregation: string;
    csp: string[];
    gpu_type: string[];
  };
  // page: number;
  // limit: number;
};

export default function Table({ filters }: Props) {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [activeDate, setActiveDate] = useState<string | null>(null);

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
      }),
    })
      .then((res) => res.json())
      .then((res: ApiResponse) => {
        const tableRows = res.table?.rows || [];
        const sortedRows = tableRows.sort((a, b) => {
          if (a.category.includes("Total")) return -1;
          if (b.category.includes("Total")) return 1;
          return 0;
        });
        setRows(sortedRows);

        const allDates = new Set<string>();
        tableRows.forEach((row) => {
          Object.keys(row.data).forEach((d) => allDates.add(d));
        });

        setDates(Array.from(allDates).sort());
      });
  }, [filters]);

  if (!rows.length) return <div>Loading...</div>;

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
    </div>
  );
}

function formatNumber(num: number) {
  return num.toLocaleString();
}