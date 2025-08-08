import React, { useState, useEffect, useRef } from "react";
import HomeLayout from "../Layout/HomeLayout";
import { ShoppingCart, HandCoins } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch } from "react-redux";
import { getLineChartData, getSalesData } from "@/Redux/Slices/authSlice";
import { Chart, registerables } from "chart.js";
import { LineChart } from "recharts";

Chart.register(...registerables);

const Home = () => {
  const dispatch = useDispatch();
  const [salesData, setSalesData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [sales, setSales] = useState([]);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [pieChartInstance, setPieChartInstance] = useState(null);

  const pieData = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];
  const COLORS = ["#620A1A", "#620A1A", "#FFBB28", "#FF8042"];

  const handleGetAllSalesData = async () => {
    const response = await dispatch(getSalesData());
    setSalesData(response?.payload?.data?.ordersData);
    console.log(response);
  };

  const handleGetLineChartData = async () => {
    try {
      const response = await dispatch(getLineChartData({ year: selectedYear }));
      setSales(response?.payload?.data?.monthlySales);
      console.log(response);

      if (lineChartRef.current) {
        initLineChart(response?.payload?.data?.monthlySales);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initLineChart = (monthlySales) => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = lineChartRef.current.getContext("2d");
    const newChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: monthlySales?.map((item) => item.month) || [],
        datasets: [
          {
            label: "Sales",
            data: monthlySales?.map((item) => item.sales) || [],
            borderColor: "#620A1A",
            tension: 0.1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    setChartInstance(newChartInstance);
  };

  const initPieChart = () => {
    if (pieChartInstance) {
      pieChartInstance.destroy();
    }

    const ctx = pieChartRef.current.getContext("2d");
    const newPieChartInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: pieData.map((item) => item.name),
        datasets: [
          {
            data: pieData.map((item) => item.value),
            backgroundColor: COLORS,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw || 0;
                const total = context.dataset.data.reduce(
                  (acc, data) => acc + data,
                  0
                );
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    setPieChartInstance(newPieChartInstance);
  };

  useEffect(() => {
    handleGetAllSalesData();
    handleGetLineChartData();

    if (pieChartRef.current) {
      initPieChart();
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }
    };
  }, [selectedYear]);

  useEffect(() => {
    if (sales?.length > 0 && lineChartRef?.current) {
      initLineChart(sales);
    }
  }, [sales]);

  return (
    <HomeLayout>
      <h1 className="text-2xl">Welcome Admin</h1>
      <div className="container mx-auto  py-10 flex flex-col items-center justify-center text-center  rounded-xl shadow-xl ">
        <div className="grid grid-cols-2  md:grid-cols-4 md:gap-y-0 gap-y-3 gap-x-6 w-full md:h-40">
          <div className=" rounded gap-y-1  shadow-xl flex flex-col h-28 md:h-40  items-center  justify-center   bg-white">
            <p>
              {" "}
              <ShoppingCart className="" />
            </p>
            <p>Today's Orders</p>
            <p>{salesData?.todayTotalOrders}</p>
          </div>

          <div className=" rounded shadow-xl flex flex-col items-center h-28 md:h-40   justify-center   bg-white">
            <HandCoins className="text-xl" />
            Today's Sales
            <p>
              {" "}
              {salesData?.todayTotalAmount?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          <div className=" gap-y-1 rounded  shadow-xl flex flex-col items-center h-28 md:h-40  justify-center   bg-white">
            <p>
              {" "}
              <ShoppingCart className="" />
            </p>
            <p> All Orders</p>
            <p>{salesData?.totalOrders}</p>
          </div>

          <div className=" shadow-xl rounded flex flex-col items-center h-28 md:h-40  justify-center   bg-white">
            <HandCoins className="text-xl" />
            Total Sales
            <p>
              {" "}
              {salesData?.totalSales?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 mt-6 md:gap-y-0 gap-y-4 gap-x-6 w-full h-40">
          <div className=" rounded shadow-xl flex flex-col items-center h-28 md:h-40  justify-center   bg-white">
            <HandCoins className="text-xl" />
            Total Users
            <p>
              {" "}
              {salesData?.totalUser
             
              }
            </p>
          </div>

          <div className=" shadow-xl rounded flex flex-col items-center h-28 md:h-40  justify-center   bg-white">
            <HandCoins className="text-xl" />
            Cancelled Orders
            <p>
              {" "}
              {salesData?.cancelledOrders}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:mt-10 bg-white p-4">
          <div>
            <div className="flex  items-center justify-between">
              <div className="w-fit">
                <Tabs defaultValue="tab-1" className="items-start ">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="ml-4 p-2 border rounded"
                  >
                  
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                     <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                  <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                      value="tab-1"
                      className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Sales
                    </TabsTrigger>
                  
                  </TabsList>
                  <TabsContent value="tab-1">
                    <div className="w-[80vw] md:w-[60vw]">
                      <canvas ref={lineChartRef}  />
                    </div>
                  </TabsContent>
              
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Home;
