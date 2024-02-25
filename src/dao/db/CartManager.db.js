import path from "path";
import CartManagerFS from "../fs/CartManager.js";
import cartModel from "../models/cart.model.js";
import ProductModel from "../models/Product.model.js";

const cartsFilePath = path.resolve(process.cwd(), "public", "carts.json");
const cartManagerFS = new CartManagerFS(cartsFilePath);

class CartManagerDB {
    async findCartAndProduct(cid, pid) {
        const cart = await cartModel.findById(cid);
        if (!cart) throw new Error("Carrito no encontrado");

        if (pid != null) {
            const product = await ProductModel.findById(pid);
            if (!product) throw new Error("Producto no encontrado");
        }

        return cart;
    }

    async get() {
        const cart = await cartModel.find({});
        return {
            status: "success",
            payload: cart,
            message: "Carritos obtenidos correctamente",
            code: 200,
        };
    }

    async getCartById(req) {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid);
        return {
            status: "success",
            payload: cart,
            message: `Carrito con id ${cid} encontrado`,
            code: 200,
        };
    }

    async createCart() {
        const cart = await cartModel.create({ products: [] });
        return {
            status: "success",
            payload: cart,
            message: "Carrito creado correctamente",
            code: 200,
        };
    }

    async addProduct(req) {
        const { cid, pid } = req.params;
        const cart = await this.findCartAndProduct(cid, pid);

        const productInCart = cart.products.find((product) =>
            product.product.equals(pid),
        );

        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        cart.markModified("products");

        await cart.save();
        return {
            status: "success",
            payload: cart,
            message: `Producto con id ${pid} agregado al carrito`,
            code: 200,
        };
    }

    async deleteProduct(req) {
        const { cid, pid } = req.params;
        const cart = await this.findCartAndProduct(cid, pid);

        cart.products = cart.products.filter((product) =>
            product.product.equals(pid),
        );

        cart.markModified("products");

        await cart.save();
        return {
            status: "success",
            payload: cart,
            message: `Producto con id ${pid} borrado del carrito`,
            code: 200,
        };
    }

    async insertion() {
        try {
            let FScarts = await cartManagerFS.get();
            FScarts = FScarts.map(({ id, ...rest }) => rest);

            await cartModel.insertMany(FScarts);
            const carts = this.get();
            return {
                status: "success",
                payload: carts,
                message: "Carritos insertados correctamente",
                code: 200,
            };
        } catch (error) {
            throw new Error("Error al insertar los carritos: " + error.message);
        }
    }

    async updateCart(req) {
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await this.findCartAndProduct(cid, null);

        if (!products || !Array.isArray(products))
            throw new Error("Formato de productos incorrecto");

        cart.products = products;

        await cart.save();
        return {
            status: "success",
            payload: cart,
            message: `Carrito con id ${cid} actualizado`,
            code: 200,
        };
    }

    async updateProduct(req) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await this.findCartAndProduct(cid, pid);

        const productInCart = cart.products.find((product) =>
            product.product.equals(pid),
        );

        if (!productInCart)
            throw new Error("Producto no encontrado en el carrito");

        productInCart.quantity = quantity;

        cart.markModified("products");

        await cart.save();
        return {
            status: "success",
            payload: cart,
            message: `Producto con id ${pid} actualizado en el carrito`,
            code: 200,
        };
    }

    async deleteCartProducts(req) {
        const { cid } = req.params;
        const cart = await this.findCartAndProduct(cid, null);

        cart.products = [];

        await cart.save();
        return {
            status: "success",
            payload: cart,
            message: `Productos del carrito con id ${cid} borrados`,
            code: 200,
        };
    }
}

export default CartManagerDB;
