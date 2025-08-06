import React, { useState, useEffect } from "react";
import HomeLayout from "../Layout/HomeLayout";
import { ShoppingCart } from "lucide-react";
import { HandCoins } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  Cell,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch } from "react-redux";
import { getSalesData } from "@/Redux/Slices/authSlice";

const Home = () => {
  const pieData = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const data = [
    { name: "Jan", sales: 2400, uv: "500" },
    { name: "Feb", sales: 200, uv: "1000" },
    { name: "Mar", sales: 2200, uv: "1500" },
    { name: "Apr", sales: 1800, uv: "2000" },
    { name: "May", sales: 3000, uv: "3000" },
    { name: "June", sales: 2500, uv: "500" },
    { name: "July", sales: 2700, uv: "3500" },
    { name: "Aug", sales: 3200, uv: "20000" },
    { name: "Sep", sales: 2800, uv: "50" },
    { name: "Oct", sales: 3100, uv: "2500" },
    { name: "Nov", sales: 3500, uv: "2800" },
    { name: "Dec", sales: 4000, uv: "500" },
  ];

  const dispatch = useDispatch();
  const [salesData, setSalesData] = useState([]);

  const handleGetAllSalesData = async () => {
    const response = await dispatch(getSalesData());
    setSalesData(response?.payload?.data?.ordersData);
    console.log(response);
  };

  useEffect(() => {
    handleGetAllSalesData();
  }, []);

  console.log(salesData);
  return (
    <HomeLayout>
      <h1 className="text-2xl">Welcome Admin</h1>
      <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center text-center  rounded-xl shadow-xl ">
        <div className="grid grid-cols-4 gap-x-6 w-full h-40">
          <div className=" rounded gap-y-1  shadow-xl flex flex-col items-center  justify-center   bg-white">
            <p>
              {" "}
              <ShoppingCart className="" />
            </p>
            <p>Today's Orders</p>
            <p>{salesData?.todayTotalOrders}</p>
          </div>

          <div className=" rounded shadow-xl flex flex-col items-center  justify-center   bg-white">
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

          <div className=" gap-y-1 rounded  shadow-xl flex flex-col items-center  justify-center   bg-white">
            <p>
              {" "}
              <ShoppingCart className="" />
            </p>
            <p> All Orders</p>
            <p>{salesData?.totalOrders}</p>
          </div>

          <div className=" shadow-xl rounded flex flex-col items-center  justify-center   bg-white">
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

        <div className="grid grid-cols-2 mt-6 gap-x-6 w-full h-40">
          <div className=" rounded shadow-xl flex flex-col items-center  justify-center   bg-white">
            <HandCoins className="text-xl" />
            Total Users
            <p>
              {" "}
              {salesData?.totalUser?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          <div className=" shadow-xl rounded flex flex-col items-center  justify-center   bg-white">
            <HandCoins className="text-xl" />
            Cancelled Orders
            <p>
              {" "}
              {salesData?.cancelledOrders?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 mt-10 bg-white p-4">
          <div>
            <div className="flex  items-center justify-between">
              <div className="w-fit">
                <Tabs defaultValue="tab-1" className="items-start ">
                  <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                      value="tab-1"
                      className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Sales
                    </TabsTrigger>
                    <TabsTrigger
                      value="tab-2"
                      className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Orders
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab-1">
                    <LineChart
                      width={500}
                      height={300}
                      data={data}
                      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                      <CartesianGrid stroke="#aaa" strokeDasharray="2 2" />
                      <Line
                        type="monotone"
                        dataKey="uv"
                        stroke="purple"
                        strokeWidth={2}
                        name="Sales"
                      />
                      <XAxis dataKey="name" />
                      <YAxis
                        width="auto"
                        label={{
                          value: "Sales",
                          position: "insideLeft",
                          angle: -90,
                        }}
                      />
                      <Legend align="right" />
                      <Tooltip />
                    </LineChart>
                  </TabsContent>
                  <TabsContent value="tab-2">
                    <LineChart
                      width={500}
                      height={300}
                      data={data}
                      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                      <CartesianGrid stroke="#aaa" strokeDasharray="2 2" />
                      <Line
                        type="monotone"
                        dataKey="uv"
                        stroke="purple"
                        strokeWidth={2}
                        name="Sales"
                      />
                      <XAxis dataKey="name" />
                      <YAxis
                        width="auto"
                        label={{
                          value: "Sales",
                          position: "insideLeft",
                          angle: -90,
                        }}
                      />
                      <Legend align="right" />
                      <Tooltip />
                    </LineChart>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          <div className="bg-white border border-0 w-full h-[300px] p-4 rounded ">
            <ResponsiveContainer width="100%" height="100%" className="">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Home;
