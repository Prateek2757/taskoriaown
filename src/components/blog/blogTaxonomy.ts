const CATEGORY_RENAMES: Record<string, string> = {
  "Productivity Tips": "Local Services Guides",
  Productivity: "Local Services Guides",
  "Business Tips": "Hiring Guides",
};

export function normalizeBlogCategory(category?: string | null) {
  const value = category?.trim();
  if (!value) return "Local Services Guides";
  return CATEGORY_RENAMES[value] ?? value;
}

export function normalizeBlogPostCategory<T extends { category?: string | null }>(
  post: T
) {
  return {
    ...post,
    category: normalizeBlogCategory(post.category),
  };
}
