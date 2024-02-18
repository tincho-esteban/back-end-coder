import cartModel from "../models/cart.model.js";
import ProductModel from "../models/Product.model.js";

class CartManagerDB {
    async get() {
        return cartModel.find({});
    }

    async createCart() {
        return cartModel.create({ products: [] });
    }

    async findCartAndProduct(cid, pid) {
        const cart = await cartModel.findById(cid);
        if (!cart) throw new Error("Carrito no encontrado");

        if (pid != null) {
            const product = await ProductModel.findById(pid);
            if (!product) throw new Error("Producto no encontrado");
        }

        return cart;
    }

    async addProduct(cid, pid) {
        const cart = await this.findCartAndProduct(cid, pid);

        const productInCart = cart.products.find(
            (product) => product.id === pid,
        );

        if (productInCart) productInCart.quantity++;
        else cart.products.push({ id: pid, quantity: 1 });

        await cart.save();
        return "Producto agregado al carrito";
    }

    async insertion(carts) {
        const cartsDB = await cartModel.find({});

        if (cartsDB.length > 0) return "Carritos ya insertados";

        await cartModel.insertMany(carts);
        return this.get();
    }
}

export default CartManagerDB;
