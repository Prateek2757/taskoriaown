"use client";

import  { useEffect, useRef, useState } from "react";
import { MapPin, Maximize2, Minimize2, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    google: any;
  }
}

export default function LocationMap({
  name,
  latitude,
  longitude,
}: {
  name: string;
  latitude: number;
  longitude: number;
  apiKey?: string;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const GOOGLE_MAPS_API_KEY =  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const initMap = () => {
    if (!mapRef.current || mapInstance.current || !window.google) return;

    try {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 13,
        mapId: "DEMO_MAP_ID", 
        mapTypeId: "satellite",
        disableDefaultUI: false,
        mapTypeControl: true,
        streetViewControl: true,
        zoomControl: true,
      });

      circleRef.current = new window.google.maps.Circle({
        map: mapInstance.current,
        center: { lat: latitude, lng: longitude },
        radius: 800,
        fillColor: "#3b82f6",
        fillOpacity: 0.2,
        strokeColor: "#3b82f6",
        strokeWeight: 2,
      });

      setIsLoading(false);
      setError(null);
    } catch (error: any) {
      console.error("Error initializing map:", error);
      setError(error.message || "Failed to initialize map");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'undefined') {
      setError("Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file");
      setIsLoading(false);
      return;
    }

    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    
    if (existingScript) {
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogle);
          initMap();
        }
      }, 100);

      setTimeout(() => {
        if (!window.google || !window.google.maps) {
          clearInterval(checkGoogle);
          setError("Failed to load Google Maps - timeout");
          setIsLoading(false);
        }
      }, 10000);
      
      return () => clearInterval(checkGoogle);
    }

    // Load the script for the first time
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Wait a bit for libraries to load
      setTimeout(initMap, 100);
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      setError("Failed to load Google Maps. Please check your API key and internet connection.");
      setIsLoading(false);
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup handled by browser
    };
  }, [latitude, longitude, name, GOOGLE_MAPS_API_KEY]);

  useEffect(() => {
    if (!mapInstance.current || !window.google) return;

    const pos = { lat: latitude, lng: longitude };
    mapInstance.current.setCenter(pos);
    
    if (circleRef.current) {
      circleRef.current.setCenter(pos);
    }
  }, [latitude, longitude]);

  const toggleExpand = () => {
    const next = !isExpanded;
    setIsExpanded(next);

    setTimeout(() => {
      if (mapInstance.current && window.google) {
        window.google.maps.event.trigger(mapInstance.current, "resize");
        mapInstance.current.setZoom(next ? 14 : 13);
      }
    }, 300);
  };

  if (!latitude || !longitude) {
    return (
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800 font-medium">
            Location coordinates not provided
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-blue-600" />
          Project Location
        </h3>
        <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-semibold mb-2">
                Failed to load map
              </p>
              <p className="text-sm text-red-700 mb-3">{error}</p>
              <div className="bg-white border border-red-300 rounded-lg p-3 text-xs">
                <p className="font-semibold text-gray-800 mb-2">Setup Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Cloud Console</a></li>
                  <li>Create a project or select existing one</li>
                  <li>Enable "Maps JavaScript API"</li>
                  <li>Create API credentials (API Key)</li>
                  <li>Add to <code className="bg-gray-100 px-1 rounded">.env.local</code>:</li>
                </ol>
                <pre className="bg-gray-800 text-green-400 p-2 rounded mt-2 overflow-x-auto">
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
                </pre>
                <p className="mt-2 text-gray-600">Then restart your Next.js dev server</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          Project Location
        </h3>

        <button
          onClick={toggleExpand}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label={isExpanded ? "Minimize map" : "Expand map"}
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>

      <div
        className={`relative rounded-xl overflow-hidden border-2 border-gray-200 transition-all duration-300 ${
          isExpanded ? "h-96" : "h-64"
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-100">
            <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm mt-2 text-gray-600">Loading map…</p>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" />

        {!isLoading && !error && (
          <div className="absolute bottom-4 left-4 bg-white border border-gray-300 shadow-lg px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <div className="text-xs font-semibold text-gray-800">{name}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}