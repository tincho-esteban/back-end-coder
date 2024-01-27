import FileManager from "./FileManager.js";

class CartManager extends FileManager {
    async createCart() {
        try {
            const carts = await this.get();
            const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
            const newCart = { id: newId, products: [] };

            carts.push(newCart);
            await this.write(carts);
            return newCart;
        } catch (err) {
            throw err;
        }
    }

    findCartById(carts, cartId) {
        const cart = carts.find((cart) => cart.id === cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        return cart;
    }

    async addProduct(cartId, productId) {
        try {
            const carts = await this.get();
            const cart = this.findCartById(carts, cartId);

            cart.products.push(productId);
            await this.write(carts);
        } catch (err) {
            throw err;
        }
    }

    async deleteProduct(cartId, productId) {
        try {
            const carts = await this.get();
            const cart = this.findCartById(carts, cartId);

            const index = cart.products.findIndex(
                (product) => product === productId,
            );
            if (index === -1) {
                throw new Error("Producto no encontrado");
            }

            cart.products.splice(index, 1);
            await this.write(carts);
        } catch (err) {
            throw err;
        }
    }
}

export default CartManager;
