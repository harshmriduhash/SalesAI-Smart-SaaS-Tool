// // import React, { useState } from "react";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button";
// // import { Building2, Mail, Phone, ArrowRight, Star } from "lucide-react"; // Removed Sparkles
// // import { Link } from "react-router-dom";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import { ChevronDown } from "lucide-react";
// // import { Lead } from "@/entities/all";
// // import { useUpdateLead } from "@/hooks/useLeads"; // Import useUpdateLead

// // const statusColors = {
// //   'new': 'bg-slate-100 text-slate-700 border-slate-300',
// //   'contacted': 'bg-blue-100 text-blue-700 border-blue-300',
// //   'qualified': 'bg-purple-100 text-purple-700 border-purple-300',
// //   'proposal': 'bg-orange-100 text-orange-700 border-orange-300',
// //   'negotiation': 'bg-yellow-100 text-yellow-700 border-yellow-300',
// //   'closed_won': 'bg-green-100 text-green-700 border-green-300',
// //   'closed_lost': 'bg-red-100 text-red-700 border-red-300'
// // };

// // const getScoreColor = (score) => {
// //   if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
// //   if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
// //   return 'text-red-600 bg-red-50 border-red-200';
// // };

// // export default function LeadCard({ lead, onUpdate }) { // Removed onGenerateInsights, isGeneratingInsights
// //   const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
// //   const { mutateAsync: updateLead } = useUpdateLead(); // Use the mutation hook

// //   const handleStatusChange = async (newStatus) => {
// //     setIsUpdatingStatus(true);
// //     try {
// //       await updateLead({ id: lead._id, data: { status: newStatus } });
// //       onUpdate && onUpdate(); // Trigger refetch in parent
// //     } catch (error) {
// //       console.error("Error updating status:", error);
// //       alert("Failed to update status");
// //     } finally {
// //       setIsUpdatingStatus(false);
// //     }
// //   };

// //   const statusOptions = [
// //     { value: 'new', label: 'New' },
// //     { value: 'contacted', label: 'Contacted' },
// //     { value: 'qualified', label: 'Qualified' },
// //     { value: 'proposal', label: 'Proposal' },
// //     { value: 'negotiation', label: 'Negotiation' },
// //     { value: 'closed_won', label: 'Closed Won' },
// //     { value: 'closed_lost', label: 'Closed Lost' }
// //   ];

// //   // AI insights parsing logic is no longer needed since we are not showing the button/insights.
// //   // We can keep it if the backend still *sends* ai_insights and you want to display it somewhere else later,
// //   // but for demo simplicity, we can ignore it for now.
// //   // let aiInsights = null;
// //   // if (lead.ai_insights) {
// //   //   try {
// //   //     aiInsights = typeof lead.ai_insights === 'string'
// //   //       ? JSON.parse(lead.ai_insights)
// //   //       : lead.ai_insights;
// //   //   } catch {
// //   //     aiInsights = null;
// //   //   }
// //   // }

// //   return (
// //     <Card className="shadow-sm hover:shadow-lg transition-all duration-300 border-0 hover:scale-[1.02]">
// //       <CardContent className="p-6">
// //         <div className="flex items-start justify-between mb-4">
// //           <div className="flex-1">
// //             <h3 className="text-lg font-bold text-slate-900 mb-1">{lead.name}</h3>
// //             <p className="text-sm text-slate-600">{lead.position} at {lead.company}</p>
// //           </div>
// //           {lead.lead_score > 0 && (
// //             <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${getScoreColor(lead.lead_score)}`}>
// //               <Star className="w-3 h-3" />
// //               <span className="text-sm font-bold">{lead.lead_score}</span>
// //             </div>
// //           )}
// //         </div>

// //         <div className="space-y-2 mb-4">
// //           <div className="flex items-center gap-2 text-sm text-slate-600">
// //             <Mail className="w-4 h-4" />
// //             <span className="truncate">{lead.email}</span>
// //           </div>
// //           {lead.phone && (
// //             <div className="flex items-center gap-2 text-sm text-slate-600">
// //               <Phone className="w-4 h-4" />
// //               <span>{lead.phone}</span>
// //             </div>
// //           )}
// //           <div className="flex items-center gap-2 text-sm text-slate-600">
// //             <Building2 className="w-4 h-4" />
// //             <span>{lead.industry || 'Not specified'}</span>
// //           </div>
// //         </div>

