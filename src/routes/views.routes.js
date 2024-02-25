import express from "express";
import ProductManagerDB from "../dao/db/ProductManager.db.js";
import CartManagerDB from "../dao/db/CartManager.db.js";

const router = express.Router();
const productManager = new ProductManagerDB();
const cartManager = new CartManagerDB();

const getProducts = async () => {
    return { products: await productManager.get() };
};

const getPaginatedProducts = async (req) => {
    return { response: await productManager.getPaginated(req) };
};
const getCartProducts = async (req) => {
    return { response: await cartManager.getCartById(req) };
};

const renderPage = (pageName, objectFunc) => async (req, res) => {
    if (objectFunc) {
        const object = await objectFunc(req);
        res.render(pageName, object);
    } else {
        res.render(pageName, {});
    }
};

router.get("/", renderPage("home", getProducts));
router.get("/products", renderPage("products", getPaginatedProducts));
router.get("/realtimeproducts", renderPage("realTimeProducts"));
router.get("/carts/:cid", renderPage("cart", getCartProducts));

export default router;
