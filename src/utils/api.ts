
export async function fetchProviders(limit?: number) {
    try {
      const res = await fetch(`/api/providers`, {
        cache: "no-store", 
      });
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
      const res = await fetch(`/api/signup/category-selection`, {
        cache: "no-store", 
      });
      if (!res.ok) throw new Error("Failed to fetch providers");
  
      const data = await res.json();
      return limit ? data.slice(0, limit) : data;
    } catch (error: any) {
      console.error(error);
      throw new Error(error?.message || "Something went wrong fetching providers");
    }
  }