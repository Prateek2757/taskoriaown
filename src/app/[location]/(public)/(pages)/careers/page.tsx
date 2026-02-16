import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at Taskoria | Build the Future of Local Services",
  description:
    "Explore career opportunities at Taskoria. Join our team and help shape the future of AI-powered service marketplaces.",
  keywords: [
    "Taskoria careers",
    "jobs at Taskoria",
    "startup jobs",
    "tech careers",
    "remote jobs",
  ],
  openGraph: {
    title: "Careers at Taskoria | Build the Future of Local Services",
    description:
      "Explore career opportunities at Taskoria. Join our team and help shape the future of AI-powered service marketplaces",
    url: "https://www.taskoria.com/careers",
    siteName: "Taskoria",
    images: [
      {
        url: "https://www.taskoria.com/og-careers.png",
        width: 1200,
        height: 630,
        alt: "Careers at Taskoria",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function CareersComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/40 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-400/15 dark:bg-cyan-500/8 rounded-full blur-3xl animate-float-slow"></div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10">
        <header className=" dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 absolute md:top-10 top-5 md:left-1 left-[-10]   flex items-center ">
            {/* <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-300 dark:hover:to-indigo-300 transition-all duration-300"
            >
              Taskoria
            </Link> */}
            {/* <Link
              href="/"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              ← Back to Home
            </Link> */}
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-0 md:py-4 ">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2  rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-sm font-medium shadow-sm animate-slide-down">
              <span className="relative  flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              coming Soon
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white animate-slide-up">
              Careers at <span className="text-blue-600">Taskoria</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-light leading-relaxed animate-slide-up-delayed">
              We're building something meaningful.
              <br />
              <span className="text-slate-500 dark:text-slate-400">
                Careers are coming soon.
              </span>
            </p>
          </div>

          <div className="mt-20 animate-fade-in-delayed">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>

              <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-400 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                      Our Mission
                    </h2>
                  </div>

                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    Taskoria is on a mission to connect people with trusted
                    professionals and empower local businesses through
                    technology. We're preparing to open roles across{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      engineering
                    </span>
                    ,{" "}
                    <span className="font-semibold text-blue-400 dark:text-indigo-400">
                      growth
                    </span>
                    ,{" "}
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                      operations
                    </span>
                    , and{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      support
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-3">
            {[
              {
                icon: "🎯",
                title: "Impact",
                description:
                  "Build products that positively affect real lives and communities",
                color: "blue",
              },
              {
                icon: "💡",
                title: "Innovation",
                description:
                  "Work with clean engineering and thoughtful design principles",
                color: "indigo",
              },
              {
                icon: "🚀",
                title: "Growth",
                description: "Own your work and grow alongside our mission",
                color: "cyan",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center space-y-6 animate-fade-in">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.linkedin.com/company/taskoria-au"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                Follow us on LinkedIn
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Be the first to know when we open new positions. Join our LinkedIn
              community for updates.
            </p>
          </div>
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Who We Are
                </h3>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Taskoria is a trusted service marketplace built to connect
                  people with skilled professionals for real-world tasks. We
                  focus on{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    reliability
                  </span>
                  ,{" "}
                  <span className="font-semibold text-indigo-500 dark:text-indigo-400">
                    transparency
                  </span>
                  , and{" "}
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                    meaningful work
                  </span>
                  — helping customers get things done while empowering local
                  service providers to grow their businesses.
                </p>
              </div>

              <div className="space-y-4 animate-fade-in-delayed">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  What We Value
                </h3>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed pb-3">
                  We value ownership, simplicity, and respect for the user. We
                  build with purpose, prioritize clarity over complexity, and
                  care deeply about trust—between customers, providers, and the
                  platform itself. If you enjoy solving practical problems and
                  building products that impact real people, Taskoria is built
                  for thinkers and doers like you.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Taskoria",
            url: "https://www.taskoria.com",
            logo: "https://www.taskoria.com/logo.png",
            description:
              "A modern service marketplace connecting people with trusted local professionals",
            sameAs: ["https://www.linkedin.com/company/taskoria-au"],
          }),
        }}
      />
    </div>
  );
}
