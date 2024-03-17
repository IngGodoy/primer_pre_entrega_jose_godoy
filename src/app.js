import express from "express";
import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";


const app = express();
const PORT = 8080;
app.use(express.json());
app.listen(PORT, ()=> console.log("server ok on port: " + PORT));

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);


