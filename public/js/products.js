let cartId;

async function addToCart(pid) {
    try {
        if (!cartId) {
            const res = await fetch("/api/carts", { method: "POST" });
            const data = await res.json();
            cartId = data.payload._id;
        }

        await fetch(`/api/carts/${cartId}/product/${pid}`, { method: "POST" });
        alert("Producto agregado al carrito");
    } catch (err) {
        console.error(err);
        alert("Error al agregar al carrito. Por favor, inténtalo de nuevo.");
    }
}

function updateUrlAndRedirect(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.location.href = url.toString();
}

function addEventListenerToElement(elementId, event, callback) {
    document.getElementById(elementId).addEventListener(event, callback);
}

addEventListenerToElement("searchForm", "submit", (event) => {
    event.preventDefault();
    const query = document.getElementById("searchInput").value;
    updateUrlAndRedirect("query", query);
});

addEventListenerToElement("sortAsc", "click", () =>
    updateUrlAndRedirect("sort", 1),
);
addEventListenerToElement("sortDesc", "click", () =>
    updateUrlAndRedirect("sort", -1),
);
addEventListenerToElement("showAvailable", "click", () =>
    updateUrlAndRedirect("query", "available"),
);
