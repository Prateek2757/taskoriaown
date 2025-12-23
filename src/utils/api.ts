const isServer = typeof window === "undefined";

const baseURL = isServer
  ? process.env.NEXT_PUBLIC_APP_URL || "https://www.taskoria.com"
  : "";
export async function fetchProviders(limit?: number) {
  try {
   

    const res = await fetch(`${baseURL}/api/providers`);

    if (!res.ok) throw new Error("Failed to fetch providers");

    const data = await res.json();
    return limit ? data.slice(0, limit) : data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.message || "Something went wrong fetching providers");
  }
}



  export async function fetchCategories(limit?: number) {
    try {
       const isServer = typeof window === "undefined";

    const baseURL = isServer
      ? process.env.NEXT_PUBLIC_APP_URL || "https://www.taskoria.com"
      : "";
      const res = await fetch(`${baseURL}/api/signup/category-selection`);
      if (!res.ok) throw new Error("Failed to fetch providers");
  
      const data = await res.json();
      return limit ? data.slice(0, limit) : data;
    } catch (error: any) {
      console.error(error);
      throw new Error(error?.message || "Something went wrong fetching categories");
    }
  }

  export async function fetchCategoryBySlug(slug: string) {
    const res = await fetch(`${baseURL}/api/categories/${slug}`, {
      next: { revalidate: 3600 }, 
    });
  
    if (!res.ok) return null;
    return res.json();
  }

  