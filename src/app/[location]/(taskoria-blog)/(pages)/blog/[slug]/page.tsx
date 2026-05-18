import BlogDetails from "@/components/blog/BlogDetails";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/cache";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
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

function toTitleCase(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
function buildCanonical(slug: string) {
  return `https://www.taskoria.com/blog/${slug}`;
}



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post: Post | null = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: buildCanonical(slug),
    },
    openGraph: {
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
  const allPosts = await getAllBlogPosts();
 const filteredPosts = allPosts.filter((p) => p.category === post.category && p.slug !== post.slug);
  return (
    <>
      <BlogDetails post={post} filteredPosts={filteredPosts} />
    </>
  );
}