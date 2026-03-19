import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, FileText, Award, Star, Zap, Lock, BadgeCheck } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Provider Verification Badges | Taskoria Trust Levels",
  description:
    "Learn what each Taskoria verification badge represents and the thorough checks behind them. Find trustworthy service providers across Australia.",
  openGraph: {
    title: "Provider Verification Badges | Taskoria Trust Levels",
    description:
      "Explore Taskoria's verification badges and understand the rigorous checks providers go through to earn them.",
  },
};

const badges = [
  {
    id: "plus",
    name: "Taskoria Plus Verified",
    tagline: "Trusted starting point for providers",
    icon: <Award className="w-10 h-10 text-amber-600" />,
    ringColor: "ring-amber-400",
    bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20",
    badgeBg: "bg-amber-100 dark:bg-amber-900/30",
    accentText: "text-amber-700 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800",
    pill: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    requirements: [
      {
        icon: <CheckCircle className="w-5 h-5 text-amber-600" />,
        title: "Identity Verification",
        detail: "Government-issued photo ID confirmed for authenticity.",
      },
      {
        icon: <FileText className="w-5 h-5 text-amber-600" />,
        title: "ABN Verification",
        detail: "Business registration verified through Australian Business Register.",
      },
    ],
    bestFor: "General handymen, cleaners, gardeners, movers, and other non-licensed services.",
    trustPoints: [
      "Verified identity",
      "Active business registration",
      "Eligible for Taskoria protection",
    ],
  },
  {
    id: "pro",
    name: "Taskoria Pro Verified",
    tagline: "Licensed & accountability-checked",
    icon: <Shield className="w-10 h-10 text-slate-500" />,
    ringColor: "ring-slate-400",
    bgGradient: "from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/20",
    badgeBg: "bg-slate-100 dark:bg-slate-800/50",
    accentText: "text-slate-700 dark:text-slate-300",
    borderColor: "border-slate-200 dark:border-slate-700",
    pill: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    requirements: [
      {
        icon: <CheckCircle className="w-5 h-5 text-slate-500" />,
        title: "Includes All Plus Checks",
        detail: "Identity and business verification already completed.",
      },
      {
        icon: <BadgeCheck className="w-5 h-5 text-slate-500" />,
        title: "Trade Licence Verification",
        detail: "Licences confirmed directly with the relevant state authority.",
      },
    ],
    bestFor:
      "Licensed tradespeople such as electricians, plumbers, builders, and other regulated professionals.",
    trustPoints: [
      "All Plus checks completed",
      "Active trade licence verified",
      "Confirmed with state licensing authority",
      "Required for regulated trade work",
    ],
  },
  {
    id: "pro-max",
    name: "Taskoria Pro Max Verified",
    tagline: "Highest level of provider trust",
    icon: <Star className="w-10 h-10 text-yellow-500" />,
    ringColor: "ring-yellow-400",
    bgGradient: "from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/20",
    badgeBg: "bg-yellow-100 dark:bg-yellow-900/30",
    accentText: "text-yellow-700 dark:text-yellow-400",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    pill: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    requirements: [
      {
        icon: <CheckCircle className="w-5 h-5 text-yellow-600" />,
        title: "All Pro Checks Completed",
        detail: "Full identity, ABN, and trade licence verifications done.",
      },
      {
        icon: <Lock className="w-5 h-5 text-yellow-600" />,
        title: "Insurance Validation",
        detail: "Insurance coverage validated for professional work safety.",
      },
    ],
    bestFor:
      "High-value projects, commercial work, renovations, and customers requiring maximum confidence.",
    trustPoints: [
      "All Pro verifications completed",
      "Insurance coverage confirmed",
      "Highest tier of job protection on Taskoria",
    ],
  },
];

const comparisonRows = [
  { label: "Identity Verification", plus: true, pro: true, proMax: true },
  { label: "ABN Verification", plus: true, pro: true, proMax: true },
  { label: "Trade Licence Verification", plus: false, pro: true, proMax: true },
  { label: "Insurance Checked", plus: false, pro: false, proMax: true },
  { label: "State Authority Confirmation", plus: false, pro: true, proMax: true },
  { label: "Taskoria Standard Job Protection", plus: true, pro: true, proMax: true },
  { label: "Enhanced Job Protection", plus: false, pro: false, proMax: true },
];

