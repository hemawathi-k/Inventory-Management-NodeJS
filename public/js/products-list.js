document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("category");
    const brandSelect = document.getElementById("brand");
    const uomSelect = document.getElementById("uom");
    const qtyInput = document.getElementById("quantity");
    const costInput = document.getElementById("cost");
    const totalCostInput = document.getElementById("totalcost");
    const productForm = document.getElementById("productForm");
    const productTableBody = document.getElementById("productTable");
  
    // Fetch options from server
    fetch("/api/options").then(res => res.json()).then(data => {
      data.categories.forEach(c => categorySelect.innerHTML += `<option value="${c.id}">${c.name}</option>`);
      data.brands.forEach(b => brandSelect.innerHTML += `<option value="${b.id}">${b.name}</option>`);
      data.uoms.forEach(u => uomSelect.innerHTML += `<option value="${u.id}">${u.name}</option>`);
    });
  
    // Calculate total cost
    function updateTotalCost() {
      const qty = parseFloat(qtyInput.value) || 0;
      const cost = parseFloat(costInput.value) || 0;
      totalCostInput.value = (qty * cost).toFixed(2);
    }
  
    qtyInput.addEventListener("input", updateTotalCost);
    costInput.addEventListener("input", updateTotalCost);
  
    // Handle form submit
    productForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const data = {
        name: document.getElementById("name").value,
        category: categorySelect.value,
        brand: brandSelect.value,
        uom: uomSelect.value,
        gst: document.getElementById("gst").value,
        quantity: qtyInput.value,
        cost: costInput.value,
        totalCost: totalCostInput.value,
      };
  
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
  
      if (res.ok) {
        alert("Product Saved!");
        productForm.reset();
        totalCostInput.value = '';
        loadProducts();
      }
    });
  
    function loadProducts() {
      fetch("/api/products")
        .then(res => res.json())
        .then(products => {
          productTableBody.innerHTML = "";
          products.forEach((p, i) => {
            productTableBody.innerHTML += `
              <tr>
                <td>${i + 1}</td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>${p.brand}</td>
                <td>${p.uom}</td>
                <td>${p.gst}%</td>
                <td>${p.quantity}</td>
                <td>${p.cost}</td>
                <td>${p.totalCost}</td>
              </tr>`;
          });
        });
    }
  
    loadProducts();
  });
  