"use client";

type Props = {
  slug: string;
};
export default function BlogDetails({ slug }: Props) {
  return(
 <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
  <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
 <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-zinc-50 leading-tight tracking-tight"></h1>

  </article>
  </div>
  )
}
