import { Metadata } from "next";
import TaskoriaBlog from "@/components/blog/TaskoriaMainBlogPage";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const metadata: Metadata = {
  title: "Blog — Taskoria | Productivity Tips & Task Management Guides",
  description:
    "Discover expert guides on task management, productivity systems, and team workflows. Fresh insights from the Taskoria team.",
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: "Taskoria Blog — Get Things Done, Better",
    description:
      "Expert productivity tips, task management guides, and workflow insights.",
    url: `${BASE_URL}/blog`,
    siteName: "Taskoria",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.png`, 
        width: 1200,
        height: 630,
        alt: "Taskoria Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taskoria Blog",
    description: "Task management and productivity insights.",
    images: [`${BASE_URL}/og-image.png`],
  },
};

function BlogListingSchema({ posts }: { posts: any[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Taskoria Blog",
    url: `${BASE_URL}/blog`,
    description: "Productivity tips and task management guides.",
    blogPost: posts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${BASE_URL}/blog/${p.slug}`,
      datePublished: p.published_at,
      author: { "@type": "Person", name: p.author_name },
      image: p.image_url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function BlogPage() {
  const res = await fetch(`${BASE_URL}/api/blog`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  const posts = data.posts ?? [];

  return (
    <>
      <BlogListingSchema posts={posts} />
      <TaskoriaBlog initialPosts={posts} />
    </>
  );
}