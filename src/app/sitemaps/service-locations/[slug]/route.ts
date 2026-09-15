// Previously this endpoint exposed 20,000 low-value service/location URLs.
// It is deliberately retired so crawlers drop the old sitemap quickly.
export async function GET() {
  return new Response("This sitemap has been retired.", {
    status: 410,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
