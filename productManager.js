class ProductManager {
    constructor() {
        this.products = [];
        this.id = 0;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Error: todos los campos son obligatorios");
            return;
        }

        const existingProduct = this.products.find(
            (product) => product.code === code,
        );
        if (existingProduct) {
            console.log("Error: ya existe un producto con ese código ");
            return;
        }

        const product = {
            id: this.id,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
        };
        this.products.push(product);
        this.id++;
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((product) => product.id === id);

        if (!product) {
            return "not found";
        }

        return product;
    }
}

const manager = new ProductManager();

manager.addProduct(
    "FlexiRex",
    "T-rex flexible impreso en 3D",
    500,
    "flexirex.jpg",
    "PLA001",
    15,
);
manager.addProduct(
    "Molde de corazón",
    "molde rígido con forma de corazón para velas",
    300,
    "molde-corazon.jpg",
    "PETG001",
    8,
);
manager.addProduct(
    "Destapador de botellas con contador",
    "Destapa botellas de vidrio con contador incluido",
    3000,
    "Destapador-con-contador.jpg",
    "PLA002",
    5,
);

const products = manager.getProducts();
const productById = manager.getProductById(1);

console.log(products);
console.log(productById);
