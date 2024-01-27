import express from "express";
import ProductManager from "../ProductManager.js";
import path from "path";

const productRouter = express.Router();
const productsFilePath = path.resolve(process.cwd(), "public", "products.json");
const productManager = new ProductManager(productsFilePath);

productRouter.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.get();
        const limitedProducts = limit ? products.slice(0, limit) : products;
        res.send(limitedProducts);
    } catch (err) {
        next(err);
    }
});

productRouter.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    const products = await productManager.get();
    const product = products.find((product) => product.id === Number(pid));
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ error: "Producto no encontrado" });
    }
});

productRouter.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        res.send(await productManager.addProduct(newProduct));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

productRouter.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const newProduct = req.body;

    try {
        await productManager.updateProduct(pid, newProduct);
        res.send(newProduct);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

productRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        await productManager.deleteProduct(pid);
        res.send("Producto eliminado");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default productRouter;
