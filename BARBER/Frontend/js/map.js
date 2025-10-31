let map, barberMarker;

export const initMap = (lat, lng) => {
  map = L.map("map").setView([lat, lng], 14);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
};

export const updateBarberPosition = (lat, lng) => {
  if (barberMarker) map.removeLayer(barberMarker);
  barberMarker = L.marker([lat, lng]).addTo(map);
};
