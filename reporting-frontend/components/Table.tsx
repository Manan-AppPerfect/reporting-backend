"use client";

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

export default function Table() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [dates, setDates] = useState<string[]>([])

  useEffect(() => {
    fetch("http://localhost:8080/reporting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date: "2024-01-01",
        end_date: "2027-12-31",
        aggregation: "monthly",
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
  }, []);

  if (!rows.length) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-xl font-semibold mb-4">Table View</h2>

      <div className="overflow-x-auto rounded-lg border border-[#1f2d24]">
        <table className="w-full">
          
          {/* HEADER */}
          <thead className="bg-teal-800 sticky top-0 z-10">
            <tr>
              <th className="px-32 py-3 text-center text-sm border-b border-black">
                Category
              </th>
              {dates.map((d) => (
                <th
                  key={d}
                  className="py-3 text-sm text-center border-b border-black"
                >
                  {formatDate(d)}
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
                      ? "bg-slate-900"
                      : "bg-slate-700 hover:bg-black"
                  }
                >
                  <td className="px-4 py-3 border-b border-black text-left">
                    {row.category}
                  </td>

                  {dates.map((d) => (
                    <td
                      key={d}
                      className="px-4 py-3 text-center border-b border-black"
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatNumber(num: number) {
  return num.toLocaleString();
}