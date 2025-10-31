const backendURL = "http://localhost:5000/api";

// ----- REGISTER -----
async function registerUser(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.querySelector('input[name="role"]:checked').value; // 'user' or 'barber'

  try {
    const res = await fetch(`${backendURL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Registration successful! Please login now.");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Registration failed!");
    }
  } catch (err) {
    console.error(err);
    alert("Server error during registration.");
  }
}

// ----- LOGIN -----
async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(`${backendURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      alert("Login successful!");

      // Redirect based on role
      if (data.role === "admin") window.location.href = "dashboard_admin.html";
      else if (data.role === "barber") window.location.href = "dashboard_barber.html";
      else window.location.href = "dashboard_user.html";
    } else {
      alert(data.message || "Invalid credentials!");
    }
  } catch (err) {
    console.error(err);
    alert("Server error during login.");
  }
}
