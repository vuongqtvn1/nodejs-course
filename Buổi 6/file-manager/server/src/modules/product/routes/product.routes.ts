import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validate } from "~/middlewares/validate";
import { productSchema } from "../validators/product.validator";

const router = Router();

router.post("/", validate(productSchema), ProductController.create);
router.get("/", ProductController.getAll);
router.get("/filters", ProductController.getFilters);
router.get("/:id", ProductController.getOne);
router.put("/:id", validate(productSchema), ProductController.update);
router.delete("/:id", ProductController.delete);

export default router;
