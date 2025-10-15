"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Plus,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
} from "lucide-react";
import Link from "next/link";

// Provider Job Type
interface ProviderJob {
  id: number;
  title: string;
  status: "open" | "in_progress" | "completed";
  budget: string;
  customer: string;
  dueDate: string;
}

// Sample Data
const jobs: ProviderJob[] = [
  {
    id: 1,
    title: "Website Redesign",
    status: "in_progress",
    budget: "$2,500",
    customer: "Alice Johnson",
    dueDate: "2024-02-15",
  },
  {
    id: 2,
    title: "Logo Design",
    status: "completed",
    budget: "$500",
    customer: "Bob Smith",
    dueDate: "2024-01-20",
  },
  {
    id: 3,
    title: "Mobile App Development",
    status: "open",
    budget: "$5,000",
    customer: "Charlie Lee",
    dueDate: "2024-03-01",
  },
];

// Status utilities
const STATUS_BADGES = {
  open: (
    <Badge
      variant="outline"
      className="text-blue-600 border-blue-200 bg-blue-50"
    >
      Open
    </Badge>
  ),
  in_progress: (
    <Badge className="text-orange-600 border-orange-200 bg-orange-50">
      In Progress
    </Badge>
  ),
  completed: (
    <Badge className="text-green-600 border-green-200 bg-green-50">
      Completed
    </Badge>
  ),
};

const STATUS_ICONS = {
  open: <Clock className="w-4 h-4 text-blue-600" />,
  in_progress: <AlertCircle className="w-4 h-4 text-orange-600" />,
  completed: <CheckCircle className="w-4 h-4 text-green-600" />,
};

// Quick Action Buttons
const QuickActions = () => (
  <div className="flex flex-col sm:flex-row gap-4">
    <Button size="lg" className="flex-1" asChild>
      <Link href="/my-jobs">
        <Plus className="w-5 h-5 mr-2" /> Post New Job
      </Link>
    </Button>
    <Button variant="outline" size="lg" className="flex-1" asChild>
      <Link href="/available-jobs">
        <Eye className="w-5 h-5 mr-2" />
        Browse Providers
      </Link>
    </Button>
  </div>
);

// Stats Overview
const StatsOverview = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <StatCard
      label="Active Jobs"
      value="3"
      icon={<Clock className="w-8 h-8 text-blue-600" />}
    />
    <StatCard
      label="Completed"
      value="12"
      icon={<CheckCircle className="w-8 h-8 text-green-600" />}
    />
    <StatCard
      label="Total Spent"
      value="$8,750"
      icon={
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <span className="text-purple-600 font-bold">$</span>
        </div>
      }
    />
    <StatCard
      label="Messages"
      value="5"
      icon={<Bell className="w-8 h-8 text-orange-600" />}
    />
  </div>
);

// Reusable StatCard
const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon}
      </div>
    </CardContent>
  </Card>
);

// Jobs Table
const MyJobs = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>My Jobs</span>
        <Button variant="outline" size="sm" asChild>
          <Link href="/my-jobs">View All</Link>
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              {STATUS_ICONS[job.status]}
              <div>
                <h4 className="font-medium">{job.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Customer: {job.customer}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{job.budget}</p>
                <p className="text-sm text-muted-foreground">
                  Due: {job.dueDate}
                </p>
              </div>
              {STATUS_BADGES[job.status]}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Notifications
const RecentNotifications = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Bell className="w-5 h-5" /> Recent Activity
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Notification
          color="blue"
          text='New job assigned: "Website Redesign"'
          time="2 hours ago"
        />
        <Notification
          color="green"
          text='Job "Logo Design" marked as completed'
          time="1 day ago"
        />
        <Notification
          color="orange"
          text='Payment received for "Mobile App Development"'
          time="3 days ago"
        />
      </div>
    </CardContent>
  </Card>
);

const Notification = ({
  color,
  text,
  time,
}: {
  color: string;
  text: string;
  time: string;
}) => (
  <div className="flex items-start space-x-3">
    <div className={`w-2 h-2 rounded-full mt-2 bg-${color}-600`}></div>
    <div>
      <p className="text-sm">{text}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  </div>
);

// Main Provider Dashboard
export default function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <QuickActions />
      <StatsOverview />
      <MyJobs />
      <RecentNotifications />
    </div>
  );
}
