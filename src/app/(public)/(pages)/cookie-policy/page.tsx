
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Cookie Policy | Taskoria ",
  description:
    "Learn how Taskoria uses cookies and similar technologies to improve your experience on our platform.",
  keywords: [
    "Taskoria cookie policy",
    "cookies Australia",
    "privacy cookies",
    "website cookies",
    "cookie consent",
    "cookie preferences",
    "tracking technologies",
    "web analytics cookies",
    "marketing cookies Australia",
  ],
  authors: [{ name: "Taskoria Pty Ltd" }],
  creator: "Taskoria Pty Ltd",
  publisher: "Taskoria Pty Ltd",
  metadataBase: new URL("https://www.taskoria.com"),
  openGraph: {
    title: "Cookie Policy | Taskoria",
    description:
      "Understand how Taskoria uses cookies to enhance your experience and protect your privacy.",
    url: "https://www.taskoria.com/cookie-policy",
    siteName: "Taskoria",
    type: "article",
    locale: "en_AU",
    images: [
      {
        url: "https://www.taskoria.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Taskoria Cookie Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy | Taskoria",
    description:
      "How Taskoria uses cookies and tracking technologies on our platform.",
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
    canonical: "https://www.taskoria.com/cookie-policy",
  },
  other: {
    "article:published_time": "2026-01-25T00:00:00Z",
    "article:modified_time": new Date().toISOString(),
  },
};


export default function CookiePolicyPage() {
  // const [showPreferences, setShowPreferences] = useState(false);
  // const [preferences, setPreferences] = useState<CookiePreferences>({
  //   necessary: true, 
  //   analytics: false,
  //   functionality: false,
  //   marketing: false,
  // });
  // const [saved, setSaved] = useState(false);

  
  // useEffect(() => {
  //   const savedPrefs = localStorage.getItem("taskoria_cookie_preferences");
  //   if (savedPrefs) {
  //     try {
  //       setPreferences({ ...preferences, ...JSON.parse(savedPrefs) });
  //     } catch (e) {
  //       console.error("Failed to load cookie preferences", e);
  //     }
  //   }
  // }, []);

  // const handleToggle = (category: CookieCategory) => {
  //   if (category === "necessary") return; // Cannot disable necessary cookies

  //   setPreferences((prev) => ({
  //     ...prev,
  //     [category]: !prev[category],
  //   }));
  // };

  // const handleSave = () => {
  //   localStorage.setItem("taskoria_cookie_preferences", JSON.stringify(preferences));
  //   setSaved(true);
  //   setTimeout(() => setSaved(false), 3000);
  //   setShowPreferences(false);
  // };

  // const handleAcceptAll = () => {
  //   const allAccepted: CookiePreferences = {
  //     necessary: true,
  //     analytics: true,
  //     functionality: true,
  //     marketing: true,
  //   };
  //   setPreferences(allAccepted);
  //   localStorage.setItem("taskoria_cookie_preferences", JSON.stringify(allAccepted));
  //   setSaved(true);
  //   setTimeout(() => setSaved(false), 3000);
  //   setShowPreferences(false);
  // };

  // const handleRejectAll = () => {
  //   const onlyNecessary: CookiePreferences = {
  //     necessary: true,
  //     analytics: false,
  //     functionality: false,
  //     marketing: false,
  //   };
  //   setPreferences(onlyNecessary);
  //   localStorage.setItem("taskoria_cookie_preferences", JSON.stringify(onlyNecessary));
  //   setSaved(true);
  //   setTimeout(() => setSaved(false), 3000);
  //   setShowPreferences(false);
  // };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Cookie Policy",
            description:
              "Cookie policy explaining how Taskoria uses cookies and similar technologies.",
            url: "https://www.taskoria.com/cookie-policy",
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
          <header className="space-y-4 border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Cookie Policy</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Last Updated: {new Date().getFullYear()}
                </p>
              </div>
              {/* <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                🍪 Manage Cookie Preferences
              </button> */}
            </div>
{/* 
            {saved && (
              <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-lg">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  ✓ Your cookie preferences have been saved successfully
                </p>
              </div>
            )} */}
          </header>

          {/* {showPreferences && (
            <div className="bg-gray-50 dark:bg-gray-800 border-2 border-blue-500 rounded-lg p-6 space-y-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Cookie Preferences</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage how we use cookies on your device
                  </p>
                </div>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close preferences"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Strictly Necessary Cookies</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Essential for the platform to function. Cannot be disabled.
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1 cursor-not-allowed opacity-60">
                        <div className="w-4 h-4 bg-white rounded-full transform translate-x-6"></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">Always On</p>
                    </div>
                  </div>
                </div>

\                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Performance & Analytics Cookies</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Help us understand how visitors use our platform to improve user experience.
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle("analytics")}
                      className="ml-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                      aria-label="Toggle analytics cookies"
                    >
                      <div
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          preferences.analytics ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
                            preferences.analytics ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Functionality Cookies</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Remember your preferences and provide enhanced, personalized features.
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle("functionality")}
                      className="ml-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                      aria-label="Toggle functionality cookies"
                    >
                      <div
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          preferences.functionality ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
                            preferences.functionality ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Marketing & Advertising Cookies</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Used to deliver relevant advertisements and measure campaign effectiveness.
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle("marketing")}
                      className="ml-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                      aria-label="Toggle marketing cookies"
                    >
                      <div
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          preferences.marketing ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
                            preferences.marketing ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Accept All
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Save Preferences
                </button>
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors duration-200"
                >
                  Reject All
                </button>
              </div>
            </div>
          )} */}

          <section className="space-y-4">
            <p>
              This Cookie Policy explains how{" "}
              <strong>Taskoria Pty Ltd</strong> ("Taskoria", "we", "our", or
              "us") uses cookies and similar technologies when you access or use
              our website, mobile applications, APIs, and related services
              (collectively, the "Platform").
            </p>
            <p>
              This Cookie Policy should be read together with our{" "}
              <a
                href="/privacy-policy"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/terms-and-conditions"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
              >
                Terms & Conditions
              </a>
              .
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device (computer,
              tablet, or mobile phone) when you visit a website. Cookies help
              websites remember information about your visit, such as
              preferences, login status, and how you interact with the site.
            </p>
            <p>
              We may also use similar technologies such as pixels, web beacons,
              SDKs, and local storage. For simplicity, we refer to all of these
              as "cookies" in this policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Why We Use Cookies</h2>
            <p>Taskoria uses cookies to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Enable core website and platform functionality</li>
              <li>Keep users logged in securely</li>
              <li>Remember preferences and settings</li>
              <li>Analyse how the Platform is used</li>
              <li>Improve performance and user experience</li>
              <li>Detect and prevent fraud or misuse</li>
              <li>Support marketing, attribution, and advertising (where permitted)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Types of Cookies We Use</h2>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-3">
                  3.1 Strictly Necessary Cookies
                </h3>
                <p className="mb-3">
                  These cookies are essential for the Platform to function and
                  cannot be switched off.
                </p>
                <p className="mb-2">They include cookies that:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Enable account login and authentication</li>
                  <li>Maintain session security</li>
                  <li>Support payment and credit transactions</li>
                  <li>Ensure load balancing and system stability</li>
                </ul>
                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Without these cookies, parts of the Platform will not work properly.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-3">
                  3.2 Performance & Analytics Cookies
                </h3>
                <p className="mb-3">
                  These cookies help us understand how users interact with the
                  Platform by collecting aggregated and anonymous information.
                </p>
                <p className="mb-2">They may track:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Pages visited</li>
                  <li>Time spent on pages</li>
                  <li>Navigation paths</li>
                  <li>Error messages</li>
                </ul>
                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  This data helps us improve usability, performance, and content.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-3">
                  3.3 Functionality Cookies
                </h3>
                <p className="mb-3">
                  These cookies allow the Platform to remember choices you make,
                  such as:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Language preferences</li>
                  <li>Location or suburb</li>
                  <li>Display preferences</li>
                </ul>
                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  They enhance functionality and personalization.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-3">
                  3.4 Marketing & Advertising Cookies
                </h3>
                <p className="mb-3">These cookies may be used to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Deliver relevant advertising</li>
                  <li>Measure campaign effectiveness</li>
                  <li>Limit the number of times you see an ad</li>
                </ul>
                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  They may be set by Taskoria or third-party advertising partners.
                  Where required by law, these cookies are only used with your consent.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Third-Party Cookies</h2>
            <p>
              We may allow trusted third-party service providers to place
              cookies on your device to help us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Analyse usage</li>
              <li>Process payments</li>
              <li>Deliver communications</li>
              <li>Provide advertising and attribution</li>
            </ul>
            <p className="mt-3">
              These third parties have their own privacy and cookie policies.
              Taskoria does not control how third-party cookies are used once
              placed.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              5. Managing Cookies & Preferences
            </h2>

            <h3 className="text-xl font-semibold">5.1 Browser Controls</h3>
            <p>Most browsers allow you to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>View cookies stored on your device</li>
              <li>Delete cookies</li>
              <li>Block all or certain cookies</li>
            </ul>
            <p className="mt-3">
              <strong>Please note:</strong> blocking cookies may affect Platform
              functionality.
            </p>

            <h3 className="text-xl font-semibold mt-6">
              5.2 Cookie Consent Tools
            </h3>
            <p>
              Where available, Taskoria may provide a cookie preference banner
              or manager allowing you to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accept or reject non-essential cookies</li>
              <li>Change your preferences at any time</li>
            </ul>
            <p className="mt-3">
              Preferences are device- and browser-specific. You can manage your
              preferences using the{" "}
              <button
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Cookie Preferences
              </button>{" "}
              button at the top of this page.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              6. Cookies Used on Mobile Applications
            </h2>
            <p>Our mobile applications may use:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Software development kits (SDKs)</li>
              <li>Device identifiers</li>
              <li>App analytics tools</li>
            </ul>
            <p className="mt-3">
              These function similarly to cookies and are used for analytics,
              performance monitoring, and feature improvements.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              7. Data Collected Through Cookies
            </h2>
            <p>Information collected via cookies may include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address</li>
              <li>Device and browser type</li>
              <li>Operating system</li>
              <li>Interaction data</li>
              <li>Approximate location</li>
            </ul>
            <p className="mt-3">
              This information is processed in accordance with our{" "}
              <a
                href="/privacy-policy"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
              >
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              8. Updates to This Cookie Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time to reflect:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Changes in technology</li>
              <li>Legal or regulatory requirements</li>
              <li>Updates to our services</li>
            </ul>
            <p className="mt-3">
              The latest version will always be available on our website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie
              Policy, please contact:
            </p>
            <p className="mt-3">
              <strong>Taskoria Privacy Officer</strong>
              <br />
              <strong>Taskoria Pty Ltd</strong> (ABN 37 658 760 831)
              <br />
              📧 Email:{" "}
              <a
                href="mailto:privacy@taskoria.com"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
              >
                privacy@taskoria.com
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

          <section className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold">10. Acceptance</h2>
            <p>
              By continuing to use the Platform, you acknowledge that you have
              read and understood this Cookie Policy.
            </p>
            <p>
              Where required by law, you consent to the use of cookies in
              accordance with your selected preferences.
            </p>
          </section>

          <footer className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="space-y-2">
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  Manage Your Privacy
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You can update your cookie preferences at any time using the{" "}
                  <button
                    className="underline font-medium hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    Manage Cookie Preferences
                  </button>{" "}
                  button at the top of this page. Your choices are saved locally
                  on your device.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}