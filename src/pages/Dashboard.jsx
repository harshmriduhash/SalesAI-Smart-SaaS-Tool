// export default Dashboard;
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useLeads } from '@/hooks/useLeads'; // Removed useLead as it's for single lead
import { useActivities } from '@/hooks/useActivities';
import { ArrowUpRight, DollarSign, Users, Activity, BarChart2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import { format } from 'date-fns'; // Import format for date processing

// Helper component for Glassmorphism Cards
const GlassmorphismCard = ({ children, className = '' }) => (
  <Card className={`bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl ${className}`}>
    {children}
  </Card>
);

const Dashboard = () => {
  const { data: leads, isLoading: loadingLeads, isError: errorLeads } = useLeads();
  const { data: activities, isLoading: loadingActivities, isError: errorActivities } = useActivities();

  // --- Dashboard Data Calculation ---
  const totalLeads = leads?.length || 0;
  const newLeads = leads?.filter(lead => lead.status === 'new').length || 0;
  const closedWonLeads = leads?.filter(lead => lead.status === 'closed_won').length || 0;
  const totalValue = leads?.reduce((sum, lead) => sum + (lead.estimated_value || 0), 0) || 0;

  // Simple conversion rate (Closed Won / Total Leads)
  const conversionRate = totalLeads > 0 ? ((closedWonLeads / totalLeads) * 100).toFixed(1) : 0;

  // Process data for Conversion Trends (dynamic based on leads)
  const getConversionTrendData = (leads) => {
    if (!leads || leads.length === 0) return [];
    const monthlyData = {};
    leads.forEach(lead => {
      const date = new Date(lead.createdAt);
      const monthYear = format(date, 'MMM yy');

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
      const dateA = new Date(`01 ${monthA} 20${yearA}`); // Reconstruct date for proper sorting
      const dateB = new Date(`01 ${monthB} 20${yearB}`);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedMonths.map(monthYear => {
      const monthStats = monthlyData[monthYear];
      const rate = monthStats.leads > 0 ? (monthStats.closedWon / monthStats.leads) * 100 : 0;
      return { name: monthYear, 'Conversion Rate': parseFloat(rate.toFixed(1)) };
    });
  };
  const conversionTrendData = getConversionTrendData(leads);


  // Process data for Sales Pipeline (dynamic based on leads)
  const salesPipelineStages = [
    { status: 'new', label: 'New' },
    { status: 'contacted', label: 'Contacted' },
    { status: 'qualified', label: 'Qualified' },
    { status: 'proposal', label: 'Proposal' },
    { status: 'negotiation', label: 'Negotiation' },
    { status: 'closed_won', label: 'Closed Won' },
  ];
  const salesPipelineData = salesPipelineStages.map(stage => ({
    name: stage.label,
    value: leads?.filter(l => l.status === stage.status).length || 0,
  }));


  const isLoading = loadingLeads || loadingActivities;
  const isError = errorLeads || errorActivities;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent"> {/* Removed gradient from here, now in Layout */}
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent text-red-400 text-lg"> {/* Removed gradient from here */}
        Error loading dashboard data. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-transparent text-white space-y-8"> {/* Removed gradient from here */}
      <h1 className="text-5xl font-extrabold text-center mb-10 drop-shadow-lg">SalesAI Dashboard</h1>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassmorphismCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalLeads}</div>
            <p className="text-xs text-gray-400">+20.1% from last month</p>
          </CardContent>
        </GlassmorphismCard>

        <GlassmorphismCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">New Leads</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{newLeads}</div>
            <p className="text-xs text-gray-400">+180.1% from last month</p>
          </CardContent>
        </GlassmorphismCard>

        <GlassmorphismCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Conversion Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{conversionRate}%</div>
            <p className="text-xs text-gray-400">+5.2% from last month</p>
          </CardContent>
        </GlassmorphismCard>

        <GlassmorphismCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-gray-400">+19% from last month</p>
          </CardContent>
        </GlassmorphismCard>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Trends Chart */}
        <GlassmorphismCard>
          <CardHeader>
            <CardTitle className="text-white">Conversion Trends</CardTitle>
            <CardDescription className="text-gray-300">Monthly lead conversion performance.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" unit="%" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.3)' }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '5px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => `${value}%`}
                />
                <Line type="monotone" dataKey="Conversion Rate" stroke="#8884d8" fill="#8884d8" dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </GlassmorphismCard>

        {/* Sales Pipeline Stages Chart */}
        <GlassmorphismCard>
          <CardHeader>
            <CardTitle className="text-white">Sales Pipeline Stages</CardTitle>
            <CardDescription className="text-gray-300">Current distribution of leads across pipeline stages.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesPipelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '5px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </GlassmorphismCard>
      </div>

      {/* Recent Activities Section */}
      <GlassmorphismCard>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Recent Activities</CardTitle>
          <Link to={createPageUrl('activities')} className="text-sm text-blue-300 hover:underline">View All</Link>
        </CardHeader>
        <CardContent>
          {activities && activities.length > 0 ? (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {activities.slice(0, 5).map((activity) => (
                <li key={activity._id} className="border-b border-white/10 pb-2 last:border-b-0">
                  <p className="text-gray-100 font-medium">{activity.subject}</p>
                  <p className="text-gray-300 text-sm">{activity.description}</p>
                  <p className="text-gray-400 text-xs">
                    {format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')} - {activity.type}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300 text-center">No recent activities.</p>
          )}
        </CardContent>
      </GlassmorphismCard>
    </div>
  );
};

export default Dashboard;