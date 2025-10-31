const backendURL = "http://localhost:5000/api";

// Load user info and bookings when page loads
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }
  fetchUserData(token);
  fetchUserBookings(token);
});

// Fetch user details
async function fetchUserData(token) {
  try {
    const res = await fetch(`${backendURL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch user details");

    const user = await res.json();
    document.getElementById("userName").innerText = user.name || "User";
    localStorage.setItem("userId", user._id);
  } catch (err) {
    console.error(err);
    alert("Session expired, please login again");
    logoutUser();
  }
}

// Fetch user bookings
async function fetchUserBookings(token) {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    const res = await fetch(`${backendURL}/bookings/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch bookings");

    const bookings = await res.json();
    const tableBody = document.getElementById("bookingTable");
    tableBody.innerHTML = "";

    if (bookings.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" class="p-3 text-center text-gray-400">No bookings yet</td></tr>`;
      return;
    }

    bookings.forEach((b) => {
      const row = `
        <tr class="border-b border-white/10">
          <td class="p-3">${b.serviceType}</td>
          <td class="p-3">₹${b.amount}</td>
          <td class="p-3">${b.status}</td>
          <td class="p-3">${b.barber ? b.barber.name : "Unassigned"}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (err) {
    console.error(err);
  }
}

// Create new booking
async function createBooking(event) {
  event.preventDefault();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const bookingData = {
    userId,
    barberId: "", // Can be selected dynamically later
    serviceType: document.getElementById("serviceType").value.trim(),
    amount: document.getElementById("amount").value.trim(),
    paymentMethod: document.getElementById("paymentMethod").value,
    location: document.getElementById("location").value.trim(),
  };

  try {
    const res = await fetch(`${backendURL}/bookings/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Booking created successfully!");
      fetchUserBookings(token);
      document.getElementById("bookingForm").reset();
    } else {
      alert(data.message || "Failed to create booking");
    }
  } catch (err) {
    console.error(err);
    alert("Server error during booking");
  }
}

// Logout user
function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}
