import BlogNavbar from "@/components/Blog-Navbar";
import TaskoriaBlog from "@/components/blog/TaskoriaMainBlogPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taskoria Blog",
  alternates: {
    canonical: "https://www.taskoria.com/blogg",
  },
};

const page = () => {
  return (
    <>
      <BlogNavbar />
      <TaskoriaBlog />
    </>
  );
};

export default page;
