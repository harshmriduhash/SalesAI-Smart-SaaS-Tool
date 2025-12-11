import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

const statusColors = {
  'new': 'bg-slate-500',
  'contacted': 'bg-blue-500',
  'qualified': 'bg-purple-500',
  'proposal': 'bg-orange-500',
  'negotiation': 'bg-yellow-500',
  'closed_won': 'bg-green-500',
  'closed_lost': 'bg-red-500'
};

export default function LeadPipeline({ leads, isLoading }) {
  const pipelineStats = [
    { status: 'new', label: 'New', count: leads.filter(l => l.status === 'new').length },
    { status: 'contacted', label: 'Contacted', count: leads.filter(l => l.status === 'contacted').length },
    { status: 'qualified', label: 'Qualified', count: leads.filter(l => l.status === 'qualified').length },
    { status: 'proposal', label: 'Proposal', count: leads.filter(l => l.status === 'proposal').length },
    { status: 'negotiation', label: 'Negotiation', count: leads.filter(l => l.status === 'negotiation').length },
    { status: 'closed_won', label: 'Closed Won', count: leads.filter(l => l.status === 'closed_won').length }
  ];

  const total = leads.length;

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Lead Pipeline</CardTitle>
            <p className="text-sm text-slate-600 mt-1">Current distribution across stages</p>
          </div>
          <Users className="w-5 h-5 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {pipelineStats.map((stage) => {
              const percentage = total > 0 ? (stage.count / total * 100).toFixed(1) : 0;
              return (
                <div key={stage.status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{stage.label}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {stage.count}
                      </Badge>
                      <span className="text-slate-500 text-xs">{percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${statusColors[stage.status]} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}