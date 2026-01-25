import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Taskoria Pty Ltd",
  description:
    "Read Taskoria’s Privacy Policy to understand how we collect, use, store, and protect your personal information in accordance with the Australian Privacy Act 1988.",
  keywords: [
    "Taskoria privacy policy",
    "privacy policy Australia",
    "data protection Australia",
    "Australian Privacy Act 1988",
    "user data protection",
    "Taskoria legal",
    "personal information policy",
  ],
  authors: [{ name: "Taskoria Pty Ltd" }],
  creator: "Taskoria Pty Ltd",
  publisher: "Taskoria Pty Ltd",
  metadataBase: new URL("https://www.taskoria.com"),
  openGraph: {
    title: "Privacy Policy | Taskoria Pty Ltd",
    description:
      "Learn how Taskoria collects, uses, and protects your personal information in accordance with Australian privacy laws.",
    url: "https://www.taskoria.com/privacy-policy",
    siteName: "Taskoria",
    type: "article",
    locale: "en_AU",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Taskoria",
    description:
      "How Taskoria collects, uses, and protects your personal information under Australian law.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.taskoria.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Last Updated: {new Date().getFullYear()}
        </p>

        <section className="space-y-3">
          <p>
            This Privacy Policy explains how Taskoria Pty Ltd (“Taskoria”, “we”,
            “us”, or “our”) collects, uses, stores, and discloses personal
            information when you access or use our website, mobile applications,
            and related services (collectively, the “Platform”).
          </p>
          <p>
            Taskoria operates an Australia-first on-demand services marketplace
            connecting customers with verified local service providers
            (“Professionals”).
          </p>
          <p>
            By accessing or using the Platform, you agree to the collection and
            handling of information in accordance with this Privacy Policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Legal Compliance</h2>
          <p>
            We are committed to protecting your privacy and comply with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Privacy Act 1988 (Cth)</li>
            <li>Australian Privacy Principles (APPs)</li>
            <li>Applicable Australian state and territory laws</li>
          </ul>
          <p>
            Where users access Taskoria from outside Australia, we take
            reasonable steps to ensure information is handled consistently with
            Australian privacy standards.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>

          <h3 className="font-semibold">2.1 Information You Provide</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Location or suburb</li>
            <li>Messages exchanged on the Platform</li>
          </ul>

          <p className="font-semibold mt-2">Additional for Professionals:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Business name and ABN</li>
            <li>Service categories and profile details</li>
            <li>Identity verification documents</li>
            <li>Insurance, licence, or certification details</li>
            <li>Bank or payout information</li>
          </ul>

          <h3 className="font-semibold mt-4">2.2 Automatically Collected Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address</li>
            <li>Device and browser type</li>
            <li>Operating system</li>
            <li>Usage behaviour, pages visited, and timestamps</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Cookies & Tracking</h2>
          <p>
            We use cookies and similar technologies to enable core functionality,
            remember preferences, analyse usage, and improve platform
            performance. Disabling cookies may impact certain features.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. How We Use Personal Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create and manage accounts</li>
            <li>Match Customers with suitable Professionals</li>
            <li>Facilitate communication and service delivery</li>
            <li>Process payments via third-party providers</li>
            <li>Verify identity, licences, and credentials</li>
            <li>Detect fraud and ensure platform security</li>
            <li>Comply with legal and regulatory obligations</li>
          </ul>
          <p className="font-medium">We do not sell personal information.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. Disclosure of Information</h2>
          <p>We may disclose information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Between Customers and Professionals for service fulfilment</li>
            <li>To trusted third-party service providers (payments, hosting, verification)</li>
            <li>Where required by law or regulatory authorities</li>
            <li>To protect the safety, integrity, or rights of Taskoria and users</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">6. Payments</h2>
          <p>
            All payments are processed by secure third-party providers. Taskoria
            does not store full credit or debit card details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">7. Data Security & Retention</h2>
          <p>
            We use reasonable technical and organisational safeguards including
            encryption, access controls, and secure infrastructure. Personal
            information is retained only as long as necessary for legal,
            operational, and regulatory purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">8. Access & Correction</h2>
          <p>
            You may request access to or correction of your personal information,
            or update your account details directly through the Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">9. Children’s Privacy</h2>
          <p>
            Taskoria is not intended for users under 18 years of age. We do not
            knowingly collect personal information from minors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Continued use of
            the Platform constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="space-y-3">
  <h2 className="text-xl font-semibold">11. Contact Us</h2>
  <p>
    <strong>Taskoria Pty Ltd</strong>
    <br />
    Privacy Officer
    <br />
    📧 Email:{" "}
    <a
      href="mailto:contactus@taskoria.com"
      className="text-blue-600 dark:text-blue-400 underline"
    >
      contactus@taskoria.com
    </a>
    <br />
    🌐 Website:{" "}
    <a
      href="https://www.taskoria.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 dark:text-blue-400 underline"
    >
      https://www.taskoria.com
    </a>
  </p>
</section>
      </div>
    </div>
  );
}