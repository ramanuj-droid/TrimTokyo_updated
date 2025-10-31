import { apiRequest } from "./api.js";
import { checkAuth, logout } from "./checkAuth.js";
import { getToken } from "./auth.js";

checkAuth();

document.getElementById("logoutBtn").addEventListener("click", logout);

const loadOverview = async () => {
  const [users, barbers, bookings] = await Promise.all([
    apiRequest("/admin/users", "GET", null, getToken()),
    apiRequest("/admin/barbers", "GET", null, getToken()),
    apiRequest("/admin/bookings", "GET", null, getToken())
  ]);

  document.getElementById("totalUsers").innerText = users.length;
  document.getElementById("totalBarbers").innerText = barbers.length;
  document.getElementById("totalBookings").innerText = bookings.length;
};
loadOverview();
