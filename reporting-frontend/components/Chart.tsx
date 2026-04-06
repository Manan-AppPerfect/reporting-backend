"use client";

import { fallbackModeToFallbackField } from "next/dist/lib/fallback";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Plot = dynamic(() => import("react-plotly.js"), {
    ssr: false,
})

type ChartData = {
    date: string;
    contracted: number;
    delivered: number;
};

type ApiResponse = {
    chart: ChartData[] | null;
    table: any;
};

export default function Chart() {

    const [data, setData] = useState<ApiResponse | null>(null);

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
        .then(setData)
        .catch(console.error);
    }, []);

    if (!data || !data.chart) return <div>Loading...</div>;

    const dates = data.chart.map((d) => d.date);
    const contracted = data.chart.map((d) => d.contracted);
    const delivered = data.chart.map((d) => d.delivered);

    return (
        <Plot
        data={[
            {
            x: dates,
            y: contracted,
            type: "scatter",
            mode: "lines+markers",
            name: "Contracted",
            },
            {
            x: dates,
            y: delivered,
            type: "scatter",
            mode: "lines+markers",
            name: "Delivered",
            },
        ]}
        layout={{
            title: { text: "GPU Report" },
        }}
        />
    );
}