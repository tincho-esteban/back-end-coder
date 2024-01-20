import { promises as fs } from "fs";
import path from "path";

class ProductManager {
    constructor() {
        this.file = path.join("public/products.json");
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
        if (!id) {
            throw new Error("ID del producto no proporcionado");
        }
        const products = await this.getProducts();
        return products.find((product) => product.id === id);
    }

    validateProductFields(product) {
        if (!product) {
            throw new Error("Producto no proporcionado");
        }
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

export default ProductManager;
