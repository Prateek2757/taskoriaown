
import BlogDetails from "@/components/blog/BlogDetails";

type Props = {
  params:Promise< {
    slug: string;
  }>;
};
  interface post{
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

  published_at: string;
  image_url: string;
};

function toTitleCase(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
function buildCanonical(slug: string){
  return `https://www.taskoria.com/blog/${slug}`
}


export default async function page({params}:Props){
  const {slug} = await params;
  return(
   
    <>
    <BlogDetails slug={slug}/>
    </>
  )
}