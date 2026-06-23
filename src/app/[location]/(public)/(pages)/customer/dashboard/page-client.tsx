"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import NewRequestModal from "@/components/leads/RequestModal";
import { useTasks } from "@/hooks/useTasks";
import Image from "next/image";
import TasksList from "@/components/tasklistcustomer/TasksList";
import PageSkeleton from "@/components/skeleton/PageSkeleton";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const [openModal, setOpenModal] = useState(false);
  const { tasks: TaskFromHook, loading } = useTasks();
  const router = useRouter();
  const tasks = TaskFromHook ?? [];

  const serviceCategories = [
    {
      title: "Accounting & Tax",
      image: "/images/services/accounting-taxation.svg",
      href: "/services/accounting-taxation",
    },
    {
      title: "Plumbers",
      image: "/images/services/plumbers.svg",
      href: "/services/plumbers",
    },
    {
      title: "Painters",
      image: "/images/services/painters.svg",
      href: "/services/painters",
    },
    {
      title: "Electricians",
      image: "/images/services/electricians.svg",
      href: "/services/electricians",
    },
  ];

  if (loading) {
    return (
      <>
        <PageSkeleton />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-[#2563EB] dark:text-slate-50 sm:text-4xl">
              Your Requests
            </h1>
            <p className="text-sm font-medium text-slate-500 sm:text-base">
              Manage and create new service requests with ease.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setOpenModal(true)}
              className="h-10 rounded-xl bg-blue-600 px-5 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4" />
              Place New Request
            </Button>
            {/* <Button
              variant="outline"
              size="icon"
              className="relative h-12 w-12 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <Bell className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {tasks.reduce((sum, task) => sum + (task.response_count ?? 0), 0)}
              </span>
            </Button> */}
          </div>
        </div>

        <NewRequestModal open={openModal} onClose={() => setOpenModal(false)} />

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-12 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all dark:border-slate-800 dark:bg-slate-950">
              <CardContent className="py-16 text-center space-y-6 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground">
                  Find services for your business on{" "}
                  <span className="text-blue-600">
                    Taskoria
                  </span>
                </h2>
                <p className="text-muted-foreground">
                  Most businesses could be getting a better deal on the services
                  they use day to day.
                </p>
                <p className="text-muted-foreground">
                  We’ve got thousands of verified suppliers ready and waiting to
                  quote for your needs.
                </p>
                <p className="text-muted-foreground">
                  From web designers to accountants — all in one place.
                </p>

                <Button
                  onClick={() => setOpenModal(true)}
                  className="mt-4 rounded-xl bg-blue-600 font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TasksList tasks={tasks} onNewRequest={() => setOpenModal(true)} />
          </motion.div>
        )}
        {/* <section className="mt-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              You may also need
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category) => (
              <button
                key={category.href}
                className="text-left"
                onClick={() => router.push(`${category.href}`)}
              >
                <Card className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                  <div className="relative h-44 overflow-hidden bg-slate-50 dark:bg-slate-900">
                    <Image
                      fill
                      title="category images"
                      src={category.image}
                      alt={category.title}
                      className="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-slate-950 dark:text-slate-50">
                      {category.title}
                    </h3>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </section> */}
        
      </main>
    </div>
  );
}
