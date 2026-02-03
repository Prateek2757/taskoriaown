import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Taskoria",
  description:
    "Read Taskoria's Privacy Policy to understand how we collect, use, store, and protect your personal information in accordance with the Australian Privacy Act 1988.",
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
    title: "Privacy Policy | Taskoria ",
    description:
      "Read Taskoria’s Privacy Policy to understand how we collect, use, and protect your personal information.",
    url: "https://www.taskoria.com/privacy-policy",
    siteName: "Taskoria",
    type: "article",
    locale: "en_AU",
  },
  // twitter: {
  //   card: "summary",
  //   title: "Privacy Policy | Taskoria",
  //   description:
  //     "How Taskoria collects, uses, and protects your personal information under Australian law.",
  // },
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
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last Updated: {new Date().getFullYear()}
          </p>
        </div>

        <section className="space-y-4">
          <p>
            This Privacy Policy explains how <strong>Taskoria Pty Ltd</strong> (ABN 37 658 760 831) 
            ("Taskoria", "we", "our", or "us") collects, uses, stores, discloses, and otherwise 
            processes personal information when you access or use our website, mobile applications, 
            APIs, and related services (collectively, the "Platform").
          </p>
          <p>
            Taskoria operates an Australia-first on-demand services marketplace that facilitates 
            introductions and transactions between individuals or businesses seeking services 
            ("Customers") and service providers ("Professionals").
          </p>
          <p>
            By accessing or using the Platform, you acknowledge that you have read and understood 
            this Privacy Policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Purpose & Scope</h2>
          <p>This Privacy Policy describes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>What personal information we collect</li>
            <li>How and why we use it</li>
            <li>Who we share it with</li>
            <li>How we protect it</li>
            <li>Your rights and choices</li>
          </ul>
          <p className="mt-3">This policy applies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Customers</li>
            <li>Professionals</li>
            <li>Website visitors</li>
            <li>Job applicants</li>
            <li>Any individual interacting with Taskoria services</li>
          </ul>
          <p className="mt-3">
            This Privacy Policy is incorporated by reference into our Terms & Conditions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Regulatory Compliance</h2>
          <p>Taskoria complies with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Privacy Act 1988 (Cth)</li>
            <li>Australian Privacy Principles (APPs)</li>
            <li>Applicable state and territory privacy laws</li>
          </ul>
          <p className="mt-3">Where applicable, we also take reasonable steps to align with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>GDPR (EU/UK users)</li>
            <li>Global privacy best practices</li>
          </ul>
          <p className="mt-3">
            For more information, visit the Office of the Australian Information Commissioner (OAIC) website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. What Is Personal Information?</h2>
          <p>
            "Personal information" means information or an opinion about an identified individual 
            or an individual who is reasonably identifiable, whether the information is true or 
            not and whether recorded in material form or not.
          </p>
          <p>
            Examples include your name, contact details, IP address, and payment details.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Categories of Individuals We Process Data About</h2>
          <p>We may process personal information about:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Customers</strong> – individuals or businesses posting service requests</li>
            <li><strong>Professionals</strong> – individuals or businesses offering services</li>
            <li><strong>Website Users</strong> – visitors browsing our Platform</li>
            <li><strong>Job Applicants</strong> – individuals applying to work with Taskoria</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Personal Information We Collect</h2>
          
          <h3 className="text-xl font-semibold">5.1 Information You Provide Directly</h3>
          
          <div className="ml-4 space-y-3">
            <div>
              <p className="font-semibold">Customers</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Location or suburb</li>
                <li>Service request details</li>
                <li>Messages with Professionals</li>
                <li>Payment and billing details</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">Professionals</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name or business name</li>
                <li>ABN / registration details</li>
                <li>Contact details</li>
                <li>Service categories and profile content</li>
                <li>Licences, certifications, insurance (where applicable)</li>
                <li>Identity verification documents</li>
                <li>Bank or payout details</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">Job Applicants</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Resume/CV</li>
                <li>Employment history</li>
                <li>Qualifications</li>
                <li>Contact details</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6">5.2 Automatically Collected Information</h3>
          <p>
            We automatically collect certain information when you use our Platform, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address</li>
            <li>Browser type and device information</li>
            <li>Operating system</li>
            <li>Pages viewed and interactions</li>
            <li>Referral URLs</li>
            <li>Date, time, and duration of visits</li>
          </ul>
          <p className="mt-3">
            This data is primarily used for analytics, security, fraud prevention, and platform improvement.
          </p>

          <h3 className="text-xl font-semibold mt-6">5.3 Cookies & Similar Technologies</h3>
          <p>We use cookies, pixels, SDKs, and similar technologies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Enable core functionality</li>
            <li>Remember preferences</li>
            <li>Analyse usage patterns</li>
            <li>Improve user experience</li>
            <li>Support marketing and attribution</li>
          </ul>
          <p className="mt-3">
            You can manage cookies through your browser or cookie preference tools (where available). 
            Disabling cookies may affect Platform functionality.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. How We Use Personal Information</h2>
          <p>We process personal information for purposes including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Creating and managing accounts</li>
            <li>Matching Customers with Professionals</li>
            <li>Facilitating communication and transactions</li>
            <li>Processing payments, credits, and refunds</li>
            <li>Identity, licence, and credential verification</li>
            <li>Customer support and dispute resolution</li>
            <li>Improving Platform performance and features</li>
            <li>Analytics and business intelligence</li>
            <li>Marketing and promotional communications</li>
            <li>Fraud detection and platform security</li>
            <li>Legal, regulatory, and compliance obligations</li>
          </ul>
          <p className="mt-3 font-semibold">We do not sell personal information.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Lawful Basis for Processing</h2>
          <p>We process personal information where:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You have provided consent</li>
            <li>Processing is necessary to perform a contract</li>
            <li>We are required by law</li>
            <li>Processing is necessary for legitimate business interests</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Disclosure of Personal Information</h2>
          
          <h3 className="text-xl font-semibold">8.1 Between Platform Users</h3>
          <p>To facilitate services, we may share:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Customer details with Professionals responding to service requests</li>
            <li>Professional profile details with Customers</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4">8.2 Third-Party Service Providers</h3>
          <p>
            We may disclose personal information to trusted third parties that help us operate 
            the Platform, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Payment processors</li>
            <li>Identity verification providers</li>
            <li>Cloud hosting and infrastructure providers</li>
            <li>Analytics and monitoring services</li>
            <li>Email, SMS, and notification services</li>
          </ul>
          <p className="mt-3">
            These providers are contractually required to protect personal information.
          </p>

          <h3 className="text-xl font-semibold mt-4">8.3 Legal & Business Transfers</h3>
          <p>We may disclose personal information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To comply with legal obligations</li>
            <li>To law enforcement or regulators</li>
            <li>To professional advisers (lawyers, auditors, accountants)</li>
            <li>In connection with mergers, acquisitions, or asset sales</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. International Data Transfers</h2>
          <p>
            Some service providers may store or process data outside Australia.
          </p>
          <p>
            Where this occurs, we take reasonable steps to ensure adequate data protection 
            safeguards are in place.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Data Security</h2>
          <p>
            We implement reasonable administrative, technical, and physical safeguards, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Secure cloud infrastructure</li>
            <li>Encryption in transit and at rest</li>
            <li>Access controls and authentication</li>
            <li>Monitoring and audit logging</li>
          </ul>
          <p className="mt-3">
            No system is completely secure. Users are responsible for protecting their login credentials.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Data Retention</h2>
          <p>We retain personal information only for as long as reasonably necessary to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide services</li>
            <li>Meet legal and regulatory obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce agreements</li>
          </ul>
          <p className="mt-3">
            When no longer required, data is securely deleted or de-identified.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Access & Correction</h2>
          <p>You may:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Request access to personal information we hold</li>
            <li>Request correction of inaccurate or outdated information</li>
            <li>Update account details directly via your profile</li>
          </ul>
          <p className="mt-3">
            Requests can be made using the contact details below.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">13. Marketing Communications</h2>
          <p>
            We may send marketing communications in accordance with Australian spam laws.
          </p>
          <p>You may opt out at any time via:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email unsubscribe links</li>
            <li>Account notification settings</li>
          </ul>
          <p className="mt-3">
            Service-related communications may still be sent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">14. Children's Privacy</h2>
          <p>
            Taskoria services are not intended for individuals under 18 years of age.
          </p>
          <p>
            We do not knowingly collect personal information from minors.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">15. External Links</h2>
          <p>
            Our Platform may contain links to third-party websites.
          </p>
          <p>
            We are not responsible for their privacy practices and encourage users to review 
            their policies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">16. Complaints</h2>
          <p>
            If you believe we have breached your privacy, please contact us.
          </p>
          <p>
            We will investigate and respond in accordance with the Privacy Act 1988.
          </p>
          <p>
            If unsatisfied, you may contact the Office of the Australian Information 
            Commissioner (OAIC).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">17. Updates to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically.
          </p>
          <p>
            The latest version will always be available on our website.
          </p>
          <p>
            Continued use of the Platform constitutes acceptance of any changes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">18. Contact Us</h2>
          <p>
            <strong>Privacy Officer – Taskoria</strong>
            <br />
            <strong>Taskoria Pty Ltd</strong> (ABN 37 658 760 831)
            <br />
            📧 Email:{" "}
            <a
              href="mailto:contact@taskoria.com"
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
            >
              contact@taskoria.com
            </a>
            <br />
            🌐 Website:{" "}
            <a
              href="https://taskoria.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
            >
              https://taskoria.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}