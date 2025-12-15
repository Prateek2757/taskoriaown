export default function HowItWorksSection() {
    const steps = [
      {
        num: "1",
        title: "Tell Us What You Need",
        desc: "Share your requirements in just a few clicks. The more details, the better the matches!",
        gradient: "from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500",
        bg: "from-indigo-50 to-indigo-100/50 dark:from-indigo-950/50 dark:to-indigo-900/30",
        border: "border-indigo-200 dark:border-indigo-800"
      },
      {
        num: "2",
        title: "Get Free Quotes",
        desc: "Receive competitive quotes from verified professionals. Compare and choose the best fit.",
        gradient: "from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500",
        bg: "from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30",
        border: "border-purple-200 dark:border-purple-800"
      },
      {
        num: "3",
        title: "Hire with Confidence",
        desc: "Review profiles, check ratings, and hire the perfect provider for your needs.",
        gradient: "from-pink-600 to-red-600 dark:from-pink-500 dark:to-red-500",
        bg: "from-pink-50 to-pink-100/50 dark:from-pink-950/50 dark:to-pink-900/30",
        border: "border-pink-200 dark:border-pink-800"
      }
    ];
  
    return (
      <div className="mb-20">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold rounded-full text-sm mb-4">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Three Simple Steps
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Getting the help you need has never been easier
          </p>
        </div>
  
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className={`relative bg-gradient-to-br ${step.bg} rounded-3xl p-8 border-2 ${step.border} hover:shadow-xl transition-all hover:-translate-y-1`}
            >
              <div className={`absolute -top-6 left-8 w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-xl`}>
                {step.num}
              </div>
              <div className="pt-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }