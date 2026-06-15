import TaskoriaBlog from "@/components/blog/TaskoriaMainBlogPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local Services Tips & Hiring Guides | Taskoria Blog",
  description:
    "Explore Taskoria hiring guides, local service tips, provider comparisons, and practical advice for booking trusted professionals across Australia.",
  alternates: {
    canonical: "https://www.taskoria.com/bloggs",
  },
  keywords: [
    "Taskoria blog",
    "hire professionals",
    "service marketplace",
    "local services tips",
    "Australian home services",
    "home services guide",
  ],
  openGraph: {
    title: "Local Services Tips & Hiring Guides | Taskoria Blog",
    description:
      "Hiring guides, local service tips, and provider comparisons for Australians booking trusted professionals.",
    url: "https://www.taskoria.com/bloggs",
    siteName: "Taskoria",
    images: [
      {
        url: "https://www.taskoria.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Taskoria Blog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Local Services Tips & Hiring Guides | Taskoria Blog",
    description:
      "Hiring guides, local service tips, and provider comparisons for Australians.",
    images: ["https://www.taskoria.com/og-image.png"],
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
