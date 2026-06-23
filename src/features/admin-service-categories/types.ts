export interface CategoryQuestion {
  category_question_id?: number;
  category_id?: number;
  question: string;
  field_type: "select" | "text" | "textarea" | "number" | "checkbox";
  options: string[];
  is_required: boolean;
  sort_order: number;
}

export interface Category {
  category_id: number;
  parent_category_id: number | null;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  remote_available: boolean;
  rank: number;
  public_id: string;
  main_category: string;
  faqs: { question: string; answer: string }[];
  service_detail: string;
  keywords: string[];
  image_url: string;
  questions: CategoryQuestion[];
  created_at: string;
  updated_at: string;
}
