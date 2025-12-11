// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Brain, Lightbulb } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";
// import { useQuery } from '@tanstack/react-query'; // Assuming react-query is used
// import axios from 'axios';
// import { AuthAPI } from '@/entities/all';

// // Function to fetch AI insight for a single lead
// const fetchAIInsight = async (leadId) => {
//   const token = AuthAPI.getToken();
//   if (!token) throw new Error("No authentication token found.");
//   const response = await axios.post(
//     // Use the LEAD_ID here directly instead of `leadToAnalyze._id` if it's being passed as prop
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

// export default function AIInsightPanel({ leads, activities, isLoading }) {
//   // Select a "random" lead to analyze for the dashboard, or the first one
//   const leadToAnalyze = leads.length > 0 ? leads[0] : null;

//   // Use react-query to fetch AI insight for the selected lead
//   const { data: aiInsight, isLoading: aiLoading, isError, error, refetch } = useQuery(
//     ['aiInsightDashboard', leadToAnalyze?._id], // Query key includes lead ID
//     () => fetchAIInsight(leadToAnalyze._id),
//     {
//       enabled: !!leadToAnalyze && !isLoading, // Only run if a lead exists and dashboard isn't loading
//       staleTime: Infinity, // ✅ Data is always considered fresh, won't refetch automatically
//       cacheTime: Infinity, // ✅ Data stays in cache indefinitely
//       refetchOnWindowFocus: false, // ✅ Don't refetch on window focus
//       refetchOnMount: false, // ✅ Don't refetch when component mounts
//       refetchInterval: false, // ✅ No automatic refetching interval
//       retry: false, // ✅ Don't retry failed requests
//     }
//   );

//   // If there's no lead to analyze, return null or a message
//   if (!leadToAnalyze) {
//     return (
//       <Card className="shadow-sm">
//         <CardHeader className="border-b flex flex-row items-center justify-between">
//           <CardTitle className="text-xl font-bold flex items-center gap-2">
//             <Brain className="w-5 h-5 text-indigo-500" /> AI Insights
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 text-sm text-slate-500">
//           No leads available for AI analysis. Add some leads to get started!
//         </CardContent>
//       </Card>
//     );
//   }

//   // Loading state
//   if (isLoading || aiLoading) {
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

//   // Error state
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

//   // Display insights
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
//             <div>
//               <h3 className="font-semibold text-lg text-slate-800">Summary</h3>
//               <p className="text-sm text-slate-700">{aiInsight.summary}</p>
//             </div>
//             <div>
//               <h3 className="font-semibold text-lg text-slate-800">Next Steps</h3>
//               <ul className="list-disc pl-5 text-sm text-slate-700">
//                 {aiInsight.next_steps?.map((step, index) => (
//                   <li key={index}>{step}</li>
//                 ))}
//               </ul>
//             </div>
//             {aiInsight.risk_factors && aiInsight.risk_factors.length > 0 && (
//               <div>
//                 <h3 className="font-semibold text-lg text-slate-800">Risk Factors</h3>
//                 <ul className="list-disc pl-5 text-sm text-red-600">
//                   {aiInsight.risk_factors?.map((risk, index) => (
//                     <li key={index}>{risk}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             <div className="flex items-center gap-4 text-sm">
//               <p>
//                 <span className="font-medium">Sentiment:</span>{" "}
//                 <span className={aiInsight.sentiment === 'positive' ? 'text-green-600' : aiInsight.sentiment === 'negative' ? 'text-red-600' : 'text-slate-600'}>
//                   {aiInsight.sentiment}
//                 </span>
//               </p>
//               <p>
//                 <span className="font-medium">Confidence:</span> {aiInsight.confidence}
//               </p>
//             </div>
//           </div>
//         ) : (
//           <p className="text-sm text-slate-500">No AI insights available for this lead.</p>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
// This component is intentionally left blank as AI is disabled for the demo.
// It should not be imported or rendered in Dashboard.jsx.
import React from 'react';

export default function AIInsightPanel() {
  return null;
}
