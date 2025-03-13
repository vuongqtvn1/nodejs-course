import productRoutes from "./routes/product.routes";
import { Router } from "express";

const productModule = Router();
productModule.use("/products", productRoutes);

export default productModule;
