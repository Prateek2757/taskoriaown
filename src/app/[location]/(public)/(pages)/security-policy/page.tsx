import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Policy | Taskoria",
  description:
    "Taskoria's security policy, responsible disclosure program, and commitment to protecting our users.",
};

const LAST_UPDATED = new Date().toLocaleDateString("en-AU", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: `Taskoria is committed to maintaining the security and integrity of our platform. We take the protection of our users — both customers and service providers — seriously. This policy outlines how we approach security, how we handle vulnerability reports, and what you can expect from us.`,
  },
  {
    id: "scope",
    title: "Scope",
    content: null,
    subsections: [
      {
        title: "In scope",
        items: [
          "taskoria.com and all subdomains (*.taskoria.com)",
          "Taskoria mobile applications (iOS and Android)",
          "Public-facing APIs at api.taskoria.com",
          "Authentication and session management systems",
          "Payment processing integrations",
          "User data storage and retrieval",
        ],
        type: "in",
      },
      {
        title: "Out of scope",
        items: [
          "Denial-of-service (DoS/DDoS) attacks",
          "Social engineering or phishing attacks against Taskoria staff",
          "Physical security of our infrastructure",
          "Third-party services we rely on (Vercel, Supabase, Stripe)",
          "Vulnerabilities requiring unlikely user interaction",
          "Automated scanner output without a clear proof of concept",
          "Rate limiting on non-sensitive endpoints",
        ],
        type: "out",
      },
    ],
  },
  {
    id: "reporting",
    title: "Responsible disclosure",
    content: `If you discover a security vulnerability, we ask that you follow responsible disclosure practices. Please do not publicly disclose the vulnerability until we have had an opportunity to investigate and address it. We commit to working with you in good faith.`,
    steps: [
      {
        number: "01",
        heading: "Report privately",
        body: "Email security@taskoria.com with a clear description of the vulnerability, steps to reproduce, and potential impact. Encrypted reports are welcome — our PGP key is available on request.",
      },
      {
        number: "02",
        heading: "Acknowledge receipt",
        body: "We will acknowledge your report within 2 business days and provide an initial assessment within 5 business days.",
      },
      {
        number: "03",
        heading: "Investigation & fix",
        body: "Our team will investigate and work on a resolution. We will keep you updated on our progress and notify you when the fix is deployed.",
      },
      {
        number: "04",
        heading: "Coordinated disclosure",
        body: "After the fix is deployed, we are happy to coordinate public disclosure with you. We will credit you in our acknowledgments unless you prefer to remain anonymous.",
      },
    ],
  },
  {
    id: "safe-harbor",
    title: "Safe harbor",
    content: `Taskoria will not pursue legal action against security researchers who act in good faith and follow this policy. We consider responsible security research to be a valuable contribution to our platform. To qualify for safe harbor, you must:`,
    list: [
      "Report the vulnerability promptly without exploiting it beyond what is necessary to demonstrate the issue",
      "Avoid accessing, modifying, or deleting data that does not belong to you",
      "Not disrupt or degrade the Taskoria service",
      "Not engage in social engineering, phishing, or physical attacks",
      "Provide us reasonable time to resolve the issue before any public disclosure",
    ],
  },
  {
    id: "data-security",
    title: "How we protect your data",
    content: null,
    practices: [
      {
        icon: "lock",
        heading: "Encryption in transit",
        body: "All data transmitted between your browser and Taskoria is encrypted using TLS 1.2+. We enforce HTTPS across all services with HSTS.",
      },
      {
        icon: "database",
        heading: "Encryption at rest",
        body: "Sensitive data — including personal information and payment details — is encrypted at rest. We do not store raw card numbers; payments are handled by PCI-compliant processors.",
      },
      {
        icon: "shield",
        heading: "Access controls",
        body: "Access to production systems is restricted to authorised personnel only, using the principle of least privilege. All access is logged and audited.",
      },
      {
        icon: "refresh",
        heading: "Regular audits",
        body: "We conduct periodic vulnerability assessments and penetration tests. Security is part of our development lifecycle, not an afterthought.",
      },
      {
        icon: "eye-off",
        heading: "Password security",
        body: "Passwords are hashed using bcrypt with a high work factor. We never store passwords in plaintext and support multi-factor authentication.",
      },
      {
        icon: "alert",
        heading: "Incident response",
        body: "We have a defined incident response plan. In the event of a breach affecting user data, we will notify affected users and relevant authorities as required by law.",
      },
    ],
  },
  {
    id: "response-sla",
    title: "Response timelines",
    content: "Our commitment to addressing reported vulnerabilities:",
    sla: [
      {
        severity: "Critical",
        acknowledge: "2 hours",
        fix: "24 hours",
        color: "red",
      },
      {
        severity: "High",
        acknowledge: "1 business day",
        fix: "7 days",
        color: "amber",
      },
      {
        severity: "Medium",
        acknowledge: "2 business days",
        fix: "30 days",
        color: "blue",
      },
      {
        severity: "Low",
        acknowledge: "5 business days",
        fix: "90 days",
        color: "teal",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    content: `For security issues, please contact us at security@taskoria.com. For general privacy enquiries, see our Privacy Policy. For all other support, visit our Help Centre.`,
  },
];

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  lock: <LockIcon />,
  database: <DatabaseIcon />,
  shield: <ShieldIcon />,
  refresh: <RefreshIcon />,
  "eye-off": <EyeOffIcon />,
  alert: <AlertIcon />,
};

