//nominatim
const fs = require('fs');
const axios = require('axios');

// Load hospital data
const hospitals = require('../public/hospitals.json');

// Nominatim allows 1 request per second, so we delay between requests
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Geocode using Nominatim
async function geocode(address) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}&addressdetails=1&limit=1`;
    
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'hospital-locator-app/1.0 (nradithi01@gmail.com)',
      }
    });

    if (res.data.length > 0) {
      const { lat, lon } = res.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    }

    return null;
  } catch (err) {
    console.error("Error geocoding", address, err.message);
    return null;
  }
}

async function processHospitals() {
  const updated = [];

  for (let i = 0; i < hospitals.length; i++) {
    const h = hospitals[i];
    const address = `${h['Hospital Name']}, ${h.District}, ${h.State}, India`;

    console.log(`(${i + 1}/${hospitals.length}) Geocoding:`, address);
    const location = await geocode(address);
    await sleep(1000); // Nominatim rate limit

    updated.push({
      ...h,
      Latitude: location?.lat || null,
      Longitude: location?.lng || null,
    });
  }

  fs.writeFileSync(
    '../public/hospitals_with_location.json',
    JSON.stringify(updated, null, 2)
  );

  console.log("✅ Done. File saved to public/hospitals_with_location.json");
}

processHospitals();