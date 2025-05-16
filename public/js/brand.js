document.getElementById('BrandForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the input values
    const brandName = document.getElementById('brand').value;

    // Send the data to the server to create a new brand
    fetch('http://localhost:3000/brands', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: brandName }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Brand added successfully!');
            clearFields(); // Clear the form after successful submission
            loadBrands(); // Reload the brands table
        } else {
            alert('Failed to add brand');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error while adding brand');
    });
});

// Function to clear input fields
function clearFields() {
    document.getElementById('brand').value = '';
}

// Function to load brands from the backend
function loadBrands() {
    fetch('http://localhost:3000/brands')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('BrandTable');
            tableBody.innerHTML = ''; // Clear existing table content

            data.forEach((brand, index) => {
                const row = `<tr>
                    <td>${index + 1}</td>
                    <td>${brand.name}</td>
                </tr>`;
                tableBody.innerHTML += row; // Append new row to the table
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Load brands when the page loads
window.onload = function() {
    loadBrands();
};
