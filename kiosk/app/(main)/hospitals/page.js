'use client';

import { useEffect, useState } from "react";

// Haversine distance calculator
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Load hospital data
    fetch('/hospitals_with_location.json')
      .then(res => res.json())
      .then(data => {
        setHospitals(data);
        setFilteredHospitals(data);
      })
      .catch(err => console.error('Failed to load hospitals:', err));

    // Get user geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          console.warn('User denied geolocation or error:', err.message);
          setUserLocation(null);
        }
      );
    }
  }, []);

  // Sort + filter on search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = hospitals.filter(hospital =>
      (hospital.Address?.toLowerCase().includes(value) ||
      hospital.District?.toLowerCase().includes(value) ||
      hospital.State?.toLowerCase().includes(value))
    );

    const withLocation = filtered.filter(h => h.Latitude && h.Longitude);
    const withoutLocation = filtered.filter(h => !h.Latitude || !h.Longitude);

    if (userLocation) {
      withLocation.sort((a, b) => {
        const distA = getDistance(userLocation.lat, userLocation.lng, a.Latitude, a.Longitude);
        const distB = getDistance(userLocation.lat, userLocation.lng, b.Latitude, b.Longitude);
        return distA - distB;
      });
    }

    setFilteredHospitals([...withLocation, ...withoutLocation]);
  };

  // Re-sort if user location changes
  useEffect(() => {
    if (!userLocation || hospitals.length === 0) return;

    const withLocation = hospitals.filter(h => h.Latitude && h.Longitude);
    const withoutLocation = hospitals.filter(h => !h.Latitude || !h.Longitude);

    withLocation.sort((a, b) => {
      const distA = getDistance(userLocation.lat, userLocation.lng, a.Latitude, a.Longitude);
      const distB = getDistance(userLocation.lat, userLocation.lng, b.Latitude, b.Longitude);
      return distA - distB;
    });

    const filtered = [...withLocation, ...withoutLocation];

    // Re-filter if search term is present
    if (searchTerm.trim()) {
      const value = searchTerm.toLowerCase();
      const searchFiltered = filtered.filter(hospital =>
        (hospital.Address?.toLowerCase().includes(value) ||
        hospital.District?.toLowerCase().includes(value) ||
        hospital.State?.toLowerCase().includes(value))
      );
      setFilteredHospitals(searchFiltered);
    } else {
      setFilteredHospitals(filtered);
    }
  }, [userLocation]);

  return (
    <div className="p-6 bg-background text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Empanelled Hospitals</h1>

      <input
        type="text"
        placeholder="Search by locality, district, or state..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-6 p-3 w-full max-w-md rounded-md border border-emerald-600 bg-muted text-white placeholder:text-muted-foreground"
      />

      {filteredHospitals.length === 0 ? (
        <p>No hospitals found for that location.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHospitals.map((hospital, index) => {
            const hasLocation = hospital.Latitude && hospital.Longitude;
            return (
              <div key={index} className="border border-emerald-600/20 p-4 rounded-md bg-emerald-900/10">
                <h2 className="text-xl font-semibold">{hospital['Hospital Name']}</h2>
                <p>{hospital.Address}</p>
                <p>{hospital.District}, {hospital.State}</p>
                <p className="text-sm text-emerald-300">Type: {hospital['Hospital Type']}</p>

                {/* Badge + Directions */}
                <div className="mt-2 flex flex-col gap-1">
                  <span
                    className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold ${
                      hasLocation ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                    }`}
                  >
                    {hasLocation ? 'Location Available' : 'Location Not Available'}
                  </span>

                  {hasLocation && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.Latitude},${hospital.Longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-400 hover:underline"
                    >
                      📍 Get Directions
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
