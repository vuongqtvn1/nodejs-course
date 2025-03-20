import { Router } from "express";

import productRoutes from "./routes/auth.routes";
import "./middlewares/passport";

const authModule = Router();

authModule.use("/auth", productRoutes);

export default authModule;
