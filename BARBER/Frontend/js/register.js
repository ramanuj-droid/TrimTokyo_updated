import { apiRequest } from "./api.js";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.querySelector('input[name="role"]:checked').value;

  const res = await apiRequest("/auth/register", "POST", { name, email, password, role });

  if (res.success) {
    alert("Registration successful! Please log in.");
    window.location.href = "login.html";
  } else {
    alert(res.message || "Error during registration");
  }
});
