import { Server } from "socket.io";
import ProductManager from "../managers/ProductManager.js";
import app from "./appConfig.js";
import path from "path";

const port = 8080;

const productsFilePath = path.resolve(process.cwd(), "public", "products.json");
const productManager = new ProductManager(productsFilePath);

const httpServer = app.listen(port, () => {
    console.log(`Servidor iniciado en puerto: ${port}`);
});
const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");
    socket.on("newProduct", (product) => {
        try {
            productManager.addProduct(product);
            io.emit("refresh");
        } catch (error) {
            console.error(error);
        }
    });

    socket.on("deleteProduct", async (data) => {
        try {
            await productManager.deleteProduct(data);
            io.emit("refresh");
        } catch (error) {
            if (error.message === "Producto no encontrado") {
                console.error(
                    `El producto con el ID ${data} no existe y no puede ser borrado.`,
                );
            } else {
                console.error(error);
            }
        }
    });
});

export { httpServer, io };
