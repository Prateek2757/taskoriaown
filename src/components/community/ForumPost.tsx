"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Clock, Users } from "lucide-react";

interface ForumPostProps {
  post: {
    id: number;
    title: string;
    author: string;
    authorAvatar: string | null;
    category: string;
    replies: number;
    likes: number;
    timeAgo: string;
    preview: string;
    badges: string[];
  };
}

export function ForumPost({ post }: ForumPostProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={post.authorAvatar || ""} alt={post.author} />
            <AvatarFallback>
              {post.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            {/* Title + Preview */}
            <div>
              <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{post.preview}</p>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <Badge variant="secondary">{post.category}</Badge>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.timeAgo}</span>
              </div>
            </div>

            {/* Stats + Badges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MessageSquare className="w-4 h-4" />
                <span>{post.replies} replies</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {post.badges.map((badge) => (
                  <Badge key={badge} variant="outline" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}