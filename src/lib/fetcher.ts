
export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    // "default" = honour the browser HTTP cache (respects Cache-Control headers).
    // This is already the browser default, but being explicit documents intent.
    cache: "default",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Something went wrong");
  }

  return data;
};