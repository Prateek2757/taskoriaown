

import HowTaskoriaWorksInteractive from "./HowTaskoriaWorkInteractive";


const structuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Use Our Service Marketplace Platform",
  description:
    "Learn how to hire verified professionals in three simple steps using our AI-powered marketplace",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Post Your Job",
      text: "Describe your job, location, and preferred timing in a few simple steps so providers know exactly what you need.",
      url: "https://yourwebsite.com#step-1",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Receive Provider Responses",
      text: "Get quotes from relevant local professionals based on your service type, location, and job details.",
      url: "https://yourwebsite.com#step-2",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Compare and Hire",
      text: "Review profiles, pricing, and scope, then choose the provider that best fits your timeline and budget.",
      url: "https://yourwebsite.com#step-3",
    },
  ],
};

export default function HowTaskoriaWorks() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section
        className="relative py-14 px-4 sm:px-6 lg:px-8
          text-black bg-white
          dark:text-white dark:bg-[radial-gradient(circle_at_left,rgba(19,50,102,1)_0%,rgba(22,23,22,1)_30%,rgba(0,0,0,1)_100%)]"
        aria-labelledby="how-it-works-heading"
      >
        <div
          className="absolute inset-0 opacity-30 pointer-events-none dark:hidden"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "55px 55px",
          }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 opacity-20 pointer-events-none hidden dark:block"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "55px 55px",
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto relative">
          <div
            id="how-it-works-heading"
            className="text-4xl md:text-5xl flex justify-center font-black"
          >
            How hiring works on Taskoria
            <span className="block opacity-0 md:opacity-100 animate-fade-in">
              ...
            </span>
          </div>
          <p className="text-lg my-1 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Post for free, receive responses, and hire with confidence.
          </p>
        </div>

        <HowTaskoriaWorksInteractive />
      </section>
    </>
  );
}