const Tick = () => <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />;
const Cross = () => <span className="block w-5 h-0.5 bg-muted-foreground/30 mx-auto rounded-full" />;

const VerificationBadgesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-2 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-200/20 dark:bg-amber-800/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-yellow-200/20 dark:bg-yellow-800/10 blur-3xl" />
        <div className="flex items-center justify-center sm:justify-start px-6 py-2">
  <Link
    href="/trust-safety"
    className="
      inline-flex items-center gap-2
      px-4 py-1 rounded-full
      text-sm font-medium
      bg-muted hover:bg-muted/70
      border border-border
      text-muted-foreground hover:text-foreground
      transition-all duration-200
      shadow-sm hover:shadow-md
      hover:-translate-y-0.5
    "
  >
    ← Back to Trust & Safety
  </Link>
</div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 px-4 py-3 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              Australian Provider Verification
            </div>
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              Understanding <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">Taskoria Verification Badges</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Every badge represents a verified step in building trust — not just a self-declaration. Learn what we check and why it matters.
            </p>
         
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-10">
            {badges.map((badge, i) => (
              <Card
                key={badge.id}
                className={`border-2 ${badge.borderColor} py-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300`}
              >
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${badge.bgGradient}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-8 pb-6">
                      <div className={`${badge.badgeBg} ring-2 ${badge.ringColor} w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <h2 className="text-2xl font-bold text-foreground">{badge.name}</h2>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.pill}`}>
                            Tier {i + 1}
                          </span>
                        </div>
                        <p className={`text-sm font-medium ${badge.accentText}`}>{badge.tagline}</p>
                      </div>
                    </div>

                    <div className="px-8 pb-8 grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                          Verification Requirements
                        </h3>
                        <div className="space-y-4">
                          {badge.requirements.map((req, j) => (
                            <div key={j} className="flex items-start gap-3">
                              <div className="mt-0.5 flex-shrink-0">{req.icon}</div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{req.title}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{req.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                            Best For
                          </h3>
                          <p className="text-sm text-foreground leading-relaxed">{badge.bestFor}</p>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                            What You Can Trust
                          </h3>
                          <ul className="space-y-2">
                            {badge.trustPoints.map((pt, k) => (
                              <li key={k} className="flex items-center gap-2 text-sm text-foreground">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                {pt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-3">Side-by-Side Comparison</h2>
              <p className="text-muted-foreground">All verification steps at a glance — choose the right level of confidence.</p>
            </div>

            <Card className="border-2 overflow-hidden py-0 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/60">
                      <th className="text-left px-6 py-4 text-muted-foreground font-semibold w-1/2">
                        Verification Check
                      </th>
                      {["Plus", "Pro", "Pro Max"].map((t) => (
                        <th key={t} className="text-center px-4 py-4 text-foreground font-bold">{t}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr key={i} className={`border-b last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                        <td className="px-6 py-3 text-foreground">{row.label}</td>
                        <td className="px-4 py-3">{row.plus ? <Tick /> : <Cross />}</td>
                        <td className="px-4 py-3">{row.pro ? <Tick /> : <Cross />}</td>
                        <td className="px-4 py-3">{row.proMax ? <Tick /> : <Cross />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Common Questions</h2>
            </div>

            {[
              {
                q: "Can a provider earn multiple badges?",
                a: "No. Providers only display their highest earned badge. Pro Max automatically includes all Plus and Pro checks.",
              },
              {
                q: "How often are badges re-verified?",
                a: "ABN and identity are checked annually. Trade licences and insurance are re-verified at scheduled intervals.",
              },
              {
                q: "What if a badge lapses?",
                a: "The badge is removed immediately and the provider cannot accept new jobs until verification is renewed. Existing bookings are unaffected.",
              },
              {
                q: "Do I need a Pro Max provider for all jobs?",
                a: "Not necessarily. Plus providers are suitable for general, non-licensed tasks. Pro or Pro Max is recommended for high-value or regulated work.",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b pb-5 last:border-0">
                <p className="font-semibold text-foreground mb-1">{faq.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VerificationBadgesPage;