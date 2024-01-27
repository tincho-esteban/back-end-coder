import FileManager from "./FileManager.js";

class ProductManager extends FileManager {
    createProduct(id, product) {
        return {
            id,
            ...product,
        };
    }

    validateProductFields(product) {
        if (!product) {
            throw new Error("Producto no proporcionado");
        }
        const requiredFields = [
            "title",
            "description",
            "price",
            "code",
            "stock",
        ];
        return requiredFields.every((field) => product[field]);
    }

    async addProduct(product) {
        if (!this.validateProductFields(product)) {
            console.error("Todos los campos son obligatorios");
            return "Todos los campos son obligatorios";
        }

        const data = await this.get();

        const existingProduct = data.find((p) => p.code === product.code);
        if (existingProduct) {
            console.error("Ya existe un producto con ese código");
            return "Ya existe un producto con ese código";
        }

        const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
        const newProduct = this.createProduct(newId, product);

        data.push(newProduct);

        try {
            await this.write(data);
            return newProduct;
        } catch (error) {
            console.error("Error al escribir el archivo:", error.message);
            return "Error al escribir el archivo:", error.message;
        }
    }

    findProductById(products, productId) {
        const index = products.findIndex((product) => product.id == productId);
        if (index === -1) {
            throw new Error("Producto no encontrado");
        }
        return index;
    }

    async updateProduct(productId, updateProduct) {
        try {
            const products = await this.get();
            const index = this.findProductById(products, productId);

            products[index] = { ...products[index], ...updateProduct };
            await this.write(products);
        } catch (err) {
            throw err;
        }
    }

    async deleteProduct(productId) {
        try {
            const products = await this.get();
            const index = this.findProductById(products, productId);

            products.splice(index, 1);
            await this.write(products);
        } catch (err) {
            throw err;
        }
    }
}

export default ProductManager;
