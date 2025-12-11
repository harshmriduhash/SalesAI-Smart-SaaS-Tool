import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, DollarSign, Activity } from "lucide-react";

export default function QuickStats({ leads = [], activities = [] }) {
  const totalLeads = leads.length;
  const activeLeads = leads.filter(lead => 
    ['contacted', 'qualified', 'proposal', 'negotiation'].includes(lead.status)
  ).length;
  const closedWon = leads.filter(lead => lead.status === 'closed_won').length;
  
  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const conversionRate = totalLeads > 0 ? ((closedWon / totalLeads) * 100).toFixed(1) : 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentActivities = activities.filter(activity => {
    const activityDate = new Date(activity.createdAt || activity.scheduled_date);
    return activityDate >= sevenDaysAgo;
  }).length;

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      subtitle: `${activeLeads} active`
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      subtitle: `${closedWon} closed won`
    },
    {
      title: "Pipeline Value",
      value: `$${(totalValue / 1000).toFixed(1)}K`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      subtitle: "Total value"
    },
    {
      title: "Recent Activities",
      value: recentActivities,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      subtitle: "Last 7 days"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-slate-500">{stat.subtitle}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
