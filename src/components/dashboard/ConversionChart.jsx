import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Import CardDescription
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"; // Changed to LineChart
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

export default function ConversionChart({ leads, isLoading }) {
  // Process leads data to create a conversion trend
  // This is a simplified example; actual data processing would be more complex
  const processConversionData = (leads) => {
    if (!leads || leads.length === 0) return [];

    const monthlyData = {};
    leads.forEach(lead => {
      const date = new Date(lead.createdAt); // Assuming `createdAt` from backend
      const monthYear = format(date, 'MMM yy'); // e.g., 'Jan 24'

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { leads: 0, closedWon: 0 };
      }
      monthlyData[monthYear].leads += 1;
      if (lead.status === 'closed_won') {
        monthlyData[monthYear].closedWon += 1;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const dateA = new Date(`01 ${monthA} ${yearA}`);
      const dateB = new Date(`01 ${monthB} ${yearB}`);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedMonths.map(monthYear => {
      const monthStats = monthlyData[monthYear];
      const conversionRate = monthStats.leads > 0 ? (monthStats.closedWon / monthStats.leads) * 100 : 0;
      return { name: monthYear, 'Conversion Rate': parseFloat(conversionRate.toFixed(1)) };
    });
  };

  const chartData = processConversionData(leads);

  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl text-white">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white">Conversion Trends</CardTitle>
            <CardDescription className="text-sm text-gray-300 mt-1">Monthly lead conversion performance</CardDescription>
          </div>
          {/* Mock growth, replace with actual trend calculation */}
          <div className="flex items-center gap-2 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+18% growth</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="h-64 space-y-4"> {/* Adjusted height for consistency */}
            <Skeleton className="h-full w-full bg-white/10" />
          </div>
        ) : (
          <div className="h-64"> {/* Adjusted height */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => `${value}%`}
                />
                <Line
                  type="monotone"
                  dataKey="Conversion Rate"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  fill="url(#conversionGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}