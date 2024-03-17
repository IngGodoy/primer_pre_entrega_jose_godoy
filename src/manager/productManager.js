import fs from "fs";
//const fs = require('fs');

class ProductManager {

  constructor(file) {
    //ruta del archivo donde se van a guardar los datos
    this.path = file;
  };

  async getProducts(){
    try {
      if(fs.existsSync(this.path)) {
         const productsJSON = await fs.promises.readFile(this.path, 'utf-8');
         return JSON.parse(productsJSON);
      } else return [];
    } catch (error) {
      console.log(error);
    };
  };

  async addProduct(newProduct) {

    const {title, description, price, thumbnail, code, stock} = newProduct 
    try {
    const products = await this.getProducts();  
    //verificar codigo del producto
    const checkCode = products.find((product)=> product.code === code);
    console.log("verificación de codigo: ",checkCode) //error.,
    if (checkCode){
      return "product code error";
    };

    const newProduct = {
      id : this.#newId(products),
      title,
      description,
      price,
      thumbnail,
      code,
      stock: stock ? stock : 0,
    };

    console.log("ver nuevo producto:: ", newProduct);

    //verificar que todos los campos del producto esten completos
    if(!this.#checkProduct(newProduct)){
      console.log("product error")
      return "product error" 
    };
 
    products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products));
    console.log("lista de productos: ", products);
    return newProduct; 

    } catch (error) {
      console.log(error);
    };
  };



  #newId(products){
    console.log("ver tamaño de la array ",products.length < 1) //borrar
    if(products.length < 1) return 1
    const newId = products.length + 1;
    console.log("nuevo Id: ", newId)
    return newId;
  };

  #checkProduct(product){

    for (let clave in product) {
        if (product[clave] === null || product[clave] === undefined) {
          return false;
        };
      };

    return true;
  };

  async getProductById(id){

    const products = await this.getProducts();
    const productById = products.find((product) => product.id === id);

    if(!productById){
      return "error Id Product"
    };

    return productById;
  };

  async updateProduct(id, product){

    const {title, description, price, thumbnail, code, stock} = product;
    const productById = await this.getProductById(id);
    if(!productById) {
      console.log("error Id Product")
      return "error Id Product"
    };

    const updateProduct = {
      id : id, 
      title : title, 
      description : description, 
      price : price, 
      thumbnail : thumbnail, 
      code : code, 
      stock : stock
    };

    console.log("updateProduct: ", updateProduct);

    const products = await this.getProducts();

    const index = products.findIndex(product => product.id == id);
    console.log("indice: ", index);
    products[index] = updateProduct;

    await fs.promises.writeFile(this.path, JSON.stringify(products));
    console.log("lista de productos actualizada: ", products);

    return updateProduct;
  };

  async deletecProduct (id){
    const productById = await this.getProductById(id);
    if(!productById) {
      console.log("error Id Product")
      return "error Id Product"
    };
    const products = await this.getProducts();

    const index = products.findIndex(product => product.id == id);
    products.splice(index, 1); //borrar el producto 
    console.log("productos eliminados: ", products);
    await fs.promises.writeFile(this.path, JSON.stringify(products));
    return products
  }

};

export default ProductManager;
