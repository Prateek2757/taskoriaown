

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Last Updated: {new Date().getFullYear()}
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Company Information</h2>
          <p>
            Taskoria Pty Ltd (ACN 658 760 831) is a proprietary limited company
            registered in Queensland, Australia under the Corporations Act 2001.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Introduction</h2>
          <p>
            This Privacy Policy outlines how Taskoria Pty Ltd ("we", "our",
            "us") collects, uses, stores, and protects your personal
            information in compliance with the Australian Privacy Act 1988 and
            the Australian Privacy Principles (APPs).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Information We Collect</h2>
          <p>We may collect the following types of personal information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Business or account details</li>
            <li>Usage data and interaction logs</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. How We Collect Information</h2>
          <p>We collect information in the following ways:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Information you provide directly via forms or communications</li>
            <li>Automatically through cookies and analytics</li>
            <li>Through your usage of our platform and services</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. How We Use Your Information</h2>
          <p>Your personal information may be used to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Improve user experience</li>
            <li>Contact you regarding updates, notifications, or support</li>
            <li>Process payments or verify account information</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Data Storage & Security</h2>
          <p>
            We take reasonable steps to protect your personal information from
            misuse, loss, unauthorized access, modification, or disclosure.
            However, no method of online transmission is 100% secure, and we
            cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">7. Sharing of Information</h2>
          <p>
            We do not sell or rent your personal information. We may share data
            with trusted service providers where necessary for operating our
            platform, provided they comply with privacy obligations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. Your Rights</h2>
          <p>
            Under the Australian Privacy Principles, you have the right to
            access, correct, or delete your personal information. You may also
            request limitations on how we use your data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. Cookies & Tracking</h2>
          <p>
            Our website may use cookies and analytics tools to improve
            functionality and user experience. You may disable cookies in your
            browser settings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">10. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated revision date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, you can contact us at:</p>
          <p className="font-semibold">Taskoria Pty Ltd<br />Australia</p>
        </section>
      </div>
    </div>
  );
}