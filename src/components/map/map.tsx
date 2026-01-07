"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Maximize2, Minimize2 } from "lucide-react";

export default function LocationMap({ name, latitude, longitude }:{name:string , latitude:number,longitude:number}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const loadLeaflet = async () => {

      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
        script.async = true;
        script.onload = () => setMapReady(true);
        document.body.appendChild(script);
      } else {
        setMapReady(true);
      }
    };

    loadLeaflet();
  }, []);


  useEffect(() => {
    if (!mapReady || !mapRef.current || mapInstance.current) return;

    const init = () => {
      try {
        const L = window.L;

        mapRef.current.style.height = isExpanded ? "384px" : "256px";

        const map = L.map(mapRef.current, {
          center: [latitude, longitude],
          zoom: 13,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        const satellite = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { maxZoom: 19 }
        );
        
        const labels = L.tileLayer(
          "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        );
        
        satellite.addTo(map);
        labels.addTo(map);

        mapInstance.current = map;

        setTimeout(() => {
          map.invalidateSize();
          setIsLoading(false);
          updateMarkers();
        }, 200);
      } catch (e) {
        console.error("Map Init Error:", e);
        setIsLoading(false);
      }
    };

    init();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [mapReady]);

  useEffect(() => {
    if (mapInstance.current && latitude && longitude) {
      mapInstance.current.setView([latitude, longitude], 13);
      updateMarkers();
    }
  }, [latitude, longitude]);

  
  const updateMarkers = () => {
    if (!window.L || !mapInstance.current) return;

    const L = window.L;
    const map = mapInstance.current;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    const circle = L.circle([latitude, longitude], {
      color: "#3b82f6",
      fillColor: "#3b82f6",
      fillOpacity: 0.15,
      radius: 800,
      weight: 2,
    }).addTo(map);

    // const centerMarker = L.circleMarker([latitude, longitude], {
    //   radius: 8,
    //   fillColor: "#3b82f6",
    //   color: "#ffffff",
    //   weight: 3,
    //   fillOpacity: 1,
    // }).addTo(map);

    markersRef.current = [circle];

    const popupHTML = `
      <div style="padding:2px;text-align:center">
        <div style="font-weight:600;color:#1f2937">${name}</div>
        <div style="font-size:11px;color:#6b7280;font-family:monospace">
        </div>
      </div>
    `;

    const popup = L.popup({
      className: "custom-popup",
      closeOnClick: true,
      autoClose: true,
    }).setContent(popupHTML);

    // centerMarker.bindPopup(popup);
    circle.bindPopup(popup);

    // centerMarker.on("click", () => {
    //   if (map.hasLayer(centerMarker.getPopup())) map.closePopup();
    //   else centerMarker.openPopup();
    // });

    circle.on("mouseover", () => {
      circle.setStyle({ fillOpacity: 0.25 });
      // centerMarker.openPopup();
    });

    circle.on("mouseout", () => {
      circle.setStyle({ fillOpacity: 0.15 });
    });
  };


  const toggleExpand = () => {
    const next = !isExpanded;
    setIsExpanded(next);

    setTimeout(() => {
      if (mapInstance.current && mapRef.current) {
        mapRef.current.style.height = next ? "384px" : "256px";
        mapInstance.current.invalidateSize();
        mapInstance.current.setView([latitude, longitude], next ? 14 : 13);
      }
    }, 200);
  };

  if (!latitude || !longitude) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-300 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Project Location
        </h3>

        <button
          onClick={toggleExpand}
          className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>

      <div
        className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
          isExpanded ? "h-96" : "h-64"
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
              Loading map…
            </p>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" />

        {!isLoading && (
          <>
            <div className="absolute bottom-4 left-4 z-[999] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-xs font-semibold">{name}</div>
                  {/* <div className="text-xs font-mono text-gray-500">
                    {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </div> */}
                </div>
              </div>
            </div>
            {/* <div className="absolute top-4 right-4 z-[9999] flex gap-2">
              <a
                href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`}
                target="_blank"
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs shadow"
              >
                View on OSM
              </a>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                target="_blank"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs shadow"
              >
                Get Directions
              </a>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}