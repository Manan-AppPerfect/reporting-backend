import Chart from "@/components/Chart";

export default function ChartPage() {
  return (
    <div className="min-h-screen bg-gray-800">
      <h1 className="p-8 font-bold text-4xl text-white">Supply Summary</h1>
      <Chart />
    </div>
  );
}