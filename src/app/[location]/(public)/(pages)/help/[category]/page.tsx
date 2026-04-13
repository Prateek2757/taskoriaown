import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Category, CATEGORY_GROUPS, CATEGORY_LABELS } from "../../help-center/articles";
import { Metadata } from "next";


interface Props {
  params: Promise<{ category: string }>;
}

const SIDEBAR_CATS: { key: Category; label: string }[] = [
  { key: "new", label: "New to Taskoria" },
  { key: "pro", label: "Professionals" },
  { key: "customer", label: "Customers" },
];

export function generateStaticParams() {
  return [{ category: "new" }, { category: "pro" }, { category: "customer" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {category} = await params;
  const label = CATEGORY_LABELS[category as Category];

  if (!category) return {};
  return { title: `${category} | Taskoria Help Center` };
}

export  default async function CategoryPage({ params }: Props) {
  const {category : cat} = await params;
  const groups = CATEGORY_GROUPS[cat];
  if (!groups) notFound();

  const label = CATEGORY_LABELS[cat];
  const isPro = cat === "pro";

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-100 via-blue-100 to-blue-200 py-10 px-6" />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6">
          <Link href="/help" className="hover:text-slate-600 transition-colors">
            Help Center
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-slate-700 font-medium">{label}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Categories
            </p>
            {SIDEBAR_CATS.map((s) => (
              <Link
                key={s.key}
                href={`/help/${s.key}`}
                className={`block px-3 py-1.5 rounded-lg text-sm mb-1 transition-colors ${
                  s.key === cat
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </aside>

          {/* Content */}
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 mb-8">{label}</h1>

            {/* Two-column layout for Professionals (many groups), single for others */}
            <div
              className={
                isPro
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-x-10"
                  : "grid grid-cols-1 gap-0"
              }
            >
              {groups.map((group) => (
                <div key={group.heading} className="mb-8">
                  <h2 className="text-sm font-semibold text-blue-600 mb-3">
                    {group.heading}
                  </h2>
                  <ul>
                    {group.articles.map((a) => (
                      <li
                        key={a.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <Link
                          href={`/help/${cat}/${a.id}`}
                          className="block py-2 text-sm text-blue-600 hover:underline"
                        >
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Can't find */}
      <div className="bg-gradient-to-br from-teal-50 to-blue-100 py-14 text-center mt-8">
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
