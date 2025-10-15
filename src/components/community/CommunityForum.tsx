"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ForumPost } from "./ForumPost";

const forumPosts = [
  {
    id: 1,
    title: "Best practices for eco-friendly interior design",
    author: "Sarah Johnson",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b12b2134?w=40&h=40&fit=crop&crop=face",
    category: "Interior Design",
    replies: 12,
    likes: 34,
    timeAgo: "2 hours ago",
    preview:
      "I've been focusing on sustainable materials and energy-efficient solutions...",
    badges: ["Top Contributor", "Eco-Friendly"],
  },
  {
    id: 2,
    title: "How to handle difficult client expectations",
    author: "Mike R.",
    authorAvatar: null,
    category: "Business Tips",
    replies: 8,
    likes: 23,
    timeAgo: "4 hours ago",
    preview:
      "Managing client expectations is crucial for project success. Here are my top strategies...",
    badges: ["Veteran Provider"],
  },
  {
    id: 3,
    title: "New AI tools for project estimation",
    author: "Jennifer L.",
    authorAvatar: null,
    category: "Technology",
    replies: 15,
    likes: 45,
    timeAgo: "1 day ago",
    preview:
      "I've been experimenting with AI-powered estimation tools and the results are impressive...",
    badges: ["Tech Expert", "Innovation Leader"],
  },
];

export function CommunityForum() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Interior Design",
    "Business Tips",
    "Technology",
    "Plumbing",
    "Electrical",
  ];

  const filteredPosts =
    selectedCategory === "All"
      ? forumPosts
      : forumPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Forum</h2>
          <p className="text-gray-600">
            Share knowledge and connect with fellow professionals
          </p>
        </div>
        <Button>Start Discussion</Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Forum Posts */}
      <div className="grid gap-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <ForumPost key={post.id} post={post} />)
        ) : (
          <p className="text-gray-500 text-sm">No posts in this category.</p>
        )}
      </div>
    </div>
  );
}