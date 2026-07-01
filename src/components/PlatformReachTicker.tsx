import Marquee from "./ui/marquee";

const TICKER_ITEMS_ROW1 = [
  ["🏠", "House Cleaning"],
  ["🔧", "Plumbing"],
  ["⚡", "Electricians"],
  ["🌿", "Gardening"],
  ["🔨", "Handyman"],
  ["🚛", "Removalists"],
  ["🖌️", "Painting"],
  ["💻", "Web Design"],
  ["📸", "Photography"],
  ["💪", "Personal Training"],
  ["🐛", "Pest Control"],
  ["🏊", "Pool Maintenance"],
  ["🔑", "Locksmith"],
  ["🎨", "Graphic Design"],
  ["🚗", "Mobile Mechanic"],
  ["🌳", "Landscaping"],
  ["🏗️", "Building & Construction"],
  ["🪴", "Tree Surgery"],
  ["🧹", "End of Lease Cleaning"],
  ["🔌", "Home Automation"],
  ["🎉", "Event Planning"],
  ["📊", "Accounting"],
];

const TICKER_ITEMS_ROW2 = [
  ["🐕", "Dog Walking"],
  ["🎓", "Tutoring"],
  ["💆", "Massage Therapy"],
  ["🎸", "Music Lessons"],
  ["🍽️", "Catering"],
  ["📱", "App Development"],
  ["🛡️", "Cybersecurity"],
  ["☁️", "Cloud Consulting"],
  ["🏋️", "Fitness Training"],
  ["✂️", "Hairdressers"],
  ["🐈", "Cat Care"],
  ["🚿", "Carpet Cleaning"],
  ["🪟", "Window Cleaning"],
  ["🏠", "Airbnb Cleaning"],
  ["🎤", "DJ & Entertainment"],
  ["🌸", "Florists"],
  ["🤸", "Yoga & Pilates"],
  ["📝", "Resume Writing"],
  ["🎬", "Videography"],
  ["🏡", "Interior Design"],
  ["🔍", "SEO & Google Ads"],
  ["👗", "Tailors"],
];

function TickerItem({ icon, name }: { icon: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-slate-700 dark:text-slate-200">
      {icon} {name}
    </span>
  );
}

export default function PlatformReachTicker() {
  return (
    <section
      aria-label="Taskoria platform reach"
      className="relative border-y border-slate-200/80 bg-[#ecf0f7] text-slate-700 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_center,rgba(19,50,102,1)_0%,rgba(0,0,0,1)_50%,rgba(0,0,0,1)_90%)] dark:text-slate-300"
    >
      <div className="mx-auto max-w-7xl py-2">
        <Marquee
          pauseOnHover
          duration="140s"
          className="mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] text-sm font-medium"
        >
          {TICKER_ITEMS_ROW1.map(([icon, name]) => (
            <TickerItem key={`${icon}-${name}`} icon={icon} name={name} />
          ))}
        </Marquee>

        <Marquee
          pauseOnHover
          reverse
          duration="140s"
          className="mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] text-sm font-medium"
        >
          {TICKER_ITEMS_ROW2.map(([icon, name]) => (
            <TickerItem key={`${icon}-${name}`} icon={icon} name={name} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
