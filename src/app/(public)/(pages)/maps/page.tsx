"use client"
import  { useState, useEffect, useRef } from 'react';
import { MapPin, Info, Star, Navigation, X } from 'lucide-react';

const OSMLocationMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  const sampleLocation = {
    id: 1,
    city_id: 115,
    state_id: 45,
    country_id: 14,
    name: "Bundaberg",
    latitude: -24.8611903,
    longitude: 152.3682267,
    postcode: "4670",
    display_name: "AAD Auto, Victoria Street, Bundaberg East, Bundaberg, Bundaberg Region, Queensland, 4670, Australia",
    place_id: "410627053",
    source: "osm",
    popularity: 0
  };

  useEffect(() => {
    setLocations([sampleLocation]);
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    script.async = true;
    script.onload = () => initializeMap();
    document.body.appendChild(script);

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const initializeMap = () => {
    if (!window.L || map) return;

    const newMap = window.L.map(mapRef.current).setView(
      [sampleLocation.latitude, sampleLocation.longitude],
      13
    );

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(newMap);

    setMap(newMap);
    addMarkersToMap(newMap, [sampleLocation]);
  };

  const addMarkersToMap = (mapInstance, locs) => {
    if (!window.L) return;

    markers.forEach(marker => marker.remove());

    const customIcon = window.L.divIcon({
      className: 'custom-marker',
      html: `<div style="background: #3b82f6; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <svg style="transform: rotate(45deg); width: 16px; height: 16px; color: white;" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
        </svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    const newMarkers = locs.map(loc => {
      const marker = window.L.marker([loc.latitude, loc.longitude], {
        icon: customIcon
      }).addTo(mapInstance);

      marker.on('click', () => {
        setSelectedLocation(loc);
        mapInstance.setView([loc.latitude, loc.longitude], 15, {
          animate: true,
          duration: 0.5
        });
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    if (map) {
      map.setView([loc.latitude, loc.longitude], 15, {
        animate: true,
        duration: 0.5
      });
    }
  };

  const closeDetails = () => {
    setSelectedLocation(null);
  };

  const parseAddress = (displayName) => {
    const parts = displayName.split(', ');
    return {
      street: parts[0] || '',
      suburb: parts[1] || '',
      city: parts[2] || '',
      region: parts[3] || '',
      state: parts[4] || '',
      postcode: parts[5] || '',
      country: parts[6] || ''
    };
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Location Map</h1>
              <p className="text-sm text-gray-500">Explore and discover places</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {locations.length} location{locations.length !== 1 ? 's' : ''} available
          </div>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Locations</h2>
            <div className="space-y-2">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleLocationSelect(loc)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedLocation?.id === loc.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedLocation?.id === loc.id ? 'bg-blue-500' : 'bg-gray-100'
                    }`}>
                      <MapPin className={`w-4 h-4 ${
                        selectedLocation?.id === loc.id ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{loc.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{parseAddress(loc.display_name).city}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {loc.postcode}
                        </span>
                        {loc.popularity > 0 && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {loc.popularity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-[400px] h-full" />

          {selectedLocation && (
            <div className="absolute top-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
                      <p className="text-sm text-blue-100">
                        {parseAddress(selectedLocation.display_name).state}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeDetails}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Info className="w-4 h-4" />
                    Full Address
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedLocation.display_name}
                  </p>
                </div>

                <div className="grid grid-row gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Postcode</div>
                    <div className="font-semibold text-gray-900">{selectedLocation.postcode}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Place ID</div>
                    <div className="font-semibold text-gray-900 truncate">{selectedLocation.place_id}</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xs text-blue-700 mb-1">Coordinates</div>
                  <div className="font-mono text-sm text-blue-900">
                    {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selectedLocation.latitude}&mlon=${selectedLocation.longitude}#map=15/${selectedLocation.latitude}/${selectedLocation.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors text-center"
                  >
                    View on OSM
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors text-center"
                  >
                    Get Directions
                  </a>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500">Source: {selectedLocation.source.toUpperCase()}</span>
                  {selectedLocation.popularity > 0 && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{selectedLocation.popularity}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OSMLocationMap;