// //         <div className="flex items-center justify-between mb-4">
// //           <DropdownMenu>
// //             <DropdownMenuTrigger asChild>
// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 className={`${statusColors[lead.status]} border`}
// //                 disabled={isUpdatingStatus}
// //               >
// //                 {lead.status.replace('_', ' ').toUpperCase()}
// //                 <ChevronDown className="w-3 h-3 ml-2" />
// //               </Button>
// //             </DropdownMenuTrigger>
// //             <DropdownMenuContent>
// //               {statusOptions.map(option => (
// //                 <DropdownMenuItem
// //                   key={option.value}
// //                   onClick={() => handleStatusChange(option.value)}
// //                   className={lead.status === option.value ? 'bg-slate-100' : ''}
// //                 >
// //                   {option.label}
// //                 </DropdownMenuItem>
// //               ))}
// //             </DropdownMenuContent>
// //           </DropdownMenu>

// //           {lead.estimated_value > 0 && (
// //             <span className="text-sm font-semibold text-green-600">
// //               ${lead.estimated_value.toLocaleString()}
// //             </span>
// //           )}
// //         </div>

// //         <div className="flex gap-2">
// //           {/* ❌ REMOVED: AI Insights Button */}
// //           {/*
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={onGenerateInsights}
// //             disabled={isGeneratingInsights}
// //             className="flex-1"
// //           >
// //             {isGeneratingInsights ? (
// //               <>
// //                 <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
// //                 Analyzing...
// //               </>
// //             ) : (
// //               <>
// //                 <Sparkles className="w-4 h-4 mr-2" />
// //                 AI Insights
// //               </>
// //             )}
// //           </Button>
// //           */}
// //           <Link to={`/leads/${lead._id}`} className="flex-1">
// //             <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full"> {/* Made full width if AI button is removed */}
// //               <ArrowRight className="w-4 h-4" /> View Details
// //             </Button>
// //           </Link>
// //         </div>

// //         {/* ❌ REMOVED: AI Insights Display */}
// //         {/*
// //         {aiInsights && aiInsights.summary && (
// //           <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
// //             <div className="flex items-start gap-2">
// //               <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
// //               <p className="text-sm text-blue-900 line-clamp-3">{aiInsights.summary}</p>
// //             </div>
// //           </div>
// //         )}
// //         */}
// //       </CardContent>
// //     </Card>
// //   );
// // }

// import React, { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Building2, Mail, Phone, ArrowRight, Star } from "lucide-react";
// import { Link } from "react-router-dom";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDown } from "lucide-react";
// import { LeadAPI } from "@/entities/all";
// import { useUpdateLead } from "@/hooks/useLeads";

// const statusColors = {
//   'new': 'bg-slate-100 text-slate-700 border-slate-300',
//   'contacted': 'bg-blue-100 text-blue-700 border-blue-300',
//   'qualified': 'bg-purple-100 text-purple-700 border-purple-300',
//   'proposal': 'bg-orange-100 text-orange-700 border-orange-300',
//   'negotiation': 'bg-yellow-100 text-yellow-700 border-yellow-300',
//   'closed_won': 'bg-green-100 text-green-700 border-green-300',
//   'closed_lost': 'bg-red-100 text-red-700 border-red-300'
// };

// const getScoreColor = (score) => {
//   if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
//   if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
//   return 'text-red-600 bg-red-50 border-red-200';
// };

// export default function LeadCard({ lead, onUpdate }) {
//   const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
//   const { mutateAsync: updateLead } = useUpdateLead();

//   const handleStatusChange = async (newStatus) => {
//     setIsUpdatingStatus(true);
//     try {
//       await updateLead({ id: lead._id, data: { status: newStatus } });
//       onUpdate && onUpdate();
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert("Failed to update status");
//     } finally {
//       setIsUpdatingStatus(false);
//     }
//   };

//   const statusOptions = [
//     { value: 'new', label: 'New' },
//     { value: 'contacted', label: 'Contacted' },
//     { value: 'qualified', label: 'Qualified' },
//     { value: 'proposal', label: 'Proposal' },
//     { value: 'negotiation', label: 'Negotiation' },
//     { value: 'closed_won', label: 'Closed Won' },
//     { value: 'closed_lost', label: 'Closed Lost' }
//   ];

//   return (
//     <Card className="shadow-sm hover:shadow-lg transition-all duration-300 border-0 hover:scale-[1.02]">
//       <CardContent className="p-6">
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex-1">
//             <h3 className="text-lg font-bold text-slate-900 mb-1">{lead.name}</h3>
//             <p className="text-sm text-slate-600">{lead.position} at {lead.company}</p>
//           </div>
//           {lead.lead_score > 0 && (
//             <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${getScoreColor(lead.lead_score)}`}>
//               <Star className="w-3 h-3" />
//               <span className="text-sm font-bold">{lead.lead_score}</span>
//             </div>
//           )}
//         </div>