const severityColors: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  red: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
};

export default function SecurityPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-16">
          {/* <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-mono">
            <span>taskoria.com</span>
            <span>/</span>
            <span className="text-gray-600">security-policy</span>
          </div> */}
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-4">
            Security policy
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
            How Taskoria protects users, handles vulnerability reports, and what
            responsible security researchers can expect from us.
          </p>
          <div className="flex items-center gap-6 mt-8 pt-8 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                Version
              </p>
              <p className="text-sm font-medium text-gray-700">1.0</p>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                Last updated
              </p>
              <p className="text-sm font-medium text-gray-700">
                {LAST_UPDATED}
              </p>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                Contact
              </p>
              <a
                href="mailto:contact@taskoria.com"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                contact@taskoria.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Table of contents */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="flex flex-wrap gap-2">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 pb-24 space-y-20">
        {/* Introduction */}
        <section id="introduction">
          <SectionLabel>Introduction</SectionLabel>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            {sections[0].content}
          </p>
        </section>

        {/* Scope */}
        <section id="scope">
          <SectionLabel>Scope</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections[1].subsections?.map((sub) => (
              <div
                key={sub.title}
                className={`rounded-xl border p-5 ${
                  sub.type === "in"
                    ? "border-emerald-100 bg-emerald-50"
                    : "border-red-100 bg-red-50"
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-widest mb-3 ${
                    sub.type === "in" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {sub.title}
                </p>
                <ul className="space-y-2">
                  {sub.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span
                        className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${
                          sub.type === "in" ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Responsible disclosure */}
        <section id="reporting">
          <SectionLabel>Responsible disclosure</SectionLabel>
          <p className="text-gray-600 leading-relaxed text-[15px] mb-8">
            {sections[2].content}
          </p>
          <div className="space-y-0">
            {sections[2].steps?.map((step, i) => (
              <div key={step.number} className="flex gap-5 relative">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full border-2 border-gray-900 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-gray-900">
                      {step.number}
                    </span>
                  </div>
                  {i < (sections[2].steps?.length ?? 0) - 1 && (
                    <div className="w-px flex-1 bg-gray-200 my-1" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="font-semibold text-gray-900 mb-1">
                    {step.heading}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Response timelines */}
        <section id="response-sla">
          <SectionLabel>Response timelines</SectionLabel>
          <p className="text-gray-600 text-[15px] mb-6">
            {sections[5].content}
          </p>
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Severity
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Acknowledgement
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Target fix
                  </th>
                </tr>
              </thead>
              <tbody>
                {sections[5].sla?.map((row, i) => {
                  const c = severityColors[row.color];
                  return (
                    <tr
                      key={row.severity}
                      className={`${i < (sections[5].sla?.length ?? 0) - 1 ? "border-b border-gray-50" : ""}`}
                    >
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${c.dot}`}
                          />
                          {row.severity}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {row.acknowledge}
                      </td>
                      <td className="px-5 py-4 text-gray-600">{row.fix}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Safe harbour */}
        <section id="safe-harbor">
          <SectionLabel>Safe harbor</SectionLabel>
          <p className="text-gray-600 leading-relaxed text-[15px] mb-5">
            {sections[3].content}
          </p>
          <ul className="space-y-3">
            {sections[3].list?.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[15px] text-gray-600"
              >
                <span className="mt-1 shrink-0 text-emerald-500">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Data security practices */}
        <section id="data-security">
          <SectionLabel>How we protect your data</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections[4].practices?.map((p) => (
              <div
                key={p.heading}
                className="rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  {iconMap[p.icon]}
                  <p className="font-semibold text-sm text-gray-900">
                    {p.heading}
                  </p>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <SectionLabel>Contact</SectionLabel>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
            <p className="text-[15px] text-gray-600 leading-relaxed mb-5">
              {sections[6].content}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:security@taskoria.com"
                className="inline-flex items-center gap-2 text-sm font-medium bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email security team
              </a>
              <a
                href="/privacy"
                className="inline-flex items-center gap-2 text-sm font-medium border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-white transition-colors"
              >
                Privacy policy
              </a>
              <a
                href="/help"
                className="inline-flex items-center gap-2 text-sm font-medium border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-white transition-colors"
              >
                Help centre
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Footer note */}
      <div className="border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <p className="text-xs text-gray-400">
            This policy is reviewed annually. Last updated {LAST_UPDATED}.
            Taskoria Pty Ltd.
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-xl font-semibold text-gray-900">{children}</h2>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}
