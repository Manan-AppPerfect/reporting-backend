export async function getReportingData (filters : {
    startDate: string;
    endDate: string;
    aggregation: string;
    csp: string[];
    gpu_type: string[];
    page?: number;
    limit?: number;
}) {
    const res = await fetch("http://localhost:8080/reporting", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({
            start_date: filters.startDate,
            end_date: filters.endDate,
            aggregation: filters.aggregation,
            csp: filters.csp,
            gpu_type: filters.gpu_type,
            page: filters.page,
            limit: filters.limit,
        })
    });

    return res.json();
}