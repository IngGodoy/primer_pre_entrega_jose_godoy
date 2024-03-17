import {Router} from "express";
import {CartsManager} from "../manager/cartsManager.js"
import fs from "fs";

const router = Router();
const cartsManager = new CartsManager();
const productPath = "./src/manager/products.json"


router.post("/", async (request, response)=>{
    try{
        const newCart = await cartsManager.addCart();
        response.status(200).json(newCart); 
      
    }catch (error){
        response.status(500).json(error.message);
    };  
});

router.get("/:cid", async (request, response) => {
    const {cid} = request.params;
    const idCart = parseInt(cid);
    const cartById = await cartsManager.getCartById(idCart);
    if (cartById){
        const cartProducts = { products:cartById.products };
        response.status(200).json(cartProducts);
    } else response.status(400).json("Not found cart by id");
});

router.post("/:cid/product/:pid", async (request, response) => {
    const {cid} = request.params;
    const {pid} = request.params;
    console.log("ver id cart::"+cid+"ver id product::"+pid);
    const idCart = parseInt(cid);
    const idProdt = parseInt(pid);
    const productsJSON = await fs.promises.readFile(productPath, 'utf-8');
    const products = JSON.parse(productsJSON);
    const checkProduct = products.find ((product) => product.id === idProdt);
    if(checkProduct){
       const cart = await cartsManager.saveProductToCart(idCart, idProdt);
       if (cart){
        response.status(200).json(cart);
    } else response.status(400).json("Not found cart by id");
    }else response.status(400).json("Not found product by id");

});

export default router;