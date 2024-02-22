import { Router } from "express";
import path from "path";
import ProductManager from "../dao/fs/ProductManager.js";
import ProductManagerDB from "../dao/db/ProductManager.db.js";
import uploader from "../middlewares/multer.middleware.js";

const productRouter = Router();
const productsFilePath = path.resolve(process.cwd(), "public", "products.json");
const productManagerFS = new ProductManager(productsFilePath);
const productManagerDB = new ProductManagerDB();

const handleErrors = (cb) => async (req, res, next) => {
    try {
        await cb(req, res, next);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

productRouter
    .route("/")
    .get(
        handleErrors(async (req, res) => {
            const { limit } = req.query;
            const products = await productManagerDB.get();
            const limitedProducts = limit ? products.slice(0, limit) : products;
            res.json(limitedProducts);
        }),
    )
    .post(
        uploader.single("thumbnail"),
        handleErrors(async (req, res) => {
            const product = await productManagerDB.addProduct(req);
            res.json(product);
        }),
    );

productRouter
    .route("/:pid")
    .get(
        handleErrors(async (req, res) => {
            const { pid } = req.params;
            const product = await productManagerDB.getProductById(pid);
            res.json(product);
        }),
    )
    .put(
        handleErrors(async (req, res) => {
            const { pid } = req.params;
            const newProduct = req.body;
            await productManagerDB.updateProduct(pid, newProduct);
            res.json(newProduct);
        }),
    )
    .delete(
        handleErrors(async (req, res) => {
            const { pid } = req.params;
            await productManagerDB.deleteProduct(pid);
            res.json({ message: "Producto eliminado" });
        }),
    );

productRouter.get(
    "/insertion",
    handleErrors(async (req, res) => {
        let FSproducts = await productManagerFS.get();
        FSproducts = FSproducts.map(({ id, ...rest }) => rest);
        const carts = productManagerDB.insertion(FSproducts);
        res.json({
            message: "Productos insertados correctamente",
            cartsInserted: "carts",
        });
    }),
);

export default productRouter;
