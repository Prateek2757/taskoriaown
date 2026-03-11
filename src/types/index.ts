export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'affiliate' | 'admin';
  isVerified: boolean;
  createdAt: Date;
}

export interface TaskAnswer {
  question_id: number;
  question: string;
  answer: string;
}

export interface ProviderResponse {
  response_id: number;
  response_message: string;
  credits_spent: number;
  response_created_at: string;
  task_id: number;
  title: string;
  description: string;
  status: "open" | "In Progress" | "completed" | "closed";
  task_created_at: string;
  estimated_budget: number;
  category_id: number;
  category_name: string;
  customer_id: number;
  customer_email: string;
  customer_phone: string;
  location_name:string;
  customer_name: string;
  customer_profile_picture: string | null;
  professional_name:string;
  professional_website:string;
  professional_company_name:string;
  professional_contact_number:string;
  total_responses: number;
  task_answers: TaskAnswer[];
}

export interface ResponsesStats {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
  totalCreditsSpent: number;
}

export type StatusKey = "open" | "in progress" | "completed" | "closed";

export type TabKey = "activity" | "details" | "notes";
