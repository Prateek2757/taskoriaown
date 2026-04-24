export const fetcher = async (url: string) => {
    const res = await fetch(url);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data?.error || "Something went wrong");
    }
  
    return data;
  };