"use client";
import WorldMap from "@/components/ui/world-map";


export function WorldMapDemo() {
  return (
    <div className=" py-10 dark:bg-black bg-white ">
      {/* <div className="max-w-7xl mx-auto text-center">
        <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
          Remote{" "}
          <span className="text-neutral-400">
            {"Connectivity".split("").map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
          Break free from traditional boundaries. Work from anywhere, at the
          comfort of your own studio apartment. Perfect for Nomads and
          Travellers.
        </p>
      </div> */}
  <WorldMap
  dots={[
    // 🌎 North America
    {
      start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
      end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    },
    {
      start: { lat: 64.2008, lng: -149.4937 }, // Alaska
      end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
    },
    {
      start: { lat: -15.7975, lng: -47.8919 }, // Brazil
      end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
    },

    // 🌍 Europe & Asia
    {
      start: { lat: 51.5074, lng: -0.1278 }, // London
      end: { lat: 28.6139, lng: 77.209 }, // New Delhi
    },
    {
      start: { lat: 28.6139, lng: 77.209 }, // New Delhi
      end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
    },
    {
      start: { lat: 28.6139, lng: 77.209 }, // New Delhi
      end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
    },

    // 🇦🇺 Australia - Regional & Global
    {
      start: { lat: -33.8688, lng: 151.2093 }, // Sydney
      end: { lat: -37.8136, lng: 144.9631 }, // Melbourne
    },
    {
      start: { lat: -33.8688, lng: 151.2093 }, // Sydney
      end: { lat: -27.4698, lng: 153.0251 }, // Brisbane
    },
    {
      start: { lat: -33.8688, lng: 151.2093 }, // Sydney
      end: { lat: -31.9505, lng: 115.8605 }, // Perth
    },
    {
      start: { lat: -33.8688, lng: 151.2093 }, // Sydney
      end: { lat: -34.9285, lng: 138.6007 }, // Adelaide
    },
    {
      start: { lat: -33.8688, lng: 151.2093 }, // Sydney
      end: { lat: -12.4634, lng: 130.8456 }, // Darwin
    },
    {
      start: { lat: -33.8688, lng: 151.2093 }, // Sydney
      end: { lat: 28.6139, lng: 77.209 }, // New Delhi
    },
    {
      start: { lat: -33.8688, lng: 151.2093 }, // Sydney
      end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
    },
    {
      start: { lat: -33.8688, lng: 151.2093 }, // Sydney
      end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
    },
    {
      start: { lat: -33.8688, lng: 151.2093 }, // Sydney
      end: { lat: -15.7975, lng: -47.8919 }, // Brasília
    },
    {
      start: { lat: -33.8688, lng: 151.2093 }, // Sydney
      end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    },

    // 🇳🇵 Nepal - Global Connections
    {
      start: { lat: 27.7172, lng: 85.3240 }, // Kathmandu
      end: { lat: 28.6139, lng: 77.209 }, // New Delhi
    },
    {
      start: { lat: 27.7172, lng: 85.3240 }, // Kathmandu
      end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
    },
    {
      start: { lat: 27.7172, lng: 85.3240 }, // Kathmandu
      end: { lat: 51.5074, lng: -0.1278 }, // London
    },
    {
      start: { lat: 27.7172, lng: 85.3240 }, // Kathmandu
      end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    },
    {
      start: { lat: 27.7172, lng: 85.3240 }, // Kathmandu
      end: { lat: -33.8688, lng: 151.2093 }, // Sydney
    },
  ]}
/>
    </div>
  );
}
