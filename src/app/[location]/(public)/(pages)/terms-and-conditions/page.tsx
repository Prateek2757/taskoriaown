import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Taskoria",
  description:
    "Review Taskoria’s Terms and Conditions governing the use of our platform and services.",
  keywords: [
    "Taskoria terms and conditions",
    "terms of service Australia",
    "Taskoria legal terms",
    "marketplace terms",
    "service agreement Australia",
    "user agreement",
    "Taskoria T&C",
    "platform terms of use",
    "Australian marketplace legal",
  ],
  authors: [{ name: "Taskoria Pty Ltd" }],
  creator: "Taskoria Pty Ltd",
  publisher: "Taskoria Pty Ltd",
  metadataBase: new URL("https://www.taskoria.com"),
  openGraph: {
    title: "Terms & Conditions | Taskoria",
    description:
      "Review Taskoria’s Terms and Conditions governing the use of our platform and services.",
    url: "https://www.taskoria.com/terms-and-conditions",
    siteName: "Taskoria",
    type: "article",
    locale: "en_AU",
    images: [
      {
        url: "https://www.taskoria.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Taskoria Terms & Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | Taskoria",
    description:
      "Legal terms governing the use of Taskoria's services marketplace platform.",
    images: ["https://www.taskoria.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.taskoria.com/terms-and-conditions",
  },
  other: {
    "article:published_time": "2026-01-25T00:00:00Z",
    "article:modified_time": new Date().toISOString(),
  },
};

export default function TermsAndConditionsPage() {

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms & Conditions",
            description:
              "Terms and conditions governing the use of Taskoria's on-demand services marketplace platform.",
            url: "https://www.taskoria.com/terms-and-conditions",
            publisher: {
              "@type": "Organization",
              name: "Taskoria Pty Ltd",
              url: "https://www.taskoria.com",
              logo: {
                "@type": "ImageObject",
                url: "https://www.taskoria.com/logo.png",
              },
            },
            datePublished: "2026-01-25",
            dateModified: new Date().toISOString(),
            inLanguage: "en-AU",
          }),
        }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <header className="space-y-3 border-b border-gray-200 dark:border-gray-700 pb-6">
            <h1 className="text-3xl md:text-4xl font-bold">
              Terms & Conditions
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated: { new Date().getFullYear()}
            </p>
          </header>

          {/* Introduction */}
          <section className="space-y-4">
            <p>
              These Terms & Conditions ("Terms") govern your access to and use
              of the website, mobile applications, APIs, and related services
              operated by{" "}
              <strong>Taskoria Pty Ltd (ABN 37 658 760 831)</strong>{" "}
              ("Taskoria", "we", "our", or "us").
            </p>
            <p>
              By accessing or using the Taskoria platform (the "Platform"), you
              agree to be bound by these Terms. If you do not agree, you must
              not use the Platform.
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. About Taskoria</h2>
            <p>
              Taskoria operates an Australia-first on-demand services
              marketplace that facilitates introductions between:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Customers</strong> – individuals or businesses seeking
                services; and
              </li>
              <li>
                <strong>Professionals</strong> – individuals or businesses
                offering services.
              </li>
            </ul>
            <p>
              Taskoria does not provide services itself and is not a party to
              any agreement entered into between Customers and Professionals,
              except as expressly stated in these Terms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Definitions</h2>
            <dl className="space-y-3">
              <div>
                <dt className="font-semibold">Account</dt>
                <dd className="ml-6 text-gray-700 dark:text-gray-300">
                  A registered Taskoria user account
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Customer</dt>
                <dd className="ml-6 text-gray-700 dark:text-gray-300">
                  A user who posts or requests services
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Professional</dt>
                <dd className="ml-6 text-gray-700 dark:text-gray-300">
                  A user who offers services
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Service Request</dt>
                <dd className="ml-6 text-gray-700 dark:text-gray-300">
                  A job, task, or service posted by a Customer
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Credits</dt>
                <dd className="ml-6 text-gray-700 dark:text-gray-300">
                  Prepaid units used by Professionals to respond to Service
                  Requests
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Platform</dt>
                <dd className="ml-6 text-gray-700 dark:text-gray-300">
                  Taskoria website, apps, APIs, and services
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Content</dt>
                <dd className="ml-6 text-gray-700 dark:text-gray-300">
                  All text, images, data, messages, and materials uploaded or
                  generated
                </dd>
              </div>
            </dl>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Eligibility</h2>
            <p>You must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 18 years old</li>
              <li>Have legal capacity to enter into binding contracts</li>
              <li>Provide accurate and truthful information</li>
            </ul>
            <p>
              Taskoria may suspend or terminate accounts that do not meet these
              requirements.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              4. Account Registration & Security
            </h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Keep login credentials confidential</li>
              <li>Notify us immediately of unauthorised access</li>
            </ul>
            <p>
              You are responsible for all activity conducted through your
              Account.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Role of Taskoria</h2>
            <p>Taskoria:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Facilitates introductions only</li>
              <li>Does not vet, endorse, guarantee, or supervise services</li>
              <li>
                Is not responsible for service quality, outcomes, pricing, or
                disputes
              </li>
            </ul>
            <p>Any contract is solely between Customer and Professional.</p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              6. Service Requests & Engagements
            </h2>

            <h3 className="text-xl font-semibold">6.1 Customers</h3>
            <p>Customers may:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Post Service Requests</li>
              <li>Communicate with Professionals</li>
              <li>Accept or reject quotes at their discretion</li>
            </ul>
            <p>Customers must provide accurate service details.</p>

            <h3 className="text-xl font-semibold mt-4">6.2 Professionals</h3>
            <p>Professionals:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Choose whether to respond to Service Requests</li>
              <li>Must hold required licences, registrations, and insurance</li>
              <li>Are solely responsible for services provided</li>
            </ul>
            <p>Misrepresentation may result in suspension or termination.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              7. Credits, Fees & Payments
            </h2>

            <h3 className="text-xl font-semibold">7.1 Credits System</h3>
            <p>Professionals may be required to use Credits to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respond to Service Requests</li>
              <li>Access certain Platform features</li>
            </ul>
            <p className="mt-3">Credits:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Are non-transferable</li>
              <li>Are non-refundable except where required by law</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">7.2 Payments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payments may be processed via third-party providers</li>
              <li>Taskoria does not store full payment card details</li>
              <li>Fees are exclusive of GST unless stated otherwise</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Reviews & Ratings</h2>
            <p>Users may leave reviews based on genuine experiences.</p>
            <p>You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Post false, misleading, or defamatory reviews</li>
              <li>Manipulate ratings or feedback</li>
            </ul>
            <p>Taskoria may remove reviews that breach these Terms.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Prohibited Conduct</h2>
            <p>You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide false or misleading information</li>
              <li>Circumvent Platform fees or systems</li>
              <li>Harass, threaten, or abuse other users</li>
              <li>Upload unlawful, offensive, or infringing content</li>
              <li>Use bots, scraping, or automated tools</li>
              <li>Interfere with Platform security or operations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              10. Content & Intellectual Property
            </h2>

            <h3 className="text-xl font-semibold">10.1 Your Content</h3>
            <p>
              You retain ownership of your Content but grant Taskoria a
              non-exclusive, royalty-free, worldwide licence to use, display,
              and distribute it for Platform operation and promotion.
            </p>

            <h3 className="text-xl font-semibold mt-4">10.2 Taskoria IP</h3>
            <p>
              All Platform software, branding, designs, and systems are owned by
              Taskoria or its licensors.
            </p>
            <p>
              You must not copy, modify, or reverse-engineer any part of the
              Platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Privacy</h2>
            <p>
              Personal information is handled in accordance with our{" "}
              <a
                href="/privacy-policy"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
              >
                Privacy Policy
              </a>
              , which forms part of these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              12. Suspension & Termination
            </h2>
            <p>Taskoria may suspend or terminate Accounts:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>For breach of these Terms</li>
              <li>For fraudulent or unlawful activity</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mt-3">You may close your Account at any time.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">13. Disclaimers</h2>
            <p>To the maximum extent permitted by law:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The Platform is provided "as is" and "as available"
              </li>
              <li>Taskoria makes no warranties regarding:</li>
              <ul className="list-circle pl-6 space-y-1">
                <li>Service quality</li>
                <li>Professional suitability</li>
                <li>Availability or accuracy of Content</li>
              </ul>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              14. Limitation of Liability
            </h2>
            <p>To the extent permitted by law, Taskoria is not liable for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Losses arising from services provided by Professionals</li>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of data, profits, or business opportunities</li>
            </ul>
            <p className="mt-3">
              Where liability cannot be excluded, it is limited to resupplying
              the service or the cost of resupply.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">15. Indemnity</h2>
            <p>
              You agree to indemnify Taskoria against any claims, losses, or
              damages arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your breach of these Terms</li>
              <li>Your use of the Platform</li>
              <li>Your interactions with other users</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">16. Dispute Resolution</h2>
            <p>Users are encouraged to resolve disputes directly.</p>
            <p className="mt-3">Taskoria:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Is not obligated to mediate</li>
              <li>May assist at its discretion</li>
              <li>Is not responsible for dispute outcomes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">17. Changes to Terms</h2>
            <p>We may update these Terms from time to time.</p>
            <p>Changes take effect when published on the Platform.</p>
            <p>Continued use constitutes acceptance.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">18. Governing Law</h2>
            <p>
              These Terms are governed by the laws of New South Wales,
              Australia.
            </p>
            <p>You submit to the exclusive jurisdiction of NSW courts.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">19. Contact Us</h2>
            <p>
              <strong>Taskoria Legal & Support</strong>
              <br />
              <strong>Taskoria Pty Ltd</strong> (ABN 37 658 760 831)
              <br />
              📧 Email:{" "}
              <a
                href="mailto:support@taskoria.com"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
              >
                support@taskoria.com
              </a>
              <br />
              🌐 Website:{" "}
              <a
                href="https://www.taskoria.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
              >
                https://www.taskoria.com
              </a>
            </p>
          </section>

          <section className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold">20. Acceptance</h2>
            <p>By using Taskoria, you confirm that you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Have read and understood these Terms</li>
              <li>Agree to be legally bound by them</li>
            </ul>
          </section>

          <footer className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              These Terms & Conditions are effective as of {new Date().getFullYear()}. For
              questions or concerns, please contact us at{" "}
              <a
                href="mailto:support@taskoria.com"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
              >
                support@taskoria.com
              </a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}