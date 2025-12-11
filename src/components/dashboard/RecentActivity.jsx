import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Calendar, FileText, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  demo: FileText,
  follow_up: Clock,
  note: FileText
};

const activityColors = {
  call: 'bg-blue-100 text-blue-700',
  email: 'bg-green-100 text-green-700',
  meeting: 'bg-purple-100 text-purple-700',
  demo: 'bg-orange-100 text-orange-700',
  follow_up: 'bg-yellow-100 text-yellow-700',
  note: 'bg-gray-100 text-gray-700'
};

export default function RecentActivity({ activities, isLoading }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-slate-900">Recent Activity</CardTitle>
        <p className="text-sm text-slate-600">Latest interactions with leads</p>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 6).map((activity) => {
              const IconComponent = activityIcons[activity.type] || FileText;
              return (
                <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={`p-2 rounded-full ${activityColors[activity.type] || 'bg-gray-100 text-gray-700'}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate text-sm">{activity.subject}</p>
                    <p className="text-xs text-slate-600">
                      {activity.created_date ? format(new Date(activity.created_date), "MMM d, h:mm a") : 'Pending...'}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              );
            })}
            {activities.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Start engaging with your leads</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}