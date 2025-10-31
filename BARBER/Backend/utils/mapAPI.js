const axios = require('axios');

const API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

const geocodeAddress = async (address) => {
  if (!API_KEY) throw new Error('GOOGLE_MAPS_API_KEY not set');
  const url = `https://maps.googleapis.com/maps/api/geocode/json`;
  const res = await axios.get(url, {
    params: { address, key: API_KEY }
  });
  if (res.data.status !== 'OK') {
    throw new Error(`Geocode error: ${res.data.status}`);
  }
  const loc = res.data.results[0].geometry.location;
  return { lat: loc.lat, lng: loc.lng, formattedAddress: res.data.results[0].formatted_address };
};

const getDirections = async (origin, destination) => {
  // origin/destination in "lat,lng" or address
  if (!API_KEY) throw new Error('GOOGLE_MAPS_API_KEY not set');
  const url = `https://maps.googleapis.com/maps/api/directions/json`;
  const res = await axios.get(url, {
    params: {
      origin,
      destination,
      key: API_KEY
    }
  });
  if (res.data.status !== 'OK') {
    throw new Error(`Directions error: ${res.data.status}`);
  }
  return res.data;
};

module.exports = { geocodeAddress, getDirections };
