const form = document.getElementById("form");
const addBtn = document.getElementById("addBtn");
const deleteBtn = document.getElementById("deleteBtn");
const containerCards = document.getElementById("containerCards");
let socket;

const initSocket = () => {
    if (typeof io !== "undefined") {
        socket = io();

        socket.on("refresh", refreshProducts);

        if (addBtn) {
            addBtn.addEventListener("click", addProduct);
        }

        if (deleteBtn) {
            deleteBtn.addEventListener("click", deleteProduct);
        }
    }
};

const getProducts = async () => {
    const response = await fetch("/api/products");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
};

const refreshProducts = async () => {
    try {
        const products = await getProducts();
        renderProducts(products);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
};

const renderProducts = (products) => {
    const list = products
        .map(
            (prod) => `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${prod.title}</h5>
                    <img src="${prod.thumbnail}" alt="" class="cardImg">
                    <p class="card-text">${prod.description}</p>
                    <p class="card-text">Id: ${prod._id}</p>
                    <p class="card-text">Precio: $${prod.price}</p>
                    <p class="card-text">Codigo: ${prod.code}</p>
                    <p class="card-text">Stock: ${prod.stock}</p>
                </div>
            </div>
        `,
        )
        .join(" ");
    containerCards.innerHTML = list;
};

const getFormValues = () => {
    const title = document.getElementById("name").value;
    const thumbnail = document.getElementById("img").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const code = document.getElementById("code").value;
    const stock = document.getElementById("stock").value;

    if (!title || !thumbnail || !description || !price || !code || !stock) {
        return null;
    }

    return {
        title,
        thumbnail,
        description,
        price,
        code,
        stock,
    };
};

const addProduct = async (e) => {
    e.preventDefault();
    const product = getFormValues();
    socket.emit("newProduct", product);
    form.reset();
};

const deleteProduct = async (e) => {
    e.preventDefault();
    const id = form.idToDelete.value;
    socket.emit("deleteProduct", id);
    form.reset();
};

initSocket();
refreshProducts();
