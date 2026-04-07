import Chart from "@/components/Chart";
import Table from "@/components/Table";

export default function Home() {
  return (

    <div className="min-h-screen bg-gray-800">
      <h1 className="p-8 font-bold text-4xl text-white">Supply Summary</h1>
      <div className="flex flex-col gap-16">
        <Chart />
        <Table />
      </div>
    </div>
  )
}

