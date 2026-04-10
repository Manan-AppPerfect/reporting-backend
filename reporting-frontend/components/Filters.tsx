"use client";

import { it } from "node:test";
import { useState } from "react";

type FilterProps = {
    onApply: (filters: {
        startDate: string;
        endDate: string;
        aggregation: string;
        csp: string[];
        gpu_type: string[];
    }) => void;
};

const toggleValue = (value: string, list: string[], setter: any) => {
    if (list.includes(value)) {
        setter(list.filter((v) => v !== value));
    }
    else {
        setter([...list, value]);
    }
}


export default function Filters( { onApply } : FilterProps ) {
    const today = new Date().toISOString().split("T")[0];
 
    const [ startDate, setStartDate ] = useState("2025-01-01");
    const [ endDate, setEndDate ] = useState(today);
    const [ aggregation, setAggregation ] = useState("monthly");
    const [ csp, setCsp ] = useState<string[]>([]);
    const [ gpu_type, setGpuType ] = useState<string[]>([]);
    const [ cspOpen, setCspOpen ] = useState(false);
    const [ gpuOpen, setGpuOpen ] = useState(false);
    const [ open, setOpen ] = useState(false);

    const handleApply = () => {
        onApply({
            startDate,
            endDate,
            aggregation,
            csp,
            gpu_type,
        });
    };


    return (
        <div className="px-8">
            <div className="bg-[#0f1a14] border border-[#1f2d24] rounded-xl">

                {/* 🔥 Top Bar */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-[#1f2d24]">
                    <span className="text-white font-medium">Filters</span>

                    <button
                    onClick={() => setOpen(!open)}
                    className="text-sm text-gray-300 hover:text-white"
                    >
                    {open ? "Hide Filters" : "Show Filters"}
                    </button>
                </div>

                {/* 🔥 Collapsible Section */}
                {open && (
                    <div className="p-4 flex flex-wrap items-end gap-4">

                    {/* Start Date */}
                    <div className="flex flex-col">
                        <label className="text-sm mb-1 text-gray-300">Start Date</label>
                        <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-gray-200 border border-[#2a3a30] rounded-md px-3 py-2 h-10 text-black"
                        />
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col">
                        <label className="text-sm mb-1 text-gray-300">End Date</label>
                        <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-gray-200 border border-[#2a3a30] rounded-md px-3 py-2 h-10 text-black"
                        />
                    </div>

                    {/* Aggregation */}
                    <div className="flex flex-col">
                        <label className="text-sm mb-1 text-gray-300">Aggregation</label>
                        <select
                        value={aggregation}
                        onChange={(e) => setAggregation(e.target.value)}
                        className="bg-gray-200 border border-[#2a3a30] rounded-md px-3 py-2 h-10 text-black"
                        >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    {/* csp filter */}
                    <div className="flex flex-col relative w-[150px]">
                        <label className="text-sm mb-1 text-gray-300">CSP</label>

                        <button
                            onClick={() => {
                                setCspOpen(!cspOpen);
                                setGpuOpen(false);
                            }}
                            className="bg-gray-200 border border-[#2a3a30] rounded-md px-3 py-2 h-10 text-left text-dark"    
                        >
                            Select CSP
                        </button>
                        {cspOpen && (
                            <div className="absolute top-full mt-1 w-full bg-[#16231b] border border-[#2a3a30] rounded-md p-3 z-20 shadow-lg">
                                {["AWS", "OCI", "Azure", "Coreweave"].map((item) => (
                                    <label key={item} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#1f2d24] cursor-pointer text-sm text-white">
                                        <input
                                            type="checkbox"
                                            checked={csp.includes(item)}
                                            onChange={() => toggleValue(item, csp, setCsp)}
                                            className="accent-green-500 cursor-pointer"
                                        />
                                        {item}
                                    </label>
                                )
                                )}
                            </div>
                        )}
                    </div>


                    {/* gpu filter */}
                    <div className="flex flex-col relative w-[150px]">
                        <label className="text-sm mb-1 text-gray-300">GPU Type</label>

                        <button
                            onClick={() => {
                                setGpuOpen(!gpuOpen);
                                setCspOpen(false);
                            }}
                            className="bg-gray-200 border border-[#2a3a30] rounded-md px-3 py-2 h-10 text-left text-dark"    
                        >
                            Select GPU Type
                        </button>
                        {gpuOpen && (
                            <div className="absolute top-full mt-1 w-full bg-[#16231b] border border-[#2a3a30] rounded-md p-3 z-20 shadow-lg">
                                {["A100", "H100", "L40", "L405", "GB200", "B300", "B40", "B400" ].map((item) => (
                                    <label key={item} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#1f2d24] cursor-pointer text-sm text-white">
                                        <input
                                            type="checkbox"
                                            checked={gpu_type.includes(item)}
                                            onChange={() => toggleValue(item, gpu_type, setGpuType)}
                                            className="accent-green-500 cursor-pointer"
                                        />
                                        {item}
                                    </label>
                                )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Apply */}
                    <button
                        onClick={handleApply}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white font-medium"
                    >
                        Apply
                    </button>

                    </div>
                )}
            </div>
        </div>
    );
}