// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Link from "next/link";
// import { ArrowLeft, Award, TrendingUp } from "lucide-react";
// import { CommunityForum } from "@/components/community/CommunityForum";
// import { AIQuoteGenerator } from "@/components/AIQuoteGenerator";

// const contributors = [
//   { name: "Sarah Johnson", points: 2840, badge: "Design Expert" },
//   { name: "Mike Rodriguez", points: 2156, badge: "Business Mentor" },
//   { name: "Jennifer Liu", points: 1923, badge: "Tech Innovator" },
// ];

// const trendingTopics = [
//   { topic: "Sustainable Materials", posts: 23 },
//   { topic: "AI in Service Delivery", posts: 18 },
//   { topic: "Client Communication", posts: 15 },
//   { topic: "Pricing Strategies", posts: 12 },
// ];

// export default function Community() {
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
//       {/* Header */}

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         {/* Back Button */}
//         <div className="mb-6">
//           <Button variant="ghost" asChild className="mb-4">
//             <Link href="/">
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Home
//             </Link>
//           </Button>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Forum Section */}
//           <div className="lg:col-span-2">
//             <CommunityForum />
//           </div>

//           {/* Sidebar */}
//           <aside className="space-y-6">
//             {/* AI Quote Generator */}
//             <AIQuoteGenerator />

//             {/* Top Contributors */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Award className="w-5 h-5 text-yellow-500" />
//                   Top Contributors
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {contributors.map((contributor, index) => (
//                   <div key={contributor.name} className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                       {index + 1}
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-medium">{contributor.name}</p>
//                       <p className="text-sm text-gray-500">{contributor.points} points</p>
//                     </div>
//                     <div className="text-right">
//                       <span className="text-xs text-blue-600 font-medium">{contributor.badge}</span>
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             {/* Trending Topics */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <TrendingUp className="w-5 h-5 text-cyan-500" />
//                   Trending Topics
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {trendingTopics.map((trend) => (
//                   <div
//                     key={trend.topic}
//                     className="flex justify-between items-center"
//                   >
//                     <span className="text-sm font-medium">{trend.topic}</span>
//                     <span className="text-xs text-gray-500">{trend.posts} posts</span>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// }
"use client";

import LocationSearch from "@/components/Location/locationsearch";

export default function PostJobPage() {
  const location = (loc: string) => {
    console.log("Selected location:", loc);
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Where is your service needed?</h2>
      <LocationSearch
        onSelect={(location) => {
          console.log("Selected Location:", location);
        }}
      />
    </div>
  );
}
