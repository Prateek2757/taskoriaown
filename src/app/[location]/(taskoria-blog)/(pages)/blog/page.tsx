import { Metadata } from "next";
import TaskoriaBlog from "@/components/blog/TaskoriaMainBlogPage";

const BASE_URL = "https://www.taskoria.com";

export const metadata: Metadata = {
  title: "Local Services Tips & Hiring Guides — Taskoria Blog",
  description:
    "Read practical guides on hiring local service professionals, comparing quotes, planning home projects, and getting everyday tasks done with Taskoria.",
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: "Local Services Tips & Hiring Guides — Taskoria Blog",
    description:
      "Helpful tips for hiring trusted local professionals, planning home services, and getting tasks done smoothly.",
    url: `${BASE_URL}/blog`,
    siteName: "Taskoria",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Taskoria Blog - Local Services Tips and Hiring Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Local Services Tips & Hiring Guides — Taskoria Blog",
    description:
      "Tips and guides for hiring local service providers and completing everyday tasks.",
    images: [`${BASE_URL}/og-image.png`],
  },
};

function BlogListingSchema({ posts }: { posts: any[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Taskoria Blog",
    url: `${BASE_URL}/blog`,
    description:
      "Local services tips, hiring guides, and practical advice for getting everyday tasks done.",
    blogPost: posts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${BASE_URL}/blog/${p.slug}`,
      datePublished: p.published_at,
      author: {
        "@type": "Person",
        name: p.author_name || "Taskoria Team",
      },
      image: p.image_url || `${BASE_URL}/og-image.png`,
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