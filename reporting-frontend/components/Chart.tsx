"use client";

import formatLabel from "@/utils/utils";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), {
    ssr: false,
})

type ChartData = {
    date: string;
    contracted: number;
    delivered: number;
};

type Props = {
    data: ChartData[] | undefined;
    aggregation: string;
    gpu_type: string[];
};

export default function Chart({ data, aggregation, gpu_type }: Props) {

    if (!data) return null;
    const sorted = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dates = sorted.map((d) => formatLabel(d.date, aggregation));
    const contracted = sorted.map((d) => d.contracted);
    const delivered = sorted.map((d) => d.delivered);

    return (
        <div className="rounded-xl overflow-hidden mx-8 my-2 h-[530px]">    
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
                    line: { color: "#4ade80", width: 1.5 },
                },
                {
                    x: dates,
                    y: delivered,
                    type: "scatter",
                    mode: "lines+markers",
                    name: "Delivered",
                    line: { color: "#60a5fa" , width: 1.5 },
                },
                ]}
                layout={{

                paper_bgcolor: "#272e2b",
                plot_bgcolor: "#272e2b",
                font: { color: "#e5e7eb" },

                title: {
                    text: `Total Capacity GPUs<br><sub>(Below Graph is the aggregated data across all ${gpu_type} GPUs) </sub>`,
                },

                xaxis: {
                    showgrid: true,
                    gridcolor: "#374151",
                    tickangle: -45,
                    zeroline: false,
                    tickformat: "%b %Y",
                },

                yaxis: {
                    title : { text: "Contracted GPUs", standoff: 20 },
                    showgrid: true,
                    gridcolor: "#374151",
                    zeroline: true,
                    zerolinewidth: 2,
                    zerolinecolor: "#c4c9d0" ,
                    rangemode: "tozero",
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
                    b: 120,
                },
                hovermode: "x unified",
                }}

                style={{ width: "100%", height: "100%" }}
            />
    </div>
    );
}