
async function searchProducts() {
    const query = document.getElementById("searchInput").value;

    if (!query) {
        alert("Please enter a product name");
        return;
    }

    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&json=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        displayProducts(data.products);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayProducts(products) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (products.length === 0) {
        resultsDiv.innerHTML = "<p>No products found</p>";
        return;
    }

    products.slice(0, 10).forEach(product => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${product.product_name || "No Name"}</h3>
            <p><strong>Category:</strong> ${product.categories || "N/A"}</p>
            <p><strong>Country:</strong> ${product.countries || "N/A"}</p>
            <p><strong>Energy:</strong> ${product.nutriments?.energy || "N/A"} kcal</p>
        `;

        resultsDiv.appendChild(card);
    });
}
