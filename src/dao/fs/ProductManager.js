import FileManager from "./FileManager.js";

class ProductManager extends FileManager {
    createProduct(product, products) {
        const id =
            products.length > 0 ? products[products.length - 1].id + 1 : 1;
        return {
            id,
            ...product,
        };
    }

    validateProductFields(product) {
        if (!product) throw new Error("Producto no proporcionado");

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
        if (!this.validateProductFields(product))
            throw new Error("Todos los campos son obligatorios");

        const products = await this.get();

        const existingProduct = products.find((p) => p.code === product.code);
        if (existingProduct)
            throw new Error("Ya existe un producto con ese código");

        const newProduct = this.createProduct(product, products);

        products.push(newProduct);

        await this.write(products);
        return newProduct;
    }

    async getProductById(id) {
        const products = await this.get();
        const product = products.find((p) => p.id == id);
        if (!product) throw new Error("Producto no encontrado");
        return product;
    }

    async getProductIndexById(id) {
        const products = await this.get();
        const index = products.findIndex((p) => p.id == id);
        if (index === -1) throw new Error("Producto no encontrado");
        return index;
    }

    async updateProduct(productId, updateProduct) {
        const products = await this.get();
        const index = await this.getProductIndexById(productId);
        products[index] = { ...products[index], ...updateProduct };
        await this.write(products);
    }

    async deleteProduct(productId) {
        const products = await this.get();
        const index = await this.getProductIndexById(productId);
        products.splice(index, 1);
        await this.write(products);
    }
}

export default ProductManager;
