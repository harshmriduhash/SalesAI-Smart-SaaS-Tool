import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Star, ArrowRight, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

export default function TopLeads({ leads, isLoading }) {
  const getTopLeads = () => {
    return leads
      .filter(lead => lead.lead_score > 0)
      .sort((a, b) => (b.lead_score || 0) - (a.lead_score || 0))
      .slice(0, 5);
  };

  const topLeads = getTopLeads();

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Top Priority Leads
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">AI-scored highest potential prospects</p>
          </div>
          <Sparkles className="w-5 h-5 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {topLeads.map((lead) => (
              <div key={lead._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {lead.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{lead.name}</p>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <p className="text-sm text-slate-600 truncate">{lead.company}</p>
                  </div>
                </div>
                <Badge className={`text-xs font-bold ${getScoreColor(lead.lead_score)}`}>
                  {lead.lead_score}
                </Badge>
                <Link to={`/leads/${lead._id}`}>
                  <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
            {topLeads.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No scored leads yet</p>
                <p className="text-sm">AI insights will appear as you add leads</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
