import { api } from "@/lib/api-client";
import type { Category } from "@/features/admin-service-categories/types";
import type { CategoryFormValues } from "@/features/admin-service-categories/schema";

const basePath = "/api/admin/service-categories";

export function listAdminServiceCategories() {
  return api.get<Category[]>(basePath);
}

export function saveAdminServiceCategory(
  values: CategoryFormValues,
  categoryId?: number
) {
  return categoryId
    ? api.put<void>(`${basePath}/${categoryId}`, values)
    : api.post<void>(basePath, values);
}

export function deleteAdminServiceCategory(categoryId: number) {
  return api.delete<void>(`${basePath}/${categoryId}`);
}
