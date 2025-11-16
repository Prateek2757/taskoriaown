"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import TasksList from "@/components/CustomerTaskList";
import NewRequestModal from "@/components/leads/RequestModal";
import { useTasks } from "@/hooks/useTasks";

interface Task {
  task_id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  budget_min: number | null;
  budget_max: number | null;
}

export default function CustomerDashboard() {
  const [openModal, setOpenModal] = useState(false);
  const {tasks : TaskFromHook} = useTasks();
const tasks=TaskFromHook ?? []

  const serviceCategories = [
    { title: "Accounting & Tax", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop" },
    { title: "Business Services", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop" },
    { title: "Marketing & Design", image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=300&fit=crop" },
    { title: "Administrative", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=300&fit=crop" },
  ];

  if (tasks === null) {
    return <p className="text-center text-gray-500 mt-10">Loading your dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40">
      <main className="container mx-auto px-4 sm:px-6 py-12 space-y-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
              Your Requests
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage and create new service requests with ease.
            </p>
          </div>

          <Button
            onClick={() => setOpenModal(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 rounded-xl"
          >
            <PlusCircle className="w-4 h-4" />
            Place New Request
          </Button>
        </div>

        <NewRequestModal open={openModal} onClose={() => setOpenModal(false)} />

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-16 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm">
              <CardContent className="py-16 text-center space-y-6 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground">
                  Find services for your business on{" "}
                  <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
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
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-md hover:shadow-lg transition-all rounded-xl mt-4"
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
            <TasksList tasks={tasks}   />
          </motion.div>
        )}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              You may also need
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-2 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 hover:text-white transition-all">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-2 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 hover:text-white transition-all">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 shadow-sm hover:shadow-lg transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-semibold text-white drop-shadow-sm">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}