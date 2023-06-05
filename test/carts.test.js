import supertest from 'supertest'
import { expect } from "chai";

const request = supertest('http://localhost:8080')

const premium = {
    email: 'mavi.chillo@gmail.com',
    password: '12345'
}

const prod = {
    products:[
        {
            product: '64659ce40f5c8bf955653c07',
            quantity: 1
        }
    ]
}

describe('Tests de endpoints de Carts', function(){

    //comentar luego de probar 1 vez para no llenar base de datos

    it('Probando metodo POST de /api/carts', async function(){
        const response = await request.post('/api/carts')
        expect(response.statusCode).to.be.equal(200)
        expect(response._body.message).to.be.equal('Cart created successfully')
        expect(response._body).to.have.property('newCart')
        expect(response._body.newCart).to.have.property('_id')
    })

    it('Probar metodo GET de /api/carts', async function(){
        const response = await request.get('/api/carts')
        expect(response.statusCode).to.be.equal(200)
        expect(response._body).to.be.an('array')
        expect(response._body).to.not.have.lengthOf(0)
    })

    // comentar luego de probar 1 vez para no llenar base de datos

    it('Probar metodo GET de /api/carts/:cid', async function(){
        const create = await request.post('/api/carts')
        const cid = create._body.newCart._id
        const cartdb = await request.get(`/api/carts/${cid}`)
        expect(cartdb.statusCode).to.be.equal(200)
        expect(cartdb._body).to.have.property('cart')
        expect(cartdb._body.cart).to.have.property('_id')
    })

    
    // comentar luego de probar 1 vez para no llenar base de datos
    
    it('Probar metodo PUT de /api/carts/:cid', async function(){
        const create = await request.post('/api/carts')
        const cid = create._body.newCart._id
        const login = await request.post('/users/login').send(premium)
        const response = await request.put(`/api/carts/${cid}`).send(prod)
        expect(response.statusCode).to.be.equal(200)
        expect(response._body.message).to.be.equal('product added successfully')
        expect(response._body).to.have.property('newCart')
        expect(response._body.newCart.products).to.not.have.lengthOf(0)
    })

    // comentar luego de probar 1 vez para no llenar base de datos
    
    it('Probando metodo POST de /api/carts/:cid/purchase', async function(){
        const create = await request.post('/api/carts')
        const cid = create._body.newCart._id
        const login = await request.post('/users/login').send(premium)
        const addProd = await request.put(`/api/carts/${cid}`).send(prod)
        const response = await request.post(`/api/carts/${cid}/purchase`)
        expect(response.statusCode).to.be.equal(200)
        expect(response._body.message).to.be.equal("Purchase successful. Here's your Ticket:")
        expect(response._body).to.have.property('ticket')
    })


    //comentar luego de probar 1 vez para no llenar base de datos

    it('Probar metodo PUT de /api/carts/:cid/product/:pid', async function(){
        const create = await request.post('/api/carts')
        const cid = create._body.newCart._id
        const login = await request.post('/users/login').send(premium)
        const addProd = await request.put(`/api/carts/${cid}`).send(prod)
        const pid = addProd._body.newCart.products[0].product
        const response = await request.put(`/api/carts/${cid}/product/${pid}`).send({quantity: '2'})
        expect(response.statusCode).to.be.equal(200)
        expect(response._body.message).to.be.equal("product's quantity updated successfully")
        expect(response._body).to.have.property('updatedCart')
        expect(response._body.updatedCart.products[0].quantity).to.not.be.equal(prod.products.quantity)
    })

    //comentar luego de probar 1 vez para no llenar base de datos

    it('Probar metodo DELETE de /api/carts/:cid', async function(){
        const create = await request.post('/api/carts')
        const cid = create._body.newCart._id
        const response = await request.delete(`/api/carts/${cid}`)
        expect(response.statusCode).to.be.equal(200)
        expect(response._body.message).to.be.equal('cart emptied successfully')
        expect(response._body).to.have.property('cartEmpty')
    })

    //comentar luego de probar 1 vez para no llenar base de datos

    it('Probar metodo DELETE de /api/carts/:cid/product/:pid', async function(){
        const create = await request.post('/api/carts')
        const cid = create._body.newCart._id
        const login = await request.post('/users/login').send(premium)
        const addProd = await request.put(`/api/carts/${cid}`).send(prod)
        const pid = addProd._body.newCart.products[0].product
        const response = await request.delete(`/api/carts/${cid}/product/${pid}`)
        expect(response.statusCode).to.be.equal(200)
        expect(response._body.message).to.be.equal('product deleted successfully')
    })

    it('Probar metodo DELETE de /api/carts/delete/:cid', async function(){
        const create = await request.post('/api/carts')
        const cid = create._body.newCart._id
        const response = await request.delete(`/api/carts/delete/${cid}`)
        expect(response.statusCode).to.be.equal(200)
        expect(response._body.message).to.be.equal('cart deleted successfully')
    })

})