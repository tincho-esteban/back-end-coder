import path from "path";
import ProductModel from "../models/Product.model.js";
import ProductManager from "../fs/ProductManager.js";

const productsFilePath = path.resolve(process.cwd(), "public", "products.json");
const productManagerFS = new ProductManager(productsFilePath);

class ProductManagerDB {
    async get() {
        return ProductModel.find({});
    }

    async getProductById(req) {
        const { pid } = req.params;
        const product = await ProductModel.findById(pid);
        if (!product)
            throw new Error(`Error: Producto con id ${pid} no encontrado`);

        return {
            status: "success",
            payload: product,
            message: `Producto con id ${pid} encontrado`,
            code: 200,
        };
    }

    async getPaginated(req) {
        const {
            page = 1,
            limit = 10,
            sort,
            sortField,
            query,
            queryField,
        } = req.query;

        let sortObj = {};

        if (sortField && sort) {
            sortObj[sortField] = sort === "1" ? 1 : -1;
        } else if (sort) {
            sortObj["price"] = sort === "1" ? 1 : -1;
        }

        let searchQuery = {};

        if (query && queryField) {
            searchQuery[queryField] = new RegExp(query, "i");
        } else if (query) {
            if (query === "available") {
                searchQuery = { stock: { $gt: 0 } };
            } else if (query === "notAvailable") {
                searchQuery = { stock: 0 };
            } else {
                searchQuery["$or"] = [
                    { title: new RegExp(query, "i") },
                    { description: new RegExp(query, "i") },
                    { code: new RegExp(query, "i") },
                ];
            }
        }

        const pagination = await ProductModel.paginate(searchQuery, {
            page,
            limit,
            sort: sortObj,
        });

        if (pagination.page > pagination.totalPages || pagination.page < 1) {
            return {
                status: "error",
                message: "La página solicitada no existe",
            };
        }

        const prevLink = pagination.hasPrevPage
            ? `http://localhost:8080/products?page=${
                  pagination.prevPage
              }&limit=${limit}${sort ? `&sort=` + sort : ""}${
                  sortField ? `&sortField=` + sortField : ""
              }${query ? `&query=` + query : ""}${
                  queryField ? `&queryField=` + queryField : ""
              }`
            : null;

        const nextLink = pagination.hasNextPage
            ? `http://localhost:8080/products?page=${
                  pagination.nextPage
              }&limit=${limit}${sort ? `&sort=` + sort : ""}${
                  sortField ? `&sortField=` + sortField : ""
              }${query ? `&query=` + query : ""}${
                  queryField ? `&queryField=` + queryField : ""
              }`
            : null;

        return {
            status: "success",
            payload: pagination.docs,
            totalPages: pagination.totalPages,
            prevPage: pagination.prevPage,
            nextPage: pagination.nextPage,
            page: pagination.page,
            hasPrevPage: pagination.hasPrevPage,
            hasNextPage: pagination.hasNextPage,
            prevLink,
            nextLink,
        };
    }

    async addProduct(req) {
        const { body: product, files } = req;

        if (!product) throw new Error("Error: Producto no proporcionado");

        const existingProduct = await ProductModel.findOne({
            code: product.code,
        });
        if (existingProduct)
            throw new Error("Error: Ya existe un producto con ese código");

        const productStored = await ProductModel.create(product);

        if (files) {
            const filenames = files.map((file) => file.filename);
            productStored.setImgUrl(filenames);
            await productStored.save();
        }

        return {
            status: "success",
            payload: productStored,
            message: "Producto añadido correctamente",
            code: 201,
        };
    }

    async updateProduct(req) {
        const { pid } = req.params;
        const updateProduct = req.body;
        const product = await ProductModel.findByIdAndUpdate(
            pid,
            updateProduct,
            {
                new: true,
            },
        );
        if (!product)
            throw new Error(
                `Error: Producto con id ${pid} no encontrado al intentar actualizar`,
            );

        return {
            status: "success",
            payload: product,
            message: `Producto con id ${pid} actualizado correctamente`,
            code: 200,
        };
    }

    async deleteProduct(req) {
        const { pid } = req.params;
        const product = await ProductModel.findByIdAndDelete(pid);
        if (!product)
            throw new Error(
                `Error: Producto con id ${pid} no encontrado al intentar eliminar`,
            );

        return {
            status: "success",
            payload: product,
            message: `Producto con id ${pid} eliminado correctamente`,
            code: 200,
        };
    }

    async insertion() {
        try {
            let FSproducts = await productManagerFS.get();
            FSproducts = FSproducts.map(({ id, ...rest }) => rest);

            const existingProducts = await this.get();

            const productsToInsert = FSproducts.filter(
                (product) =>
                    !existingProducts.some(
                        (existingProduct) =>
                            existingProduct.code === product.code,
                    ),
            );

            if (!productsToInsert.length)
                throw new Error("No hay productos para insertar");

            await ProductModel.insertMany(productsToInsert);
            const products = this.get();
            return {
                status: "success",
                payload: products,
                message: "Productos insertados correctamente",
                code: 201,
            };
        } catch (error) {
            throw new Error("Error al insertar productos: " + error.message);
        }
    }
}

export default ProductManagerDB;
