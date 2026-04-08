export default function formatLabel(dateStr: string, aggregation: string) {
    const date = new Date(dateStr);

    if (aggregation == "daily"){
        return date.toLocaleDateString("en-US",{
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    if (aggregation == "weekly") {
        const start = new Date(date);
        const end = new Date(date);

        end.setDate(start.getDate() + 6);

        return `${start.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        })} - ${end.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        })}`
    }

    if (aggregation == "monthly") {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return `${start.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        })} - ${end.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })}`
    }

    if (aggregation === "yearly") {
        return date.getFullYear().toString();
    }

    return dateStr
}