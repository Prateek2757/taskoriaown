import BlogDetails from "@/components/blog/BlogDetails";
import {
  getBlogPostBySlug,
  getBlogPostSlugs,
  getRelatedBlogPosts,
} from "@/lib/cache";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

type Props = {
  params: Promise<{
    location: string;
    slug: string;
  }>;
};

interface Post {
  post_id: number;
  slug: string;
  title: string;
  excerpt: string;

  author_name: string;
  author_role: string;
  category: string;
  tags: string[];
  is_featured: boolean;
  views: number;
  likes: number;
  read_time: string;
  content?: string;
  published_at: string;
  updated_at?: string;
  image_url: string;
}

function buildCanonical(slug: string) {
  return `https://www.taskoria.com/blog/${slug}`;
}

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getBlogPostSlugs();

  return posts.map((post) => ({
    location: "en",
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post: Post | null = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: buildCanonical(slug),
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      images: [post.image_url],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image_url],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post: Post | null = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const filteredPosts = await getRelatedBlogPosts(post.category, post.slug, 3);
  const canonicalUrl = buildCanonical(post.slug);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    image: post.image_url ? [post.image_url] : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at ?? post.published_at,
    author: {
      "@type": "Person",
      name: post.author_name || "Taskoria",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://www.taskoria.com/#organization",
      name: "Taskoria",
      logo: {
        "@type": "ImageObject",
        url: "https://www.taskoria.com/images/taskoria_logo.svg",
      },
    },
    mainEntityOfPage: canonicalUrl,
    inLanguage: "en-AU",
  };

  return (
    <>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogDetails post={post} filteredPosts={filteredPosts} />
    </>
  );
}
