let allProducts = [];
let filteredProducts = [];
let favorites = [];

// SEARCH + FETCH
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

        allProducts = data.products || [];
        filteredProducts = [...allProducts];

        displayProducts(filteredProducts);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// DISPLAY (using MAP ✅)
function displayProducts(products) {
    const resultsDiv = document.getElementById("results");

    if (products.length === 0) {
        resultsDiv.innerHTML = "<p>No products found</p>";
        return;
    }

    resultsDiv.innerHTML = products
        .slice(0, 10)
        .map(product => `
            <div class="card">
                <h3>${product.product_name || "No Name"}</h3>
                <p><strong>Category:</strong> ${product.categories || "N/A"}</p>
                <p><strong>Country:</strong> ${product.countries || "N/A"}</p>
                <p><strong>Energy:</strong> ${product.nutriments?.energy || "N/A"} kcal</p>

                <button onclick="toggleFavorite('${product._id}')">
                    ${favorites.includes(product._id) ? "❤️" : "🤍"}
                </button>
            </div>
        `)
        .join("");
}

// FILTER (using FILTER ✅)
document.getElementById("countryFilter").addEventListener("change", (e) => {
    const country = e.target.value.toLowerCase();

    filteredProducts = allProducts.filter(product =>
        country === "" ||
        product.countries?.toLowerCase().includes(country)
    );

    displayProducts(filteredProducts);
});

// SORT (using SORT ✅)
document.getElementById("sortOption").addEventListener("change", (e) => {
    const order = e.target.value;

    const sorted = [...filteredProducts].sort((a, b) => {
        const nameA = a.product_name?.toLowerCase() || "";
        const nameB = b.product_name?.toLowerCase() || "";

        return order === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
    });

    displayProducts(sorted);
});

// FAVORITE BUTTON 
function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(fav => fav !== id);
    } else {
        favorites = [...favorites, id];
    }

    displayProducts(filteredProducts);
}

// DARK MODE
function toggleTheme() {
    document.body.classList.toggle("dark");
}
