import { Router } from "express";

import authModule from "./auth/auth.module";
import productModule from "./product/product.module";

const modules = Router();

modules.use("/", productModule);
modules.use("/", authModule);

export default modules;
