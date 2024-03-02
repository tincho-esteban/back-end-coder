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
            const {
                page = 1,
                limit = 10,
                sort,
                sortField,
                query,
                queryField,
            } = req.query;

            const queryParams = {
                page,
                limit,
                sort,
                sortField,
                query,
                queryField,
            };

            res.json(await productManagerDB.getPaginated(queryParams));
        }),
    )
    .post(
        uploader.array("thumbnail", 5),
        handleErrors(async (req, res) => {
            const { body: product, files } = req;
            res.json(await productManagerDB.addProduct(product, files));
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
            const { pid } = req.params;
            res.json(await productManagerDB.getProductById(pid));
        }),
    )
    .put(
        handleErrors(async (req, res) => {
            const { pid } = req.params;
            const updateProduct = req.body;
            res.json(await productManagerDB.updateProduct(pid, updateProduct));
        }),
    )
    .delete(
        handleErrors(async (req, res) => {
            const { pid } = req.params;
            res.json(await productManagerDB.deleteProduct(pid));
        }),
    );

export default productRouter;
