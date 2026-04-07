import TaskoriaBlog from "@/components/blog/TaskoriaMainBlogPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expert Guides & Insights | Taskoria Blog",
  description:
    "Explore the Taskoria Blog for expert tips, service guides, and insights on hiring professionals, growing your business, and getting tasks done efficiently.",
  keywords: [
    "Taskoria blog",
    "hire professionals",
    "service marketplace",
    "business tips",
    "freelance services",
    "home services guide",
  ],
  openGraph: {
    title: "Taskoria Blog",
    description:
      "Expert tips, service guides, and insights to help you hire smarter and grow faster.",
    url: "https://taskoria.com/blog",
    siteName: "Taskoria",
    images: [
      {
        url: "https://taskoria.com/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Taskoria Blog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taskoria Blog",
    description:
      "Expert tips and insights for hiring and growing your business.",
    images: ["https://taskoria.com/og-image.png"],
  },
};

const page = () => {
  return (
    <main className="min-h-screen">
      <h1 className="sr-only">
        Taskoria Blog - Tips, Guides & Service Insights
      </h1>
      <TaskoriaBlog />
    </main>
  );
};

export default page;