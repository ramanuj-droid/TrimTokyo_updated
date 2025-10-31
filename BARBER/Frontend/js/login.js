import { apiRequest } from "./api.js";
import { saveToken, setUserRole } from "./auth.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await apiRequest("/auth/login", "POST", { email, password });

  if (res.token) {
    saveToken(res.token);
    setUserRole(res.role);

    if (res.role === "user") window.location.href = "dashboard_user.html";
    else if (res.role === "barber") window.location.href = "dashboard_barber.html";
    else if (res.role === "admin") window.location.href = "dashboard_admin.html";
  } else {
    alert(res.message || "Login failed");
  }
});
