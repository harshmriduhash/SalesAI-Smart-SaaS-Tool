// // src/components/leads/AIInsightsPanel.jsx
// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Sparkles, TrendingUp, AlertTriangle, Target, 
//   MessageSquare, Calendar, DollarSign 
// } from "lucide-react";

// import { useQuery } from '@tanstack/react-query'; // Make sure react-query is imported
// import axios from 'axios';
// import { AuthAPI } from '@/entities/all';

// // Function to fetch AI insight for a single lead
// const fetchLeadAIInsight = async (leadId) => {
//   const token = AuthAPI.getToken();
//   if (!token) throw new Error("No authentication token found.");
//   const response = await axios.post(
//     `/api/ai/analyze-lead/${leadId}`,
//     {},
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return response.data.insight;
// };

// export default function AIInsightsPanel({ leadId }) { // Assuming it takes leadId as prop
//   const { data: aiInsight, isLoading, isError, error, refetch } = useQuery(
//     ['aiLeadInsight', leadId], // Unique query key per lead ID
//     () => fetchLeadAIInsight(leadId),
//     {
//       enabled: !!leadId, // Only fetch if leadId is provided
//       staleTime: Infinity, // ✅ Data is always considered fresh, won't refetch automatically
//       cacheTime: Infinity, // ✅ Data stays in cache indefinitely
//       refetchOnWindowFocus: false, // ✅ Don't refetch on window focus
//       refetchOnMount: false, // ✅ Don't refetch when component mounts
//       refetchInterval: false, // ✅ No automatic refetching interval
//       retry: false, // ✅ Don't retry failed requests
//     }
//   );

//   // ... keep existing code (rendering logic, similar to the dashboard one but adapted for LeadDetail) ...
//   // Make sure to include the loading, error, and display states here, similar to the dashboard component.
//   // Example for loading state:
//   if (isLoading) {
//     return (
//       <Card className="shadow-sm">
//         <CardHeader className="border-b flex flex-row items-center justify-between">
//           <CardTitle className="text-xl font-bold flex items-center gap-2">
//             <Brain className="w-5 h-5 text-indigo-500" /> AI Insights
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           <Skeleton className="h-6 w-3/4 mb-4" />
//           <Skeleton className="h-4 w-full mb-2" />
//           <Skeleton className="h-4 w-11/12 mb-2" />
//           <Skeleton className="h-4 w-5/6" />
//         </CardContent>
//       </Card>
//     );
//   }

//   // Example for error state:
//   if (isError) {
//     return (
//       <Card className="shadow-sm border-red-300 bg-red-50">
//         <CardHeader className="border-b flex flex-row items-center justify-between">
//           <CardTitle className="text-xl font-bold flex items-center gap-2 text-red-700">
//             <Brain className="w-5 h-5 text-red-700" /> AI Insights Error
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 text-sm text-red-700">
//           Failed to load AI insights: {error.message || "An unknown error occurred."}
//           <Button onClick={() => refetch()} className="mt-4" size="sm" variant="outline">Retry</Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Example for actual insight display (if aiInsight is available)
//   return (
//     <Card className="shadow-sm">
//       <CardHeader className="border-b flex flex-row items-center justify-between">
//         <CardTitle className="text-xl font-bold flex items-center gap-2">
//           <Brain className="w-5 h-5 text-indigo-500" /> AI Insights
//         </CardTitle>
//         <Button size="sm" variant="ghost" onClick={() => refetch()} className="flex items-center gap-1">
//           <Lightbulb className="w-4 h-4" /> Refresh
//         </Button>
//       </CardHeader>
//       <CardContent className="p-6">
//         {aiInsight ? (
//           <div className="space-y-4">
//             {/* Display insight details here */}
//             <div>
//               <h3 className="font-semibold text-lg text-slate-800">Summary</h3>
//               <p className="text-sm text-slate-700">{aiInsight.summary}</p>
//             </div>
//             {/* Add other fields like next_steps, risk_factors, sentiment, confidence */}
//           </div>
//         ) : (
//           <p className="text-sm text-slate-500">No AI insights available for this lead.</p>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


// This component is intentionally left blank as AI is disabled for the demo.
// It should not be imported or rendered in LeadDetail.jsx.
import React from 'react';

export default function AIInsightsPanel() {
  return null;
}