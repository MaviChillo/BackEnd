import supertest from 'supertest'
import { expect } from "chai";

const request = supertest('http://localhost:8080')


const prod = {
    title: 'iphone 7',
    description: 'iphone 7 pink',
    price: 400, 
    stock: 25,
    category: 'phone'
}

const prod1 = {
    title: 'iphone 8',
    description: 'iphone 8 pink',
    price: 500, 
    stock: 25,
    category: 'phone'
}

const admin = {
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123'
}

describe('Tests de endpoints de Products', function(){

    //comentar luego de probar 1 vez para no llenar base de datos

    it('Probando metodo POST de /api/products', async function(){
        const response = await request.post('/api/products').send(prod)
        console.log(response)
        expect(response.statusCode).to.be.equal(200)
        expect(response._body.message).to.be.equal('Product added successfully')
        expect(response._body).to.have.property('addNewProduct')
        expect(response._body.addNewProduct).to.have.property('_id')
    })

    it('Probar metodo GET de /api/products', async function(){
        const response = await request.get('/api/products')
        expect(response.statusCode).to.be.equal(200)
        expect(response._body).to.be.an('array')
        expect(response._body).to.not.have.lengthOf(0)
    })

    //comentar luego de probar 1 vez para no llenar base de datos

    it('Probar metodo GET de /api/products/:pid', async function(){
        const create = await request.post('/api/products').send(prod1)
        const pid = create._body.addNewProduct._id
        const proddb = await request.get(`/api/products/${pid}`)
        console.log(proddb)
        expect(proddb._body.product.title).to.be.equal(prod1.title)
        expect(proddb._body.product).to.have.property('code')
        expect(proddb._body.product).to.have.property('owner')
    })

    //comentar luego de probar 1 vez para no llenar base de datos

    it('Probar metodo PUT de /api/products/:pid', async function(){
        const create = await request.post('/api/products').send(prod)
        const pid = create._body.addNewProduct._id
        const login = await request.post('/users/login').send(admin)
        const response = await request.put(`/api/products/${pid}`).send({title: 'iphone 16'})
        const proddb = await request.get(`/api/products/${pid}`)
        expect(response.statusCode).to.be.equal(200)
        expect(response._body.message).to.be.equal('Product updated successfully')
        expect(response._body).to.have.property('updatedProd')
        expect(proddb.title).to.not.be.equal(prod.title)
    })

    it('Probar metodo DELETE de /api/products/:pid', async function(){
        const create = await request.post('/api/products').send(prod)
        const pid = create._body.addNewProduct._id
        const login = await request.post('/users/login').send(admin)
        const response = await request.delete(`/api/products/${pid}`)
        expect(response.statusCode).to.be.equal(200)
        expect(response._body.message).to.be.equal('Product deleted successfully')
        expect(response._body).to.have.property('deleteProd')
    })

})