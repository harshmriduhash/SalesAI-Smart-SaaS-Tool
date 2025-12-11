import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({ title, value, icon: Icon, trend, trendUp, bgColor }) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <div className={`absolute inset-0 bg-gradient-to-r ${bgColor} opacity-5`} />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${bgColor} bg-opacity-10`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <Badge variant="secondary" className={`text-xs ${trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {trend}
            </Badge>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}