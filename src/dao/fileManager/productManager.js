import fs from 'fs'


export class ProductManager {

  constructor(path) {
    this.path = path
  }

  async getProducts(limit){
    try {
      if(fs.existsSync(this.path)){
        const infoProducts = await fs.promises.readFile(this.path, 'utf-8')
        if(limit === 'max'){
          console.log(infoProducts)
          return JSON.parse(infoProducts)
        }else{
          return JSON.parse(infoProducts).slice(0, limit)
        }
      } else {
        return []
      }
    } catch (error) {
      return error
    }
  }


  async addProduct(producto) {
    const {title,description,code,price,stock,category,thumbnail,status} = producto
    try {
      console.log(title,description,code,price,stock,category)
    if(!title || !description || !price || !code || !stock || !category) {
      return console.log('Error, product incomplete');
    } else {
        const isCode = await this.#evaluarCode(code)
        if(isCode){
          console.log('That code already exist, try again')
        } else {
          const product = {
            id: await this.#generarId(), 
            title,
            description,
            code,
            price,
            stock,
            category, 
            thumbnail: "../../img/iphone-13-pink-select-2021.png",
            status: true,
          }
          const read = await this.getProducts()
          read.push(product)
          console.log(read)
          await fs.promises.writeFile(this.path, JSON.stringify(read, null, 2))
          return product
        } 
    }
    } catch(error) {
      console.log(error)
      return error
    } 
  }

  async getProductById(idProduct){
    try {
      const read = await this.getProducts()
      const prod = read.find((p)=>p.id===parseInt(idProduct))
      if(prod){
        console.log(prod)
        return prod
      }else{
        return 'product not found'
      }
    } catch(error) {
      console.log(error)
      return error
    }
  }

  async updateProduct(idProduct, change){
    let read = await fs.promises.readFile(this.path, 'utf-8')
    read = JSON.parse(read)
    let product = await this.getProductById(idProduct)
    if(product){
      product = {...product, ...change}
      read = read.map(prod => {
        if(prod.id == product.id){
          prod = product
        }
        return prod
      })
      read = JSON.stringify(read, null, 2)
      await fs.promises.writeFile(this.path, read)
      console.log(JSON.parse(read))
      return read
    }else{
      return null
    }
  }

  async deleteProduct(idProduct){
    try {
      let read = await fs.promises.readFile(this.path, 'utf-8')
    read = JSON.parse(read)
    let product = await this.getProductById(idProduct)
    if(product){
      const filtrado =read.filter(prod => prod.id != idProduct)
      await fs.promises.writeFile(this.path, JSON.stringify(filtrado, null, 2))
      return filtrado
    }
    } catch (error) {
      console.log(error)
      return error
    }
  }


  async #generarId() {
    const read = await this.getProducts()
    let id =
      read.length === 0
        ? 1
        : read[read.length - 1].id + 1
    return id
  }

  // async #evaluarProductoId(id){
  //   const read = await this.getProducts()
  //   const findId = read.find((product)=>product.id === id)
  //   return findId
  // }

  async #evaluarCode(code){
    const read = await this.getProducts()
    const findCode = read.find((product)=>product.code === code)
    return findCode
  }
}







































