import type { Metadata } from "next";
import ContactSupport from "./components/Contact";
export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.taskoria.com/contact",
  },
};

export default function Page() {
  return <ContactSupport/>;
}