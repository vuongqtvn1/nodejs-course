import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cookieParser from "cookie-parser";
import session from "express-session";
import logger from "./logger";
import { HttpResponse } from "./http-response";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("images"));

// app.use(cors({ origin: "http://localhost:5173" }));
app.use(morgan("dev"));

const allowedOrigins = ["http://localhost:5173", "http://localhost:6000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(helmet());
app.use(compression());
app.use(cookieParser());

// ddos, cloudflare, rate-limiting, etc. devops
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }, // Đặt true nếu dùng HTTPS
  })
);

// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
//   next(); // Chuyển tiếp request đến middleware tiếp theo
// });

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
};

// app.use(checkAuth);

const products = [
  { id: 1, name: "Product 1" },
  { id: 2, name: "Product 2" },
];
// /categories
app.post(
  "/products",
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    next();
  },
  (req: Request, res: Response) => {
    const data = req.body;

    console.log({ data });

    products.push(data);

    res.status(201).json({
      data: products,
    });
  }
);

// token => localstorage, cookie, session, header

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

app.get(
  "/products",
  asyncHandler((req: Request, res: Response, next: NextFunction) => {
    // logger.info("Da vao routes san pham", products);

    res.status(204).json(HttpResponse.Paginate(products));
  })
);

app.post("/validate-product", (req, res) => {
  // admin => manage-product, delete-product
  const authorization = req.headers.authorization;
  const { name, desc } = req.body;

  if (!authorization) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // const user = getUserByToken(authorization);

  // if (user.role !== "admin") {
  //   res.status(403).json({ message: "Forbidden" });
  //   return;
  // }

  // if (user.permission.includes("manage-product")) {
  //   res.status(403).json({ message: "Forbidden" });
  //   return;
  // }

  // if (!name) {
  //   res.status(400).json({ message: "Name is required" });
  // }

  // const product = getProductById(id)

  // if (!product) res.status(404).json({ message: "Product not found" });

  // res.status(204);
});

app.get("/order-products", (req, res) => {
  res.json({ message: "Order products" });
});

// app.get("/products/:key/:value", (req, res) => {
app.get("/products1", (req, res) => {
  // const keyFilter = req.params.keyFilter;
  // const valueFilter = req.params.valueFilter;

  // const products = products.find(
  //   (product) => product[keyFilter] === valueFilter
  // );

  console.log(req.query);
  res.json(products);
});

// {
//   name: "adidas",
//   desc: "3122321",
//   isShow: true,
// }

app.delete("/products/:id", (req, res) => {
  const id = req.params.id;
  res.json(products.filter((product) => product.id !== parseInt(id)));
});

app.get(
  "/products/:id",
  checkAuth,
  asyncHandler((req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;

    const product = products.find(
      (product) => product.id === parseInt(productId)
    );

    res.status(200).json(product);
  })
);

// handler notfound
app.use("*", (req, res, next) => {
  next(HttpResponse.notFound("Không tìm thấy api nay"));
});

// handler error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.message} - ${req.method} ${req.url} - ${req.ip}`);
  res.status(500).json(HttpResponse.error(err.message));
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`⚡ Server is running on http://localhost:${PORT}`);
});
