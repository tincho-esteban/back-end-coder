import FileManager from "./FileManager.js";
import ProductManager from "./ProductManager.js";
import path from "path";

const productsFilePath = path.resolve(process.cwd(), "public", "products.json");
const productManager = new ProductManager(productsFilePath);

class CartManager extends FileManager {
    async createCart() {
        try {
            const carts = await this.get();
            const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
            const newCart = { id: newId, products: [] };
            carts.push(newCart);
            await this.write(carts);
            return newCart;
        } catch (error) {
            throw error;
        }
    }

    async findCartAndProduct(cid, pid) {
        const [carts, products] = await Promise.all([
            this.get(),
            productManager.get(),
        ]);
        const cart = carts.find((cart) => cart.id == cid);
        const product = products.find((product) => product.id == pid);

        if (!cart) throw new Error("Carrito no encontrado");

        if (!product && pid != null) throw new Error("Producto no encontrado");

        return { cart, product, carts };
    }

    async addProduct(cid, pid) {
        const { cart, product, carts } = await this.findCartAndProduct(
            cid,
            pid,
        );

        if (!product) throw new Error("Producto no encontrado");

        const productInCart = cart.products.find(
            (product) => product.id === pid,
        );

        if (productInCart) productInCart.quantity++;
        else cart.products.push({ id: pid, quantity: 1 });

        await this.write(carts);
        return { message: "Producto agregado al carrito" };
    }
}

export default CartManager;
