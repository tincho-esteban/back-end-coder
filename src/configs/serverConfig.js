import { Server } from "socket.io";
import ProductManager from "../dao/db/ProductManager.db.js";
import app from "./appConfig.js";
import displayRoutes from "express-routemap";
import messageModel from "../dao/models/message.model.js";

const port = 8080;
const productManager = new ProductManager();

const httpServer = app.listen(port, () => {
    displayRoutes(app);
    console.log(`Servidor iniciado en puerto: ${port}`);
});
const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");
    socket.on("newProduct", async (product) => {
        try {
            await productManager.addProduct(product);
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
            console.error(
                error.message === "Producto no encontrado"
                    ? `El producto con el ID ${data} no existe y no puede ser borrado.`
                    : error,
            );
        }
    });

    socket.on("message", async (data) => {
        await messageModel.create(data);
        const messages = await messageModel.find({});
        io.emit("messages", messages);
    });
});

export { httpServer, io };
