import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: `Reset Your Password | Taskoria`,
  description: `Reset your Taskoria account password securely using your email verification code.`,
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PageClient />;
}
