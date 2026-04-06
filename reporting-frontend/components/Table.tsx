"use client";

import { useEffect, useState } from "react";

type TableRow = {
  category: string;
  data: Record<string, number>;
};

type ApiResponse = {
  chart: any;
  table: {
    rows: TableRow[];
  };
};

export default function Table() {
  const [rows, setRows] = useState<TableRow[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/reporting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date: "2025-01-01",
        end_date: "2025-12-01",
        aggregation: "monthly",
      }),
    })
      .then((res) => res.json())
      .then((res: ApiResponse) => {
        setRows(res.table.rows || []);
      })
      .catch(console.error);
  }, []);

  if (!rows.length) return <div>Loading...</div>;


  const dates = Object.keys(rows[0].data);

  return (
    <table border={1} cellPadding={10}>
      <thead>
        <tr>
          <th>Category</th>
          {dates.map((d) => (
            <th key={d}>{d}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            <td>{row.category}</td>
            {dates.map((d) => (
              <td key={d}>{row.data[d]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}