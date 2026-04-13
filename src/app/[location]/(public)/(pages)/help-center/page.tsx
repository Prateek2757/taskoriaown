import Link from "next/link";
import { Search, Mail } from "lucide-react";
import { ARTICLES, POPULAR_ARTICLES } from "./articles";
import HelpSearch from "./HelpSearch";

export const metadata = {
  title: "Help Center | Taskoria",
  description: "Find answers to your questions about using Taskoria.",
};

const CATEGORIES = [
  {
    key: "new",
    label: "New to Taskoria",
    description: "Discover everything you need to know to start your journey",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <rect x="10" y="10" width="28" height="28" rx="14" stroke="#2563eb" strokeWidth="2" fill="none" />
        <path d="M18 24h12M24 18v12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="24" r="6" fill="#dbeafe" />
      </svg>
    ),
  },
  {
    key: "pro",
    label: "Professionals",
    description: "How Taskoria works for service professionals",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <path d="M20 28c-6 0-11 3-11 7v1h22v-1c0-4-5-7-11-7z" stroke="#2563eb" strokeWidth="2" fill="none" />
        <circle cx="20" cy="19" r="7" stroke="#2563eb" strokeWidth="2" fill="#dbeafe" />
        <path d="M32 14v12M26 20h12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "customer",
    label: "Customers",
    description: "Using Taskoria and getting quotes from pros",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <circle cx="16" cy="18" r="5" stroke="#2563eb" strokeWidth="2" fill="#dbeafe" />
        <circle cx="32" cy="18" r="5" stroke="#2563eb" strokeWidth="2" fill="#dbeafe" />
        <circle cx="24" cy="22" r="6" stroke="#2563eb" strokeWidth="2" fill="#bfdbfe" />
        <path d="M10 36c0-4 5-7 14-7s14 3 14 7" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
] as const;

export default function HelpCenterPage() {
  // Split popular articles into 3 columns
  const col1 = POPULAR_ARTICLES.slice(0, 4);
  const col2 = POPULAR_ARTICLES.slice(4, 8);
  const col3 = POPULAR_ARTICLES.slice(8, 12);

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-100 via-blue-100 to-blue-200 py-12 px-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          How can we help you?
        </h1>
        <HelpSearch />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Categories */}
        <h2 className="text-xl font-semibold text-center text-slate-800 mb-8">
          Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={`/help/${cat.key}`}
              className="flex flex-col items-center text-center rounded-2xl border border-slate-200 bg-white p-8 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <div className="mb-4">{cat.icon}</div>
              <h3 className="text-base font-medium text-slate-800 mb-2">{cat.label}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{cat.description}</p>
            </Link>
          ))}
        </div>

        {/* Popular */}
        <h2 className="text-xl font-semibold text-center text-slate-800 mb-6">
          Popular
        </h2>
        <div className="bg-slate-50 rounded-2xl p-6 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            {[col1, col2, col3].map((col, ci) => (
              <div key={ci} className={ci > 0 ? "sm:pl-8" : ""}>
                {col.map((item) => {
                  const article = ARTICLES[item.id];
                  if (!article) return null;
                  return (
                    <Link
                      key={item.id}
                      href={`/help/${item.cat}/${item.id}`}
                      className="block py-2.5 text-sm text-blue-600 hover:underline border-b border-slate-200 last:border-0"
                    >
                      {article.title}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Get in touch */}
        <h2 className="text-lg font-medium text-slate-800 mb-3">Get in touch</h2>
        <Link
          href="/help/new/contact-us"
          className="flex items-start gap-4 border border-slate-200 rounded-xl bg-white p-5 hover:border-blue-300 hover:bg-slate-50 transition-all duration-200"
        >
          <div className="mt-0.5 shrink-0">
            <Mail className="w-7 h-7 text-blue-500" />
          </div>
          <div>
            <p className="font-medium text-blue-600 mb-1">Contact us</p>
            <p className="text-sm text-slate-500">
              Have a question or experiencing an issue? Submit a request or call us to speak with a member of our team.
            </p>
          </div>
        </Link>
      </div>

      {/* Can't find */}
      <div className="bg-gradient-to-br from-teal-50 to-blue-100 py-14 text-center">
        <h3 className="text-xl font-semibold text-slate-800 mb-5">
          Can't find what you're looking for?
        </h3>
        <Link
          href="/help/new/contact-us"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-7 py-3 rounded-full transition-colors"
        >
          Submit a request
        </Link>
      </div>
    </>
  );
}
