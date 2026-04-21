let allProducts = [];
let filteredProducts = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let page = 1;
let currentQuery = "";

// ==========================
// AUTO LOAD
// ==========================
window.onload = () => {
    document.getElementById("searchInput").value = "milk";
    searchProducts();
};

// ==========================
// SEARCH + FETCH
// ==========================
async function searchProducts() {
    const query = document.getElementById("searchInput").value.trim() || "milk";
    currentQuery = query;
    page = 1;

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<p>Loading...</p>";

    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&json=1&page=${page}&page_size=50`;

    try {
        const response = await fetch(url);

        if (!response.ok) throw new Error("API failed");

        const data = await response.json();

        if (!data.products || data.products.length === 0) {
            resultsDiv.innerHTML = "<p>No products found</p>";
            return;
        }

        allProducts = data.products;
        applyFilters();

    } catch (error) {
        resultsDiv.innerHTML = `
            <p>Error fetching data ⚠️</p>
            <button onclick="searchProducts()">Retry</button>
        `;
    }
}

// ==========================
// LOAD MORE
// ==========================
async function loadMore() {
    page++;

    const resultsDiv = document.getElementById("results");

    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${currentQuery}&json=1&page=${page}&page_size=50`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        // ❌ No more products
        if (!data.products || data.products.length === 0) {
            // remove Load More button
            const btn = document.querySelector("#results button");
            if (btn) btn.remove();

            // show message
            resultsDiv.innerHTML += `
                <p style="margin:20px; font-weight:bold;">
                    🚫 No more products available
                </p>
            `;
            return;
        }

        // ✅ Add new products
        allProducts = [...allProducts, ...data.products];
        applyFilters();

    } catch (error) {
        console.error("Load more error:", error);
    }
}

// ==========================
// CLEAN TEXT
// ==========================
function getShort(text, count = 2) {
    if (!text) return "N/A";
    return text.split(",").slice(0, count).join(", ");
}

// ==========================
// DISPLAY
// ==========================
function displayProducts(products) {
    const resultsDiv = document.getElementById("results");

    if (products.length === 0) {
        resultsDiv.innerHTML = "<p>No products found</p>";
        return;
    }

    resultsDiv.innerHTML = products.map(product => {
        const id = product.id || product.code;

        return `
        <div class="card">
            <img src="${product.image_url || 'https://via.placeholder.com/200'}" />
            <h3>${product.product_name || "No Name"}</h3>
            <p><strong>Category:</strong> ${getShort(product.categories)}</p>
            <p><strong>Country:</strong> ${getShort(product.countries)}</p>

            <button onclick="toggleFavorite('${id}')">
                ${favorites.includes(id) ? "❤️" : "🤍"}
            </button>
        </div>
        `;
    }).join("");

    resultsDiv.innerHTML += `
        <div style="width:100%; margin:20px;">
            <button onclick="loadMore()">Load More</button>
        </div>
    `;
}

// ==========================
// FILTER
// ==========================
function applyFilters() {
    const country = document.getElementById("countryFilter").value;

    filteredProducts = allProducts.filter(product => {
        if (!country) return true;
        return (product.countries_tags || []).includes(`en:${country}`);
    });

    displayProducts(filteredProducts);
}

document.getElementById("countryFilter").addEventListener("change", applyFilters);

// ==========================
// SORT
// ==========================
document.getElementById("sortOption").addEventListener("change", (e) => {
    const order = e.target.value;

    const sorted = [...filteredProducts].sort((a, b) => {
        const A = (a.product_name || "").toLowerCase();
        const B = (b.product_name || "").toLowerCase();

        return order === "asc" ? A.localeCompare(B) : B.localeCompare(A);
    });

    displayProducts(sorted);
});

// ==========================
// FAVORITES
// ==========================
function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayProducts(filteredProducts);
}

// ==========================
// DARK MODE
// ==========================
function toggleTheme() {
    document.body.classList.toggle("dark");
}

// ENTER KEY
document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchProducts();
});