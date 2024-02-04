import express from "express";
import ProductManager from "../managers/ProductManager.js";
import path from "path";

const productRouter = express.Router();
const productsFilePath = path.resolve(process.cwd(), "public", "products.json");
const productManager = new ProductManager(productsFilePath);

const handleErrors = (cb) => async (req, res, next) => {
    try {
        await cb(req, res, next);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

productRouter.get(
    "/",
    handleErrors(async (req, res) => {
        const { limit } = req.query;
        const products = await productManager.get();
        const limitedProducts = limit ? products.slice(0, limit) : products;
        res.json(limitedProducts);
    }),
);

productRouter.get(
    "/:pid",
    handleErrors(async (req, res) => {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        res.json(product);
    }),
);

productRouter.post(
    "/",
    handleErrors(async (req, res) => {
        const newProduct = req.body;
        const product = await productManager.addProduct(newProduct);
        res.json(product);
    }),
);

productRouter.put(
    "/:pid",
    handleErrors(async (req, res) => {
        const { pid } = req.params;
        const newProduct = req.body;
        await productManager.updateProduct(pid, newProduct);
        res.json(newProduct);
    }),
);

productRouter.delete(
    "/:pid",
    handleErrors(async (req, res) => {
        const { pid } = req.params;
        await productManager.deleteProduct(pid);
        res.json({ message: "Producto eliminado" });
    }),
);

export default productRouter;
