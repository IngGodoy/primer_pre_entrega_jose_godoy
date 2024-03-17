import fs from "fs";

export class CartsManager {

    constructor (){
        this.path = "./src/manager/cart.json"
    };

    async getCarts(){
        try {
            if(fs.existsSync(this.path)) {
               const cartsJSON = await fs.promises.readFile(this.path, 'utf-8');
               return JSON.parse(cartsJSON); 
            } else return [];
        } catch (error) {
            console.log(error);
        };
    };

    #newIdCart(carts){
        let idMax = 0;
         carts.map((cart)=>{
            if(parseInt(cart.id) > idMax){
                idMax = parseInt(cart.id);
            };
        });
        return idMax + 1;   
    };

    async addCart(){
        try{
            const carts = await this.getCarts();
            const newCart= { 
                id : this.#newIdCart(carts),
                products : []
             };
             carts.push(newCart);
             await fs.promises.writeFile(this.path, JSON.stringify(carts));
             return newCart;
        }catch (error) {
            console.log(error);
        };
    };

    async getCartById(idCart){
        try{
            const carts = await this.getCarts();
            const cartById = carts.find((cart)=>cart.id===idCart);
            if(cartById){
                return cartById;
             }else{
                return false;
             };
        }catch(error) {
            console.log(error);
        };
    };
    
    async saveProductToCart(idCart, idProduct){
        const carts = await this.getCarts();
        const cartById = await this.getCartById(idCart);
        if (cartById){
            const indexProductByCart = cartById.products.findIndex((product) => product.id === idProduct);
            const indexCartById = carts.findIndex((cart) => cart.id === idCart);
            if (indexProductByCart != -1) {
                carts[indexCartById ].products[indexProductByCart].quantity ++; 
            } else{
                const newProduct = {
                    id: idProduct,
                    quantity: 1
                };
                cartById.products.push(newProduct);
                carts[indexCartById ] = cartById;
            };
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return cartById;
        }else return false;
    };
};