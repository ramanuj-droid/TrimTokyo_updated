import { apiRequest } from "./api.js";
import { checkAuth, logout } from "./checkAuth.js";
import { getToken } from "./auth.js";

checkAuth();

document.getElementById("logoutBtn").addEventListener("click", logout);

const loadAssignedBookings = async () => {
  const res = await apiRequest("/barber/bookings", "GET", null, getToken());
  const container = document.getElementById("assignedBookings");
  container.innerHTML = "";
  res.bookings?.forEach(b => {
    const div = document.createElement("div");
    div.className = "p-4 bg-gray-700 text-white rounded-md mb-2";
    div.innerText = `${b.user.name} - ${b.serviceType} (${b.status})`;
    container.appendChild(div);
  });
};
loadAssignedBookings();
