"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, DollarSign, Calendar, MapPin, User, CheckCircle, Search, Filter, Eye } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface Task {
  task_id: number;
  title: string;
  category_name: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  location_name: string;
  queries: string;
  preferred_date_start: string;
  preferred_date_end: string;
  created_at: string;
  estimated_budget: number | null;
  answers: Array<{
    question: string;
    answer: string;
  }>;
}

export default function AdminBudgetManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [budgetValues, setBudgetValues] = useState<{ [key: number]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchTasksWithoutBudget();
  }, []);

  const fetchTasksWithoutBudget = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/tasks-without-budget');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetChange = (taskId: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    setBudgetValues(prev => ({
      ...prev,
      [taskId]: cleanValue
    }));
  };

  const handleSetBudget = async (taskId: number) => {
    const budgetAmount = budgetValues[taskId];
    
    if (!budgetAmount || Number(budgetAmount) <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    setProcessing(taskId);
    try {
      const response = await axios.patch(`/api/admin/individual-task-budgetupdate/${taskId}`, {
        estimated_budget: Number(budgetAmount)
      });

      if (response.data.success) {
        toast.success('Budget set successfully! Task is now visible to professionals.');
        
        // Remove the budget value for this task
        setBudgetValues(prev => {
          const newValues = { ...prev };
          delete newValues[taskId];
          return newValues;
        });
        
        setSelectedTask(null);
        setShowDetailsModal(false);
        
        // Refresh the task list
        fetchTasksWithoutBudget();
      }
    } catch (error: any) {
      console.error('Error setting budget:', error);
      toast.error(error.response?.data?.message || 'Failed to set budget');
    } finally {
      setProcessing(null);
    }
  };

  const openDetailsModal = (task: Task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.category_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || task.category_name === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(tasks.map(t => t.category_name))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tasks Without Budget
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and set estimated budgets for customer requests
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by title, customer, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="sm:w-64 relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{tasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{filteredTasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Filtered Results</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{categories.length - 1}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {searchTerm || filterCategory !== 'all' 
                ? 'No tasks match your filters' 
                : 'No tasks without budget found'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.task_id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Section - Task Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {task.title}
                        </h3>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {task.category_name}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {task.customer_name}
                          </p>
                          <p className="text-sm">{task.customer_email}</p>
                          {task.phone && <p className="text-sm">{task.phone}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{task.location_name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">
                          {formatDate(task.preferred_date_start)} - {formatDate(task.preferred_date_end)}
                        </span>
                      </div>

                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        Posted: {formatDate(task.created_at)}
                      </div>
                    </div>

                    {task.queries && (
                      <div className="mb-4">
                        <Label className="text-sm font-semibold mb-1 block">Customer Queries:</Label>
                        <p className="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-slate-800 p-3 rounded-lg line-clamp-3">
                          {task.queries}
                        </p>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailsModal(task)}
                      className="mt-2"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Details
                    </Button>
                  </div>

                  {/* Right Section - Budget Input */}
                  <div className="lg:w-80 border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg">
                      <Label className="text-sm font-semibold mb-3 block">
                        Set Estimated Budget
                      </Label>
                      
                      <div className="relative mb-3">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                          A$
                        </span>
                        <Input
                          type="text"
                          placeholder="Enter amount"
                          value={budgetValues[task.task_id] || ''}
                          onChange={(e) => handleBudgetChange(task.task_id, e.target.value)}
                          className="pl-10"
                          disabled={processing === task.task_id}
                        />
                      </div>

                      <Button
                        onClick={() => handleSetBudget(task.task_id)}
                        disabled={processing === task.task_id || !budgetValues[task.task_id]}
                        className="w-full bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-semibold"
                      >
                        {processing === task.task_id ? (
                          <>
                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Set Budget & Publish
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
                        This will make the task visible to professionals
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedTask?.title}</DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-6">
              <div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {selectedTask.category_name}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Customer</Label>
                  <p className="text-gray-900 dark:text-white">{selectedTask.customer_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTask.customer_email}</p>
                  {selectedTask.phone && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTask.phone}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-semibold">Location</Label>
                  <p className="text-gray-900 dark:text-white">{selectedTask.location_name}</p>
                </div>

                <div>
                  <Label className="text-sm font-semibold">Preferred Dates</Label>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(selectedTask.preferred_date_start)} - {formatDate(selectedTask.preferred_date_end)}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-semibold">Posted Date</Label>
                  <p className="text-gray-900 dark:text-white">{formatDate(selectedTask.created_at)}</p>
                </div>
              </div>

              {selectedTask.queries && (
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Customer Queries</Label>
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedTask.queries}</p>
                  </div>
                </div>
              )}

              {selectedTask.answers && selectedTask.answers.length > 0 && (
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Question Answers</Label>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedTask.answers.map((qa, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                          {qa.question}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <Label className="text-sm font-semibold mb-3 block">Set Estimated Budget</Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      A$
                    </span>
                    <Input
                      type="text"
                      placeholder="Enter budget amount"
                      value={budgetValues[selectedTask.task_id] || ''}
                      onChange={(e) => handleBudgetChange(selectedTask.task_id, e.target.value)}
                      className="pl-10"
                      disabled={processing === selectedTask.task_id}
                    />
                  </div>
                  <Button
                    onClick={() => handleSetBudget(selectedTask.task_id)}
                    disabled={processing === selectedTask.task_id || !budgetValues[selectedTask.task_id]}
                    className="bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-semibold px-6"
                  >
                    {processing === selectedTask.task_id ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Set & Publish
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Once set, this task will be visible to all relevant professionals
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}