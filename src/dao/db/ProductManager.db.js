import ProductModel from "../models/Product.model.js";

class ProductManagerDB {
    async get() {
        return ProductModel.find({});
    }

    async addProduct(product) {
        if (!product) throw new Error("Producto no proporcionado");

        const existingProduct = await ProductModel.findOne({
            code: product.code,
        });
        if (existingProduct)
            throw new Error("Ya existe un producto con ese código");

        return ProductModel.create(product);
    }

    async getProductById(id) {
        const product = await ProductModel.findById(id);
        if (!product) throw new Error("Producto no encontrado");

        return product;
    }

    async updateProduct(id, updateProduct) {
        const product = await ProductModel.findByIdAndUpdate(
            id,
            updateProduct,
            { new: true },
        );
        if (!product) throw new Error("Producto no encontrado");

        return product;
    }

    async deleteProduct(productId) {
        const product = await ProductModel.findByIdAndDelete(productId);
        if (!product) throw new Error("Producto no encontrado");

        return product;
    }

    async insertion(products) {
        const productsDB = await ProductModel.find({});

        if (productsDB.length > 0) return "Carritos ya insertados";

        await ProductModel.insertMany(products);

        return this.get();
    }
}

export default ProductManagerDB;
