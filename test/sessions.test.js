import supertest from 'supertest'
import { expect } from "chai";

const userTest = {
    first_name: 'prueba',
    last_name: 'test',
    email: 'ptest@gmail.com',
    password: '12345'
}

const userTest1 = {
    email: 'mavi.chillo@gmail.com',
    password: '12345'
}


const request = supertest('http://localhost:8080')

describe('Test de endpoint de session', function(){

    let cookie

    //comentar signup una vez utilizado para no dar error. 
    //o cambiar propiedad email del userTest

    it('Prueba de registro metodo POST en /users/signup', async function(){
        const response = await request.post('/users/signup').send(userTest)
        console.log(response)
        expect(response.statusCode).to.be.equal(302)
        expect(response.request._data).to.be.an('object')
    })

    it('Prueba de login metodo POST en /users/login', async function(){
        const response = await request.post('/users/login').send(userTest1)
        // console.log(response.headers)
        const tokenCookie = response.headers['set-cookie'][0].split(';')[0]
        cookie ={
            name: tokenCookie.split('=')[0],
            value: tokenCookie.split('=')[1]
        }
        expect(cookie.name).to.equal('token')
        expect(response.request._data).to.be.an('object')
        expect(response.statusCode).to.be.equal(302)
    })

    it('Prueba de metodo GET en /api/sessions', async function(){
        const response = await request.get('/api/sessions/current').set('Cookie', `${cookie.name} = ${cookie.value}`)
        // console.log(response.statusCode)
        expect(response._body).to.have.property('user')
        expect(response.statusCode).to.be.equal(200)
    })


})