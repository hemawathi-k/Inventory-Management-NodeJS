document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('PCForm');
    const categoryInput = document.getElementById('category');
    const categoryTable = document.getElementById('CategoryTable');

    // Function to fetch and display data from the database
    function loadCategories() {
        fetch('/api/categories')
            .then(response => response.json())
            .then(data => {
                categoryTable.innerHTML = ''; // Clear current table data
                data.forEach((category, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${category.name}</td>
                    `;
                    categoryTable.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching categories:', error));
    }

    // Load categories initially
    loadCategories();

    // Handle form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const categoryName = categoryInput.value.trim();

        if (categoryName) {
            fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadCategories();  // Reload the categories
                    categoryInput.value = '';  // Clear the input field
                    alert('Category Added Successfully!');  // Show success alert
                }
            })
            .catch(error => console.error('Error saving category:', error));
        }
    });
});
