import ProductModel from "../models/Product.model.js";

class ProductManagerDB {
    async get() {
        return ProductModel.find({});
    }

    async addProduct(req) {
        const { body: product, files } = req;

        if (!product) throw new Error("Error: Producto no proporcionado");

        const existingProduct = await ProductModel.findOne({
            code: product.code,
        });
        if (existingProduct)
            throw new Error("Error: Ya existe un producto con ese código");

        const productStored = await ProductModel.create(product);

        if (files) {
            const filenames = files.map((file) => file.filename);
            productStored.setImgUrl(filenames);
            await productStored.save();
        }

        return productStored;
    }

    async getProductById(id) {
        const product = await ProductModel.findById(id);
        if (!product)
            throw new Error(`Error: Producto con id ${id} no encontrado`);

        return product;
    }

    async updateProduct(id, updateProduct) {
        const product = await ProductModel.findByIdAndUpdate(
            id,
            updateProduct,
            { new: true },
        );
        if (!product)
            throw new Error(
                `Error: Producto con id ${id} no encontrado al intentar actualizar`,
            );

        return product;
    }

    async deleteProduct(productId) {
        const product = await ProductModel.findByIdAndDelete(productId);
        if (!product)
            throw new Error(
                `Error: Producto con id ${productId} no encontrado al intentar eliminar`,
            );

        return product;
    }

    async insertion(products) {
        const productsDB = await ProductModel.find({});

        if (productsDB.length > 0) return "Carritos ya insertados";

        try {
            await ProductModel.insertMany(products);
            return this.get();
        } catch (error) {
            throw new Error("Error al insertar productos: " + error.message);
        }
    }
}

export default ProductManagerDB;
