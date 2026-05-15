import TaskoriaBlog from "@/components/blog/TaskoriaMainBlogPage";

const page = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog`);

  const data = await res.json();

  return <TaskoriaBlog initialPosts={data.posts ?? []} />;
};

export default page;