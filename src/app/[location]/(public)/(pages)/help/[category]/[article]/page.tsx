import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { ARTICLES, Category, CATEGORY_GROUPS, CATEGORY_LABELS } from "../../../help-center/articles";
import { Metadata } from "next";


interface Props {
  params: Promise<{ category: string; article: string }>;
}

const SIDEBAR_CATS: { key: Category; label: string }[] = [
  { key: "new", label: "New to Taskoria" },
  { key: "pro", label: "Professionals" },
  { key: "customer", label: "Customers" },
];

export function generateStaticParams() {
  return Object.values(ARTICLES).map((a) => ({
    category: a.cat,
    article: a.id,
  }));
}

export async function  generateMetadata({ params }: Props):Promise<Metadata> {
  const {article:articleprop} = await params
  const article = ARTICLES[articleprop];

  if (!article) return {};
  return { title: `${article.title} | Taskoria Help Center` };
}

export default async function ArticlePage({ params }: Props) {
    const {article:articleprop} = await params
  const article = ARTICLES[articleprop];
//   if (!article || article.cat !== articleprop) notFound();

  const cat = article.cat as Category;
  const catLabel = CATEGORY_LABELS[cat];

  // Sidebar: find articles in the same category for "related" links
  const catGroups = CATEGORY_GROUPS[cat];
  const relatedGroup = catGroups.find((g) =>
    g.articles.some((a) => a.id === article.id)
  );

  return (
    <>
      {/* <div className="bg-gradient-to-br from-teal-100 via-blue-100 to-blue-200 h-16" /> */}

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-1.5 text-sm text-slate-400 mb-6">
          <Link href="/help" className="hover:text-slate-600 transition-colors">
            Help Center
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link
            href={`/help/${cat}`}
            className="hover:text-slate-600 transition-colors"
          >
            {catLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-slate-700 font-medium">{article.title}</span>
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

            {/* Related articles in same group */}
            {relatedGroup && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Related
                </p>
                {relatedGroup.articles
                  .filter((a) => a.id !== article.id)
                  .slice(0, 5)
                  .map((a) => (
                    <Link
                      key={a.id}
                      href={`/help/${cat}/${a.id}`}
                      className="block px-3 py-1.5 text-sm text-blue-600 hover:underline mb-1"
                    >
                      {a.title}
                    </Link>
                  ))}
              </div>
            )}
          </aside>

          {/* Article body */}
          <article>
            <h1 className="text-2xl font-semibold text-slate-900 mb-6">
              {article.title}
            </h1>

            <div
              className="
                prose prose-slate max-w-none
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-h3:text-slate-800 prose-h3:font-semibold prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                prose-ul:text-slate-600 prose-li:my-1
                prose-a:text-blue-600
              "
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Helpful feedback */}
            <div className="mt-10 pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-3">Was this article helpful?</p>
              <div className="flex gap-3">
                <HelpfulButton positive />
                <HelpfulButton positive={false} />
              </div>
            </div>
          </article>
        </div>

        {/* Back link */}
        <div className="mt-10">
          <Link
            href={`/help/${cat}`}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            Back to {catLabel}
          </Link>
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

function HelpfulButton({ positive }: { positive: boolean }) {
  // Client interaction would need a separate "use client" component;
  // this is the static shell — wire onClick to your analytics/feedback API.
  return (
    <button
      className="flex items-center gap-1.5 border border-slate-200 rounded-full px-4 py-2 text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
    >
      {positive ? (
        <ThumbsUp className="w-4 h-4" />
      ) : (
        <ThumbsDown className="w-4 h-4" />
      )}
      {positive ? "Yes" : "No — contact support"}
    </button>
  );
}