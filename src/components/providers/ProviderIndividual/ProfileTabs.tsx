"use client";

import { useState } from "react";
import { PortfolioTab } from "./PortfolioTab";
import { ServicesTab } from "./ServicesTab";
import { ReviewsTab } from "./ReviewsTab";
import { AboutTab } from "./AboutTab";
import { FAQTab } from "./FAQTab";
import { SocialTab } from "./SocialTab";
import {
  ImageIcon, Briefcase, Star, User, HelpCircle, Share2,
   Clock, Globe, Languages,
  ThumbsUp, MessageSquare,  Sparkles,
   Calendar, Pencil,
   ChevronDown, ChevronUp
} from "lucide-react";

interface ProfileTabsProps {
  provider: any;
  photos: any[];
  profileServices: any[];
  reviews: any[];
  accreditations: any[];
  faqs: any[];
  socialLinks: any[];
  certifications: string[];
  languages: string[];
}

function Section({
  icon,
  title,
  count,
  children,
  showEdit = false,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number | string | null;
  children: React.ReactNode;
  showEdit?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-[#1d2226] border border-[#e2e2e2] dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/8">
        <span className="text-blue-600 dark:text-blue-400">{icon}</span>
        <h2 className="flex-1 text-[0.95rem] font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {title}
        </h2>
        {count != null && (
          <span className="text-xs text-gray-400 font-normal tabular-nums">{count}</span>
        )}
        {/* {showEdit && (
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors ml-1">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )} */}
      </div>
      {children}
    </div>
  );
}

function StatStrip({ stats }: { stats: { value: string | number; label: string; color?: string }[] }) {
  return (
    <div className="flex border-b border-gray-100 dark:border-white/8">
      {stats.map((s, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center py-4 border-r border-gray-100 dark:border-white/8 last:border-r-0"
        >
          <span className="text-xl font-bold tabular-nums" style={{ color: s.color ?? "#0a66c2" }}>
            {s.value}
          </span>
          <span className="text-[0.68rem] text-gray-400 uppercase tracking-wider mt-1">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function ShowMore({
  items,
  threshold = 3,
  renderItem,
}: {
  items: any[];
  threshold?: number;
  renderItem: (item: any, i: number) => React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, threshold);
  return (
    <>
      {visible.map((item, i) => renderItem(item, i))}
      {items.length > threshold && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 w-full px-5 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors border-t border-gray-100 dark:border-white/8"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {expanded ? "Show less" : `Show ${items.length - threshold} more`}
        </button>
      )}
    </>
  );
}

export function ProfileTabs({
  provider,
  photos,
  profileServices,
  reviews,
  accreditations,
  faqs,
  socialLinks,
  certifications,
  languages,
}: ProfileTabsProps) {
  const hasPhotos   = photos.length > 0;
  const hasServices = profileServices.length > 0;
  const hasReviews  = reviews.length > 0;
  const hasAbout    = certifications.length > 0 || languages.length > 0 ||
                      accreditations.length > 0 || !!provider.availability || !!provider.joineddate;
  const hasFAQs     = faqs.length > 0;
  const hasSocial   = socialLinks.length > 0;

  const rating        = provider.avg_rating ?? provider.rating ?? "4.8";
  const reviewCount   = provider.total_reviews ?? provider.reviewCount ?? 0;
  const completedJobs = provider.jobscompleted ?? provider.completedJobs ?? 0;

  if (!(hasPhotos || hasServices || hasReviews || hasAbout || hasFAQs || hasSocial)) return null;

  return (
    <div className="flex flex-col gap-3">

      {/* ════ PORTFOLIO ════ */}
      {hasPhotos && (
        <Section
          icon={<ImageIcon className="w-4 h-4" />}
          title="Work Portfolio"
          count={`${photos.length} items`}
          showEdit
        >
          {/* <ShowMore
            items={photos}
            threshold={4}
            renderItem={(p, i) => (
              <div
                key={i}
                className="flex items-start gap-4 px-5 py-4 border-b border-gray-50 dark:border-white/5 last:border-b-0 hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors group"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 flex-shrink-0 flex items-center justify-center">
                  {p.url ? (
                    <img src={p.url} alt={p.title ?? ""} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {p.title ?? `Portfolio item ${i + 1}`}
                  </p>
                  {p.description && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                      {p.description}
                    </p>
                  )}
                  {p.date && (
                    <p className="mt-1.5 text-xs text-gray-400">{p.date}</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          /> */}
          <PortfolioTab photos={photos} />
        </Section>
      )}

      {hasServices && (
        <Section
          icon={<Briefcase className="w-4 h-4" />}
          title="Services"
          count={`${profileServices.length} services`}
          showEdit
        >
          {/* <StatStrip stats={[
            { value: profileServices.length, label: "Listed" },
            { value: completedJobs || "—", label: "Completed" },
            { value: rating, label: "Rating" },
          ]} /> */}

          <ShowMore
            items={profileServices}
            threshold={4}
            renderItem={(s, i) => (
              <div
                key={i}
                className="flex items-start gap-4 px-5 py-4 border-b border-gray-50 dark:border-white/5 last:border-b-0 hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors border-l-2 border-l-blue-500 dark:border-l-blue-400 group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {s.name ?? s.title ?? `Service ${i + 1}`}
                    </p>
                    {s.price && (
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap flex-shrink-0 tabular-nums">
                        {s.price}
                      </span>
                    )}
                  </div>
                  {s.description && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                      {s.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {s.duration && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" /> {s.duration}
                      </span>
                    )}
                    {s.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-gray-400">
                        {s.category}
                      </span>
                    )}
                  </div>
                </div>
                {/* <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity" /> */}
              </div>
            )}
          />

          {profileServices.length === 0 && (
            <div className="px-5 py-4"><ServicesTab profileServices={profileServices} /></div>
          )}
        </Section>
      )}

      {hasReviews && (
        <Section
          icon={<Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
          title="Client Reviews"
          count={`${reviewCount} reviews`}
        >
          <StatStrip stats={[
            { value: rating, label: "Avg Rating", color: "#f59e0b" },
            { value: reviewCount, label: "Total" },
            { value: reviews.filter((r: any) => (r.rating ?? 5) >= 4).length, label: "4–5 Star", color: "#10b981" },
          ]} />

          <ShowMore
            items={reviews}
            threshold={3}
            renderItem={(r, i) => (
              <div
                key={i}
                className="px-5 py-4 border-b border-gray-50 dark:border-white/5 last:border-b-0"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 grid place-content-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                    {(r.reviewer_name ?? r.name ?? "A").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {r.reviewer_name ?? r.name ?? "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-400">{r.date ?? r.created_at ?? "Recent"}</p>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-3.5 h-3.5 ${j < (r.rating ?? 5) ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-gray-700"}`}
                      />
                    ))}
                  </div>
                </div>

                {r.service && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800 mb-2">
                    <Briefcase className="w-2.5 h-2.5" /> {r.service}
                  </span>
                )}

                {r.comment && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                    {r.comment}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-gray-100 dark:border-white/5">
                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Helpful{r.helpful_count ? ` (${r.helpful_count})` : ""}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" /> Reply
                  </button>
                </div>
              </div>
            )}
          />

          {reviews.length === 0 && (
            <div className="px-5 py-4"><ReviewsTab reviews={reviews} /></div>
          )}
        </Section>
      )}

      {hasAbout && (
        <Section icon={<User className="w-4 h-4" />} title="About" showEdit>

          {/* {certifications.length > 0 && (
            <div className="flex items-start gap-4 px-5 py-4 border-b border-gray-50 dark:border-white/5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
                    >
                      <BadgeCheck className="w-3 h-3" /> {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )} */}

          {languages.length > 0 && (
            <div className="flex items-start gap-4 px-5 py-4 border-b border-gray-50 dark:border-white/5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Languages</p>
                <div className="flex flex-col gap-2">
                  {languages.map((l, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Globe className="w-3.5 h-3.5 text-gray-400" /> {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* {accreditations.length > 0 && (
            <div className="flex items-start gap-4 px-5 py-4 border-b border-gray-50 dark:border-white/5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Accreditations</p>
                <div className="flex flex-col gap-2">
                  {accreditations.map((a: any, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {typeof a === "string" ? a : (a.name ?? JSON.stringify(a))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )} */}

          {provider.availability && (
            <div className="flex items-start gap-4 px-5 py-4 border-b border-gray-50 dark:border-white/5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Availability</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{provider.availability}</p>
              </div>
            </div>
          )}

          {/* {provider.joineddate && (
            <div className="flex items-start gap-4 px-5 py-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Member Since</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{provider.joineddate}</p>
              </div>
            </div>
          )} */}

          <div className="px-5 py-2">
            <AboutTab certifications={certifications} languages={languages}
              accreditations={accreditations} provider={provider} />
          </div>
        </Section>
      )}

      {/* ════ FAQ ════ */}
      {hasFAQs && (
        <Section
          icon={<HelpCircle className="w-4 h-4" />}
          title="Frequently Asked Questions"
          count={`${faqs.length} answers`}
          showEdit
        >
          <ShowMore
            items={faqs}
            threshold={4}
            renderItem={(f, i) => (
              <div
                key={i}
                className="px-5 py-4 border-b border-gray-50 dark:border-white/5 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
                  Q: {f.question ?? f.q ?? `Question ${i + 1}`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                  {f.answer ?? f.a ?? "Answer coming soon."}
                </p>
              </div>
            )}
          />
          {faqs.length === 0 && <div className="px-5 py-4"><FAQTab faqs={faqs} /></div>}
        </Section>
      )}

      {hasSocial && (
        <Section
          icon={<Share2 className="w-4 h-4" />}
          title="Social &amp; Links"
          count={`${socialLinks.length} links`}
          showEdit
        >
          {/* {socialLinks.map((s: any, i: number) => (
            <a
              key={i}
              href={s.url ?? s.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 dark:border-white/5 last:border-b-0 hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <Link2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline transition-colors">
                  {s.platform ?? s.name ?? `Link ${i + 1}`}
                </p>
                {(s.url ?? s.link) && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{s.url ?? s.link}</p>
                )}
              </div>
              <ExternalLink className="w-4 h-4 text-gray-300 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))} */}

          <div className="px-5 py-2">
            <SocialTab socialLinks={socialLinks} />
          </div>
        </Section>
      )}

    </div>
  );
}