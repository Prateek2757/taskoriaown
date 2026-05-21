
export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    cache: "default",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Something went wrong");
  }

  return data;
};