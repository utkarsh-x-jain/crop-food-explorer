let allProducts = [];
let filteredProducts = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ==========================
// AUTO LOAD DATA ON START
// ==========================
window.onload = () => {
    document.getElementById("searchInput").value = "chicken";
    searchProducts();
};

// ==========================
// SEARCH + FETCH
// ==========================
async function searchProducts() {
    const query = document.getElementById("searchInput").value.trim();

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<p>Loading...</p>";

    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query || "chicken"}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.meals) {
            resultsDiv.innerHTML = "<p>No meals found. Try 'chicken', 'rice', 'pizza'</p>";
            return;
        }

        allProducts = data.meals;
        filteredProducts = [...allProducts];

        displayProducts(filteredProducts);

    } catch (error) {
        console.error("Error:", error);
        resultsDiv.innerHTML = "<p>Error fetching data</p>";
    }
}

// ==========================
// DISPLAY PRODUCTS
// ==========================
function displayProducts(products) {
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = products
        .slice(0, 10)
        .map(product => `
            <div class="card">
                <img src="${product.strMealThumb}" width="100%" />
                <h3>${product.strMeal}</h3>
                <p><strong>Category:</strong> ${product.strCategory}</p>
                <p><strong>Country:</strong> ${product.strArea}</p>

                <button onclick="toggleFavorite('${product.idMeal}')">
                    ${favorites.includes(product.idMeal) ? "❤️" : "🤍"}
                </button>
            </div>
        `)
        .join("");
}

// ==========================
// FILTER
// ==========================
document.getElementById("countryFilter").addEventListener("change", (e) => {
    const country = e.target.value.toLowerCase();

    filteredProducts = allProducts.filter(product =>
        country === "" ||
        product.strArea?.toLowerCase().includes(country)
    );

    displayProducts(filteredProducts);
});

// ==========================
// SORT
// ==========================
document.getElementById("sortOption").addEventListener("change", (e) => {
    const order = e.target.value;

    const sorted = [...filteredProducts].sort((a, b) => {
        const nameA = a.strMeal.toLowerCase();
        const nameB = b.strMeal.toLowerCase();

        return order === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
    });

    displayProducts(sorted);
});

// ==========================
// FAVORITES
// ==========================
function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(fav => fav !== id);
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
