import type { Metadata } from "next";
import PostAJobClient from "./page-client";

export const metadata: Metadata = {
  title: "Post a Job for Free | Taskoria",
  description: "Post a job and receive quotes from local professionals on Taskoria.",
  robots: { index: true, follow: true },
};

export default function PostAJobPage() {
  return <PostAJobClient />;
}
