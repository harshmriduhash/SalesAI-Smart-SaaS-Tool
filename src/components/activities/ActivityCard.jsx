// src/components/activities/ActivityCard.jsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CalendarDays,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  Users,
  Info,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle // Using XCircle for "Mark Pending" for visual clarity
} from 'lucide-react';
import moment from 'moment';

const ActivityCard = ({ activity, lead, onEdit, onDelete, onToggleComplete }) => {
  if (!activity) return null;

  const getIconForActivityType = (type) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'demo': return <Info className="h-4 w-4" />;
      case 'follow_up': return <CalendarDays className="h-4 w-4" />;
      case 'note': return <MessageSquare className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formattedDate = activity.scheduled_date
    ? moment(activity.scheduled_date).format('MMM DD, YYYY hh:mm A')
    : 'No date scheduled';

  const activityTypeName = activity.type ? activity.type.replace(/_/g, ' ') : 'N/A';

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden bg-purple-900/40 border border-purple-700 text-white"> 
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-purple-800/60 border-b border-purple-700"> 
        <div className="flex items-center space-x-2">
          {getIconForActivityType(activity.type)}
          <CardTitle className="text-lg font-semibold text-white">{activity.subject}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-purple-500 text-purple-200">{activityTypeName}</Badge>
          {activity.priority && (
            <Badge className={getPriorityBadgeColor(activity.priority)}>{activity.priority}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {lead && (
          <CardDescription className="text-sm text-gray-300 mb-2"> {/* <--- Adjusted text color */}
            {lead.name} {lead.company ? `• ${lead.company}` : ''}
          </CardDescription>
        )}
        <p className="text-gray-200 mb-4">{activity.description || 'No description provided.'}</p> 
        
        <div className="flex items-center text-sm text-gray-400 space-x-2 mb-4">
          <CalendarDays className="h-4 w-4" />
          <span>{formattedDate}</span>
          {activity.duration && (
            <>
              <Clock className="h-4 w-4 ml-4" />
              <span>{activity.duration} mins</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 space-x-2">
          {/* MARK COMPLETE/PENDING BUTTON */}
          <Button
            onClick={() => onToggleComplete(activity._id, !activity.completed)}
            className={`flex-1 ${activity.completed ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'}`} 
          >
            {activity.completed ? (
              <XCircle className="h-4 w-4 mr-2" /> // Icon for pending
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" /> // Icon for complete
            )}
            {activity.completed ? 'Mark Pending' : 'Mark Complete'}
          </Button>

          <Button
            onClick={() => onEdit(activity)}
            variant="outline"
            size="icon"
            className="text-blue-400 hover:bg-blue-900 border-blue-500" 
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDelete(activity._id)}
            variant="destructive"
            size="icon"
            className="bg-red-600 hover:bg-red-700" 
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;            