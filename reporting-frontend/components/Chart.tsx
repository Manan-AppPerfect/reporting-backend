"use client";

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

export default function Chart() {

    const [data, setData] = useState<ChartData[]>([]);

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
        .then((res) => setData(res.chart || []))
        .catch(console.error);
    }, []);

    if (!data.length) return <div>Loading...</div>;

    const sorted = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dates = sorted.map((d) => d.date);
    const contracted = sorted.map((d) => d.contracted);
    const delivered = sorted.map((d) => d.delivered);

    return (
        <div className="p-8">    
            <Plot
                config={{
                displaylogo: false,
                modeBarButtonsToRemove: [
                    "zoom2d",
                    "zoomIn2d",
                    "zoomOut2d",
                    "pan2d",
                    "autoScale2d",
                    "resetScale2d",
                    "select2d",
                    "lasso2d",
                    "toImage"
                ]
                }}
                data={[
                {
                    x: dates,
                    y: contracted,
                    type: "scatter",
                    mode: "lines+markers",
                    name: "Contracted",
                    line: { color: "#4ade80", width: 2 },
                },
                {
                    x: dates,
                    y: delivered,
                    type: "scatter",
                    mode: "lines+markers",
                    name: "Delivered",
                    line: { color: "#60a5fa" , width: 2 },
                },
                ]}
                layout={{

                paper_bgcolor: "#111827",
                plot_bgcolor: "#111827",
                font: { color: "#e5e7eb" },

                title: {
                    text: "Total Capacity GPUs<br><sub>(Below Graph is the aggregated data across all GPUs)</sub>",
                },

                xaxis: {
                    showgrid: true,
                    gridcolor: "#374151",
                    tickangle: -45,
                    zeroline: false,
                    tickformat: "%b %Y",
                },

                yaxis: {
                    title : { text: "Contracted GPUs", standoff: 30 },
                    showgrid: true,
                    gridcolor: "#374151",
                    zeroline: false,
                    tickformat: ",.0f",
                },

                legend: {
                    orientation: "h",
                    x: 1,
                    xanchor: "right",
                    y: 1.1,
                },
                autosize: true,
                margin: {
                    l: 120,
                    r: 20,
                    t: 80,
                    b: 60,
                },
                hovermode: "x unified",
                }}

                style={{ width: "100%", height: "700px" }}
            />
    </div>
    );
}