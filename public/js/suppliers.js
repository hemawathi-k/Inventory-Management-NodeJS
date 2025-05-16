const supplierForm = document.getElementById("supplierForm");
const supplierTable = document.getElementById("supplierTable");

// Fetch data on page load
window.addEventListener("DOMContentLoaded", fetchSuppliers);

// Submit form data to backend
supplierForm.addEventListener("submit", async function () {
  const supplier = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
    city: document.getElementById("city").value.trim(),
    state: document.getElementById("state").value.trim(),
    pincode: document.getElementById("pincode").value.trim(),
  };

  // Basic validation
  if (Object.values(supplier).some(val => val === "")) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const res = await fetch("/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplier),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      fetchSuppliers(); // reload table
      clearFields();
    } else {
      alert(data.message || "Failed to add supplier.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error.");
  }
});

// Fetch supplier data from backend
async function fetchSuppliers() {
  try {
    const res = await fetch("/suppliers");
    const suppliers = await res.json();

    supplierTable.innerHTML = "";
    suppliers.forEach((supplier, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${supplier.name}</td>
        <td>${supplier.email}</td>
        <td>${supplier.phone}</td>
        <td>${supplier.address}</td>
        <td>${supplier.city}</td>
        <td>${supplier.state}</td>
        <td>${supplier.pincode}</td>
      `;
      supplierTable.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to fetch suppliers:", error);
  }
}

// Clear form fields
function clearFields() {
  supplierForm.reset();
}
