import type { MetadataRoute } from "next";


 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.taskoria.com";
  const currentDate = new Date();

 
  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/providers`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];


  const companyPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/trust-safety`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // ==========================================
  // LEGAL PAGES
  // ==========================================
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // ==========================================
  // ALL SERVICE PAGES (140+ services)
  // ==========================================
  const services = [
    // Home & Property Services
    "house-cleaning",
    "electricians",
    "gardening-lawn-mowing",
    "plumbers",
    "air-conditioning-heating",
    "roofing",
    "tiling-flooring",
    "pest-control",
    "fencing",
    "pool-maintenance",
    "removalists",
    "window-gutter-cleaning",
    "carpet-cleaning",
    "bathroom-renovation",
    "kitchen-renovation",
    "landscaping",
    "concreting",
    "bricklaying",
    "carpentry",
    "decking",
    "cladding",
    "gate-installation",
    "glaziers",
    "cleaning",
    "commercial-cleaning",
    "clearance-services",
    "building-and-construction",
    "appliances",
    "assembly",
    "furniture-assembly",
    "furniture-repair",
    "flooring",
    "heating-and-cooling",
    "home-automation-and-security",
    "home-theatre",
    "interior-designer",
    
    // Professional & Business Services
    "accounting-taxation",
    "accounting",
    "business-consulting",
    "legal-services",
    "graphic-design",
    "web-design-development",
    "seo-google-ads",
    "social-media-management",
    "content-writing",
    "virtual-assistants",
    "resume-linkedin-writing",
    "business-coaching",
    "app-development",
    "software-development",
    "cloud-consulting",
    "cybersecurity-services",
    "it-support",
    "data-analytics-automation",
    "ui-ux-design",
    "admin",
    "business",
    "computers-and-it",
    "design",
    "draftsman",
    "architects",
    
    // Events & Creative Services
    "wedding-photography",
    "videography",
    "makeup-hair-styling",
    "event-planning",
    "catering-services",
    "catering",
    "florists",
    "florist",
    "dj-entertainment",
    "entertainment",
    "events",
    "audio-visual",
    "chef",
    "cooking",
    
    // Health & Wellness
    "nutritionists",
    "yoga-pilates",
    "massage-therapy",
    "personal-trainers",
    "life-coaching",
    "counselling",
    "counselling-and-therapy",
    "career-coaching",
    "coaching",
    "fitness",
    "health-and-wellness",
    "beauticians",
    "hairdressers",
    "barbers",
    "hair-removal",
    
    // Education & Learning
    "tutoring",
    "english-lessons",
    "music-lessons",
    "dance-lessons",
    
    // Pet Services
    "pet-grooming",
    "dog-walking",
    "pet-sitting",
    "dog-care",
    "cat-care",
    
    // Automotive Services
    "car-servicing",
    "car-service",
    "car-wash-detailing",
    "car-wash",
    "car-detailing",
    "roadside-assistance",
    "mobile-mechanics",
    "car-repair",
    "car-inspection",
    "car-body-work",
    "auto-electricians",
    
    // Delivery & Transportation
    "courier-services",
    "delivery",
    "balloon-delivery",
    "cake-delivery",
    "coffee-delivery",
    "dessert-delivery",
    "flower-delivery",
    "food-delivery",
    "fresh-food-delivery",
    "gift-delivery",
    "grocery-delivery",
    "driving",
    
    // Specialized Services
    "alterations",
    "bakers",
    "bicycle-service",
    "childcare-and-safety",
    "electronic-repair",
    "engraving",
    "home-and-lifestyle",
  ];

  // Remove duplicates from services array
  const uniqueServices = [...new Set(services)];
  
  // Generate service page entries
  const servicePages: MetadataRoute.Sitemap = uniqueServices.map((service) => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // ==========================================
  // COMBINE ALL PAGES
  // ==========================================
  return [
    ...corePages,      // 3 pages
    ...companyPages,   // 3 pages
    ...legalPages,     // 3 pages
    ...servicePages,   // 140+ pages
  ];
}