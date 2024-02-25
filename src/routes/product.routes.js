import { Router } from "express";
import ProductManagerDB from "../dao/db/ProductManager.db.js";
import uploader from "../middlewares/multer.middleware.js";

const productRouter = Router();
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
            res.json(await productManagerDB.getPaginated(req));
        }),
    )
    .post(
        uploader.array("thumbnail", 5),
        handleErrors(async (req, res) => {
            res.json(await productManagerDB.addProduct(req));
        }),
    );

productRouter.get(
    "/insertion",
    handleErrors(async (req, res) => {
        res.json(await productManagerDB.insertion());
    }),
);

productRouter
    .route("/:pid")
    .get(
        handleErrors(async (req, res) => {
            res.json(await productManagerDB.getProductById(req));
        }),
    )
    .put(
        handleErrors(async (req, res) => {
            res.json(await productManagerDB.updateProduct(req));
        }),
    )
    .delete(
        handleErrors(async (req, res) => {
            res.json(await productManagerDB.deleteProduct(req));
        }),
    );

export default productRouter;
