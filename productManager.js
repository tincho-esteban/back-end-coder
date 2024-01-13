const fs = require("fs").promises;
const path = require("path");

class ProductManager {
    constructor() {
        this.file = path.join("products.json");
    }

    async getProducts() {
        try {
            const rawData = await fs.readFile(this.file, "utf-8");
            return JSON.parse(rawData);
        } catch (error) {
            console.error("Error al leer el archivo:", error.message);
            return [];
        }
    }

    async getProductById(id) {
        const data = await this.getProducts();
        return data.find((product) => product.id === id);
    }

    validateProductFields(product) {
        const requiredFields = [
            "title",
            "description",
            "price",
            "thumbnail",
            "code",
            "stock",
        ];
        return requiredFields.every((field) => product[field]);
    }

    async addProduct(product) {
        if (!this.validateProductFields(product)) {
            console.error("Todos los campos son obligatorios");
            return null;
        }

        const data = await this.getProducts();

        const existingProduct = data.find((p) => p.code === product.code);
        if (existingProduct) {
            console.log("Ya existe un producto con ese código");
            return null;
        }

        const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;

        const newProduct = {
            id: newId,
            ...product,
        };

        data.push(newProduct);

        try {
            await fs.writeFile(this.file, JSON.stringify(data, null, 4));
            return newProduct.id;
        } catch (error) {
            console.error("Error al escribir el archivo:", error.message);
            return null;
        }
    }

    async updateProduct(id, upgrade) {
        const data = await this.getProducts();
        const updatedData = data.map((element) =>
            element.id === id ? { id, ...upgrade } : element,
        );

        try {
            await fs.writeFile(this.file, JSON.stringify(updatedData, null, 4));
        } catch (error) {
            console.error("Error al escribir el archivo:", error.message);
        }
    }

    async deleteProduct(id) {
        const data = await this.getProducts();
        const updatedData = data.filter((product) => product.id !== id);

        try {
            await fs.writeFile(this.file, JSON.stringify(updatedData, null, 4));
        } catch (error) {
            console.error("Error al escribir el archivo:", error.message);
        }
    }
}

const pla001 = {
    title: "FlexiRex",
    description: "T-rex flexible impreso en 3D",
    price: 500,
    thumbnail: "flexirex.jpg",
    code: "PLA001",
    stock: 15,
};

const petg001 = {
    title: "Molde de corazón",
    description: "molde rígido con forma de corazón para velas",
    price: 300,
    thumbnail: "molde-corazon.jpg",
    code: "PETG001",
    stock: 8,
};

const pla002 = {
    title: "Destapador de botellas con contador",
    description: "Destapa botellas de vidrio con contador incluido",
    price: 3000,
    thumbnail: "Destapador-con-contador.jpg",
    code: "PLA002",
    stock: 5,
};

const manager = new ProductManager();

async function run() {
    const manager = new ProductManager();

    try {
        //await manager.addProduct(pla001);

        //await manager.addProduct(petg001);

        //console.log(await manager.getProductById(1));

        //await manager.updateProduct(2, pla002);

        await manager.deleteProduct(1);
    } catch (error) {
        console.error("Error en la ejecución:", error.message);
    }
}

run();