//         <div className="space-y-2 mb-4">
//           <div className="flex items-center gap-2 text-sm text-slate-600">
//             <Mail className="w-4 h-4" />
//             <span className="truncate">{lead.email}</span>
//           </div>
//           {lead.phone && (
//             <div className="flex items-center gap-2 text-sm text-slate-600">
//               <Phone className="w-4 h-4" />
//               <span>{lead.phone}</span>
//             </div>
//           )}
//           <div className="flex items-center gap-2 text-sm text-slate-600">
//             <Building2 className="w-4 h-4" />
//             <span>{lead.industry || 'Not specified'}</span>
//           </div>
//         </div>

//         <div className="flex items-center justify-between mb-4">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className={`${statusColors[lead.status]} border`}
//                 disabled={isUpdatingStatus}
//               >
//                 {lead.status.replace('_', ' ').toUpperCase()}
//                 <ChevronDown className="w-3 h-3 ml-2" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               {statusOptions.map(option => (
//                 <DropdownMenuItem
//                   key={option.value}
//                   onClick={() => handleStatusChange(option.value)}
//                   className={lead.status === option.value ? 'bg-slate-100' : ''}
//                 >
//                   {option.label}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {lead.estimated_value > 0 && (
//             <span className="text-sm font-semibold text-green-600">
//               ${lead.estimated_value.toLocaleString()}
//             </span>
//           )}
//         </div>

//         <div className="flex gap-2">
//           <Link to={`/leads/${lead._id}`} className="flex-1">
//             <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full">
//               <ArrowRight className="w-4 h-4" /> View Details
//             </Button>
//           </Link>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
//import { Link } from 'react-router-dom'; 
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, ArrowRight, Star, Loader2, Trash2 } from "lucide-react"; // Import Loader2, Trash2
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useUpdateLead } from "@/hooks/useLeads"; // Use hook
import { toast } from "react-hot-toast"; // Import toast

const statusColors = {
  'new': 'bg-blue-600',
  'contacted': 'bg-yellow-600',
  'qualified': 'bg-purple-600',
  'proposal': 'bg-orange-600',
  'negotiation': 'bg-emerald-600',
  'closed_won': 'bg-green-600',
  'closed_lost': 'bg-red-600'
};

const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-400 bg-green-900/30 border-green-500/30';
  if (score >= 60) return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30';
  return 'text-red-400 bg-red-900/30 border-red-500/30';
};

export default function LeadCard({ lead, onUpdate, onDelete }) { // Pass onDelete
  const { mutate: updateLead, isLoading: isUpdatingLead } = useUpdateLead();

  const handleStatusChange = async (newStatus) => {
    if (newStatus === lead.status) return; // No change needed
    updateLead({ id: lead._id, updatedLead: { status: newStatus } }, {
      onSuccess: () => {
        toast.success(`Lead status updated to ${newStatus.replace('_', ' ')}.`);
        onUpdate && onUpdate();
      },
      onError: (err) => {
        console.error("Error updating status:", err);
        toast.error(`Failed to update status: ${err.message || 'Unknown error'}`);
      }
    });
  };

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' }
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{lead.name}</h3>
            <p className="text-sm text-gray-300">{lead.position || 'No Position'} at {lead.company || 'No Company'}</p>
          </div>
          {lead.lead_score > 0 && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${getScoreColor(lead.lead_score)}`}>
              <Star className="w-3 h-3" />
              <span className="text-sm font-bold">{lead.lead_score}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Mail className="w-4 h-4" />
            <span className="truncate">{lead.email}</span>
          </div>
          {lead.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Phone className="w-4 h-4" />
              <span>{lead.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Building2 className="w-4 h-4" />
            <span>{lead.industry || 'Not specified'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`text-white capitalize border-white/20 ${statusColors[lead.status]}`}
                disabled={isUpdatingLead}
              >
                {lead.status.replace('_', ' ')}
                {isUpdatingLead ? <Loader2 className="w-3 h-3 ml-2 animate-spin" /> : <ChevronDown className="w-3 h-3 ml-2" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 text-white border-gray-700">
              {statusOptions.map(option => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`capitalize ${lead.status === option.value ? 'bg-gray-700' : ''}`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {lead.estimated_value > 0 && (
            <span className="text-sm font-semibold text-green-400">
              ${lead.estimated_value.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Link to={`/leads/${lead._id}`} className="flex-1">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white w-full">
              <ArrowRight className="w-4 h-4 mr-2" /> View Details
            </Button>
          </Link>
          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(lead._id); }} // Prevent Link navigation
              className="bg-red-600/30 hover:bg-red-700/50 text-white border-red-500/30"
              disabled={isUpdatingLead}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}