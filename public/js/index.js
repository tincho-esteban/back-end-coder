const form = document.getElementById("form");
let socket;

const initSocket = () => {
    if (typeof io !== "undefined") {
        socket = io();

        socket.on("newProduct", (products) => renderProducts(products));
        socket.on("productToDelete", (products) => renderProducts(products));

        document.getElementById("addBtn").addEventListener("click", addProduct);
        document
            .getElementById("deleteBtn")
            .addEventListener("click", deleteProduct);
    }
};

const getProducts = async () => {
    try {
        const response = await fetch("./products.json");
        return await response.json();
    } catch (error) {
        console.error(error);
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
                    <p class="card-text">PRECIO: $${prod.price}</p>
                    <p class="card-text">Codigo: ${prod.code}</p>
                </div>
            </div>
        `,
        )
        .join(" ");
    document.getElementById("containerCards").innerHTML = list;
};

const getFormValues = () => ({
    title: document.getElementById("name").value,
    thumbnail: document.getElementById("img").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
});

const addProduct = async (e) => {
    e.preventDefault();
    const product = getFormValues();
    const products = await getProducts();
    products.push(product);
    socket.emit("newProduct", products);
    form.reset();
};

const deleteProduct = async (e) => {
    e.preventDefault();
    const code = form.codeToDelete.value;
    const products = await getProducts();
    const productFound = products.find((p) => p.code == code);
    if (productFound) {
        products.splice(products.indexOf(productFound), 1);
        socket.emit("deleteProduct", products);
    } else {
        console.log(`Product with code ${code} not found.`);
    }
    form.reset();
};

initSocket();
getProducts().then(renderProducts);
