document.getElementById('UOMForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const uomValue = document.getElementById('uom').value.trim();
    if (!uomValue) {
        alert("Please enter a UOM.");
        return;
    }

    fetch('http://localhost:3000/uoms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: uomValue }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('UOM added successfully!');
                clearFields();
                loadUOMs();
            } else {
                alert('Failed to add UOM.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error while adding UOM.');
        });
});

function clearFields() {
    document.getElementById('uom').value = '';
}

function loadUOMs() {
    fetch('http://localhost:3000/uoms')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('BrandTable'); // Keeping ID as-is
            tableBody.innerHTML = '';

            data.forEach((item, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Load on page load
window.onload = function () {
    loadUOMs();
};
